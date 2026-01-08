import React from 'react';
import type { Player, CricketData } from '../../types/game.types';
import { CRICKET_NUMBERS, getMarkSymbol, isNumberClosed } from '../../logic/cricketLogic';
import styles from './CricketBoard.module.css';

/**
 * Cricket Board Component
 * Interactive board showing marks for all players
 * Clicking a number adds a mark for the current player
 */

interface CricketBoardProps {
  players: Player[];
  gameData: CricketData;
  currentPlayerIndex: number;
  onNumberClick: (number: number) => void;
  disabled?: boolean;
}

export const CricketBoard: React.FC<CricketBoardProps> = ({
  players,
  gameData,
  currentPlayerIndex,
  onNumberClick,
  disabled = false,
}) => {
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div className={styles.numberHeader}>Number</div>
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`${styles.playerHeader} ${
                index === currentPlayerIndex ? styles.currentPlayer : ''
              }`}
            >
              {player.name}
            </div>
          ))}
        </div>

        {/* Number Rows */}
        {CRICKET_NUMBERS.map((number) => (
          <div key={number} className={styles.numberRow}>
            {/* Number Label (clickable for current player) */}
            <button
              className={`${styles.numberCell} ${
                disabled ? '' : styles.clickable
              }`}
              onClick={() => !disabled && onNumberClick(number)}
              disabled={disabled}
            >
              <span className={styles.numberLabel}>
                {number === 25 ? 'Bull' : number}
              </span>
            </button>

            {/* Player Marks */}
            {players.map((player) => {
              const marks = gameData.marks[player.id]?.[number] ?? 0;
              const closed = isNumberClosed(gameData.marks, player.id, number);
              const extraMarks = Math.max(0, marks - 3);

              return (
                <div
                  key={player.id}
                  className={`${styles.markCell} ${
                    closed ? styles.closed : ''
                  }`}
                >
                  <span className={styles.markSymbol}>
                    {getMarkSymbol(marks)}
                  </span>
                  {extraMarks > 0 && (
                    <span className={styles.extraMarks}>
                      +{extraMarks * number}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* Points Row */}
        <div className={`${styles.numberRow} ${styles.pointsRow}`}>
          <div className={styles.numberCell}>
            <span className={styles.numberLabel}>Points</span>
          </div>
          {players.map((player) => (
            <div key={player.id} className={styles.pointsCell}>
              <span className={`${styles.pointsValue} tabular-nums`}>
                {gameData.points[player.id] ?? 0}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Player Instruction */}
      {!disabled && currentPlayer && (
        <div className={styles.instruction}>
          <p className={styles.instructionText}>
            <strong>{currentPlayer.name}'s turn:</strong> Click a number to add marks
          </p>
          <p className={styles.instructionHint}>
            Click again on the same number to add more marks (or undo)
          </p>
        </div>
      )}
    </div>
  );
};


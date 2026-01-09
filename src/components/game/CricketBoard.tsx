import React from 'react';
import type { Player, CricketData } from '../../types/game.types';
import { CRICKET_NUMBERS, getMarkSymbol, isNumberOpen, isNumberClosedForAll } from '../../logic/cricketLogic';
import styles from './CricketBoard.module.css';

/**
 * Cricket Board Component
 * Interactive scoreboard - click any cell to add a mark for that player/number
 * NO TURNS - any player can add marks at any time
 */

interface CricketBoardProps {
  players: Player[];
  gameData: CricketData;
  onMarkAdd: (playerId: string, number: number) => void;
  disabled?: boolean;
}

export const CricketBoard: React.FC<CricketBoardProps> = ({
  players,
  gameData,
  onMarkAdd,
  disabled = false,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          <div className={styles.numberHeader}>Number</div>
          {players.map((player) => (
            <div key={player.id} className={styles.playerHeader}>
              {player.name}
            </div>
          ))}
        </div>

        {/* Number Rows */}
        {CRICKET_NUMBERS.map((number) => {
          const isClosedForAll = isNumberClosedForAll(gameData.marks, players, number);

          return (
            <div key={number} className={styles.numberRow}>
              {/* Number Label */}
              <div className={styles.numberCell}>
                <span className={styles.numberLabel}>
                  {number === 25 ? 'Bull' : number}
                </span>
              </div>

              {/* Player Cells - Clickable */}
              {players.map((player) => {
                const marks = gameData.marks[player.id]?.[number] ?? 0;
                const isOpen = isNumberOpen(gameData.marks, player.id, number);

                return (
                  <button
                    key={player.id}
                    className={`${styles.markCell} ${
                      isClosedForAll ? styles.closedForAll : isOpen ? styles.playerOpen : ''
                    }`}
                    onClick={() => !disabled && onMarkAdd(player.id, number)}
                    disabled={disabled}
                  >
                    {isOpen ? (
                      // Show ⊗ when open
                      <span className={styles.openSymbol}>⊗</span>
                    ) : (
                      // Show marks (/, X) when not open yet
                      <span className={styles.markSymbol}>
                        {getMarkSymbol(marks)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}

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
    </div>
  );
};

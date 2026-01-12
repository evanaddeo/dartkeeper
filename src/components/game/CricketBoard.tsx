import React from 'react';
import type { Player, CricketData } from '../../types/game.types';
import { CRICKET_NUMBERS, getMarkSymbol, isNumberOpen, isNumberClosedForAll } from '../../logic/cricketLogic';
import styles from './CricketBoard.module.css';

/**
 * Cricket Board Component
 * Interactive scoreboard - click any cell to add a mark for that player/number
 * NO TURNS - any player can add marks at any time
 * Layout: Players split with numbers column in the middle
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
  // Split players: left side gets half (rounded up), right side gets the rest
  const midPoint = Math.ceil(players.length / 2);
  const leftPlayers = players.slice(0, midPoint);
  const rightPlayers = players.slice(midPoint);
  
  // If odd number of players, add a dummy player to right side for layout
  const needsDummy = leftPlayers.length !== rightPlayers.length;
  
  // Calculate grid template: equal space on left, fixed numbers column, equal space on right
  const gridTemplate = `${leftPlayers.length}fr 80px ${rightPlayers.length + (needsDummy ? 1 : 0)}fr`;
  
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {/* Header Row */}
        <div className={styles.headerRow} style={{ gridTemplateColumns: gridTemplate }}>
          {/* Left Players */}
          {leftPlayers.map((player, index) => (
            <div key={player.id} className={styles.playerHeader}>
              <span className={styles.playerNumber}>{index + 1}</span>
              <span className={styles.playerName}>{player.name}</span>
            </div>
          ))}
          
          {/* Numbers Column Header */}
          <div className={styles.numberHeader}>Number</div>
          
          {/* Right Players */}
          {rightPlayers.map((player, index) => (
            <div key={player.id} className={styles.playerHeader}>
              <span className={styles.playerNumber}>{midPoint + index + 1}</span>
              <span className={styles.playerName}>{player.name}</span>
            </div>
          ))}
          
          {/* Dummy column if needed */}
          {needsDummy && <div className={styles.playerHeader}></div>}
        </div>

        {/* Number Rows */}
        {CRICKET_NUMBERS.map((number) => {
          const isClosedForAll = isNumberClosedForAll(gameData.marks, players, number);

          return (
            <div key={number} className={styles.numberRow} style={{ gridTemplateColumns: gridTemplate }}>
              {/* Left Player Cells */}
              {leftPlayers.map((player) => {
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
                      <span className={styles.openSymbol}>⊗</span>
                    ) : (
                      <span className={styles.markSymbol}>
                        {getMarkSymbol(marks)}
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Number Label in Middle */}
              <div className={styles.numberCell}>
                <span className={styles.numberLabel}>
                  {number === 25 ? 'Bull' : number}
                </span>
              </div>

              {/* Right Player Cells */}
              {rightPlayers.map((player) => {
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
                      <span className={styles.openSymbol}>⊗</span>
                    ) : (
                      <span className={styles.markSymbol}>
                        {getMarkSymbol(marks)}
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Dummy cell if needed */}
              {needsDummy && <div className={styles.dummyCell}></div>}
            </div>
          );
        })}

        {/* Points Row */}
        <div className={`${styles.numberRow} ${styles.pointsRow}`} style={{ gridTemplateColumns: gridTemplate }}>
          {/* Left Player Points */}
          {leftPlayers.map((player) => (
            <div key={player.id} className={styles.pointsCell}>
              <span className={`${styles.pointsValue} tabular-nums`}>
                {gameData.points[player.id] ?? 0}
              </span>
            </div>
          ))}
          
          {/* Points Label in Middle */}
          <div className={styles.numberCell}>
            <span className={styles.numberLabel}>Points</span>
          </div>
          
          {/* Right Player Points */}
          {rightPlayers.map((player) => (
            <div key={player.id} className={styles.pointsCell}>
              <span className={`${styles.pointsValue} tabular-nums`}>
                {gameData.points[player.id] ?? 0}
              </span>
            </div>
          ))}
          
          {/* Dummy cell if needed */}
          {needsDummy && <div className={styles.dummyCell}></div>}
        </div>
      </div>
    </div>
  );
};

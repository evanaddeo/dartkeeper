import React from 'react';
import type { Player, GolfData } from '../../types/game.types';
import { getTotalScore, getScoreDisplay } from '../../logic/golfLogic';
import styles from './GolfScorecard.module.css';

/**
 * Golf Scorecard Component
 * Shows hole-by-hole scoring and current player input
 */

interface GolfScorecardProps {
  players: Player[];
  gameData: GolfData;
  currentPlayerIndex: number;
  onIncrementStroke: () => void;
  onCompleteHole: () => void;
  disabled?: boolean;
}

export const GolfScorecard: React.FC<GolfScorecardProps> = ({
  players,
  gameData,
  currentPlayerIndex,
  onIncrementStroke,
  onCompleteHole,
  disabled = false,
}) => {
  const currentPlayer = players[currentPlayerIndex];
  const currentStrokes = gameData.currentStrokes[currentPlayer?.id ?? ''] ?? 0;
  const currentHole = gameData.currentHole;

  return (
    <div className={styles.container}>
      {/* Scorecard Table */}
      <div className={styles.scorecardWrapper}>
        <table className={styles.scorecard}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.holeHeader}>Hole</th>
              <th className={styles.parHeader}>Par</th>
              {players.map((player) => (
                <th key={player.id} className={styles.playerHeader}>
                  {player.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Holes 1-9 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((hole) => (
              <tr
                key={hole}
                className={`${styles.holeRow} ${
                  hole === currentHole ? styles.currentHole : ''
                }`}
              >
                <td className={styles.holeCell}>{hole}</td>
                <td className={styles.parCell}>{gameData.par}</td>
                {players.map((player) => {
                  const score = gameData.scores[player.id];
                  const holeScore = score?.holes[hole - 1];
                  const scoreToPar = holeScore
                    ? holeScore - gameData.par
                    : undefined;

                  return (
                    <td
                      key={player.id}
                      className={`${styles.scoreCell} ${
                        holeScore !== undefined
                          ? scoreToPar === 0
                            ? styles.par
                            : scoreToPar! < 0
                            ? styles.underPar
                            : styles.overPar
                          : ''
                      }`}
                    >
                      {holeScore !== undefined ? (
                        <span className="tabular-nums">{holeScore}</span>
                      ) : (
                        '-'
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Total Row */}
            <tr className={styles.totalRow}>
              <td className={styles.totalLabel} colSpan={2}>
                Total
              </td>
              {players.map((player) => {
                const score = gameData.scores[player.id];
                const total = score?.total ?? 0;
                const relativeToPar = getTotalScore(gameData, player.id);

                return (
                  <td key={player.id} className={styles.totalCell}>
                    <span className={`${styles.totalStrokes} tabular-nums`}>
                      {total}
                    </span>
                    <span className={styles.relativePar}>
                      ({getScoreDisplay(relativeToPar)})
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Input Section */}
      {!disabled && currentPlayer && currentHole <= 9 && (
        <div className={styles.inputSection}>
          <div className={styles.currentHoleInfo}>
            <h3 className={styles.holeTitle}>
              Hole {currentHole} - Par {gameData.par}
            </h3>
            <p className={styles.playerTurn}>
              <strong>{currentPlayer.name}'s</strong> turn
            </p>
          </div>

          <div className={styles.strokeCounter}>
            <span className={styles.strokeLabel}>Current Strokes:</span>
            <span className={`${styles.strokeValue} tabular-nums`}>
              {currentStrokes}
            </span>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={`${styles.actionButton} ${styles.strokeButton}`}
              onClick={onIncrementStroke}
              disabled={disabled}
            >
              +1 Stroke
              <span className={styles.buttonHint}>Miss</span>
            </button>
            <button
              className={`${styles.actionButton} ${styles.completeButton}`}
              onClick={onCompleteHole}
              disabled={disabled}
            >
              ✓ Hit Target
              <span className={styles.buttonHint}>Complete Hole</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


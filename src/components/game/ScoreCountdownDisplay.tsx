import React from 'react';
import type { Player, ScoreCountdownData } from '../../types/game.types';
import { getCheckoutSuggestions } from '../../logic/scoreCountdownLogic';
import styles from './ScoreCountdownDisplay.module.css';

/**
 * Score Display Component for 301/501 Games
 * Shows remaining scores for all players with current player highlighted
 */

interface ScoreCountdownDisplayProps {
  players: Player[];
  gameData: ScoreCountdownData;
  currentPlayerIndex: number;
}

export const ScoreCountdownDisplay: React.FC<ScoreCountdownDisplayProps> = ({
  players,
  gameData,
  currentPlayerIndex,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.scoreGrid}>
        {players.map((player, index) => {
          const score = gameData.remainingScores[player.id] ?? gameData.startingScore;
          const isCurrentPlayer = index === currentPlayerIndex;
          const checkouts = score < 170 ? getCheckoutSuggestions(score) : [];

          return (
            <div
              key={player.id}
              className={`${styles.playerCard} ${
                isCurrentPlayer ? styles.currentPlayer : ''
              }`}
            >
              <div className={styles.playerHeader}>
                <span className={styles.playerName}>{player.name}</span>
                {isCurrentPlayer && (
                  <span className={styles.currentBadge}>Current Turn</span>
                )}
              </div>

              <div className={styles.scoreDisplay}>
                <span className={`${styles.score} tabular-nums`}>{score}</span>
              </div>

              {checkouts.length > 0 && isCurrentPlayer && (
                <div className={styles.checkoutSection}>
                  <span className={styles.checkoutLabel}>Checkout:</span>
                  <span className={styles.checkoutSuggestion}>
                    {checkouts[0]}
                  </span>
                </div>
              )}

              {!isCurrentPlayer && score === 0 && (
                <div className={styles.finishedBadge}>✓ Finished</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


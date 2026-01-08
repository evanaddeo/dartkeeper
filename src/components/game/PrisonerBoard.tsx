import React from 'react';
import type { Player, PrisonerData } from '../../types/game.types';
import { getCurrentTarget, getProgressPercentage } from '../../logic/prisonerLogic';
import styles from './PrisonerBoard.module.css';

/**
 * Prisoner Board Component
 * Shows current targets, progress, and prisoners for all players
 */

interface PrisonerBoardProps {
  players: Player[];
  gameData: PrisonerData;
  currentPlayerIndex: number;
  onHit: (hitType: 'valid' | 'prisoner' | 'miss') => void;
  disabled?: boolean;
}

export const PrisonerBoard: React.FC<PrisonerBoardProps> = ({
  players,
  gameData,
  currentPlayerIndex,
  onHit,
  disabled = false,
}) => {
  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className={styles.container}>
      {/* Player Status Cards */}
      <div className={styles.playerGrid}>
        {players.map((player, index) => {
          const target = getCurrentTarget(gameData, player.id);
          const completed = gameData.completedNumbers[player.id] ?? [];
          const prisoners = gameData.prisoners[player.id] ?? [];
          const progress = getProgressPercentage(gameData, player.id);
          const isCurrentPlayer = index === currentPlayerIndex;

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
                  <span className={styles.currentBadge}>Playing</span>
                )}
              </div>

              <div className={styles.targetSection}>
                <span className={styles.targetLabel}>Target:</span>
                <span className={styles.targetNumber}>
                  {target > 20 ? '✓ Done' : target}
                </span>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className={styles.progressText}>
                  {completed.length} / 20 ({progress}%)
                </span>
              </div>

              {prisoners.length > 0 && (
                <div className={styles.prisonersSection}>
                  <span className={styles.prisonersLabel}>⛓️ Prisoners:</span>
                  <span className={styles.prisonersNumbers}>
                    {prisoners.join(', ')}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input Section */}
      {!disabled && currentPlayer && (
        <div className={styles.inputSection}>
          <div className={styles.instructionBanner}>
            <p className={styles.instructionText}>
              <strong>{currentPlayer.name}</strong> - Throw at{' '}
              <strong>{getCurrentTarget(gameData, currentPlayer.id)}</strong>
            </p>
          </div>

          <div className={styles.actionButtons}>
            <button
              className={`${styles.actionButton} ${styles.hitButton}`}
              onClick={() => onHit('valid')}
              disabled={disabled}
            >
              <span className={styles.buttonIcon}>✓</span>
              <span className={styles.buttonLabel}>Valid Hit</span>
              <span className={styles.buttonHint}>Outer/Double/Triple</span>
            </button>

            <button
              className={`${styles.actionButton} ${styles.prisonerButton}`}
              onClick={() => onHit('prisoner')}
              disabled={disabled}
            >
              <span className={styles.buttonIcon}>⛓️</span>
              <span className={styles.buttonLabel}>Prisoner</span>
              <span className={styles.buttonHint}>Inner/Bull</span>
            </button>

            <button
              className={`${styles.actionButton} ${styles.missButton}`}
              onClick={() => onHit('miss')}
              disabled={disabled}
            >
              <span className={styles.buttonIcon}>✕</span>
              <span className={styles.buttonLabel}>Miss</span>
              <span className={styles.buttonHint}>No hit</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


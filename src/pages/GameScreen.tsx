import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button, Modal } from '../components/common';
import { ScoreCountdownDisplay } from '../components/game/ScoreCountdownDisplay';
import { ScoreCountdownInput } from '../components/game/ScoreCountdownInput';
import { createDartThrow } from '../logic/scoreCountdownLogic';
import type { ScoreCountdownData, GameType } from '../types/game.types';
import styles from './GameScreen.module.css';

/**
 * GameScreen Component
 * Main game interface - currently implements 301/501
 * (Cricket, Prisoner, Golf to be added in Steps 4-5)
 */

const GAME_NAMES: Record<GameType, string> = {
  cricket: 'Cricket',
  '301': '301',
  '501': '501',
  prisoner: 'Prisoner',
  golf: 'Golf',
};

export const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();
  const { state, dispatch } = useGame();

  // Redirect if game not started or invalid game type
  useEffect(() => {
    if (state.gameStatus !== 'playing' || !state.gameData) {
      navigate('/');
    }
  }, [state.gameStatus, state.gameData, navigate]);

  const handleDartConfirm = (number: number, multiplier: 1 | 2 | 3) => {
    const dart = createDartThrow(number, multiplier);
    dispatch({ type: 'SCORE_COUNTDOWN_RECORD_DART', payload: dart });
  };

  const handleUndo = () => {
    dispatch({ type: 'UNDO_ACTION' });
  };

  const handleEndTurn = () => {
    dispatch({ type: 'SCORE_COUNTDOWN_END_TURN' });
  };

  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate(`/setup/${gameType}`);
  };

  const handleHome = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/');
  };

  // Don't render if no game data
  if (!state.gameData || state.players.length === 0) {
    return null;
  }

  const currentPlayer = state.players[state.currentPlayerIndex];
  const isScoreCountdown = gameType === '301' || gameType === '501';

  // Only render 301/501 for now (Step 3)
  if (!isScoreCountdown) {
    return (
      <div className={styles.gameScreen}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {gameType && GAME_NAMES[gameType as GameType]}
          </h1>
        </header>
        <main className={styles.main}>
          <div className={styles.placeholder}>
            <p>This game will be implemented in Steps 4-5</p>
            <Button variant="primary" onClick={handleHome}>
              Return to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const gameData = state.gameData as ScoreCountdownData;
  const dartsRemaining = 3 - gameData.currentTurnDarts;

  return (
    <div className={styles.gameScreen}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {gameType && GAME_NAMES[gameType as GameType]}
          </h1>
          <Button variant="danger" size="sm" onClick={handleHome}>
            End Game
          </Button>
        </div>
      </header>

      <main className={styles.main}>
        {/* Score Display */}
        <section className={styles.section}>
          <ScoreCountdownDisplay
            players={state.players}
            gameData={gameData}
            currentPlayerIndex={state.currentPlayerIndex}
          />
        </section>

        {/* Current Player Info */}
        <section className={styles.currentPlayerSection}>
          <div className={styles.currentPlayerBanner}>
            <span className={styles.currentPlayerLabel}>Current Player:</span>
            <span className={styles.currentPlayerName}>
              {currentPlayer?.name}
            </span>
          </div>
        </section>

        {/* Score Input */}
        <section className={styles.section}>
          <ScoreCountdownInput
            onDartConfirm={handleDartConfirm}
            dartsRemaining={dartsRemaining}
            disabled={state.gameStatus !== 'playing'}
          />
        </section>

        {/* Action Buttons */}
        <section className={styles.actionSection}>
          <div className={styles.actionButtons}>
            <Button
              variant="secondary"
              size="md"
              onClick={handleUndo}
              disabled={state.history.length === 0}
            >
              ← Undo Last Dart
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleEndTurn}
              disabled={gameData.currentTurnDarts === 0}
            >
              End Turn →
            </Button>
          </div>
        </section>
      </main>

      {/* Win Modal */}
      <Modal
        isOpen={state.gameStatus === 'finished' && state.winner !== null}
        onClose={handleHome}
        title="🎯 Game Over!"
      >
        <div className={styles.winModal}>
          <h2 className={styles.winnerName}>{state.winner?.name} Wins!</h2>
          <p className={styles.winMessage}>
            Congratulations on finishing {gameType}!
          </p>

          <div className={styles.finalScores}>
            <h3 className={styles.finalScoresTitle}>Final Scores:</h3>
            {state.players.map((player) => {
              const score = gameData.remainingScores[player.id] ?? gameData.startingScore;
              return (
                <div key={player.id} className={styles.finalScoreItem}>
                  <span className={styles.finalPlayerName}>{player.name}:</span>
                  <span className={`${styles.finalScore} tabular-nums`}>
                    {score === 0 ? '✓ Finished' : score}
                  </span>
                </div>
              );
            })}
          </div>

          <div className={styles.modalButtons}>
            <Button variant="primary" size="lg" onClick={handleNewGame} fullWidth>
              New Game
            </Button>
            <Button variant="secondary" size="md" onClick={handleHome} fullWidth>
              Back to Home
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

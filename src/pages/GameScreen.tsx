import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Target, TrendingDown, Users as UsersIcon, Flag, RotateCcw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Button, Modal } from '../components/common';
import { ScoreCountdownDisplay } from '../components/game/ScoreCountdownDisplay';
import { ScoreCountdownInput } from '../components/game/ScoreCountdownInput';
import { CricketBoard } from '../components/game/CricketBoard';
import { PrisonerBoard } from '../components/game/PrisonerBoard';
import { GolfScorecard } from '../components/game/GolfScorecard';
import { createDartThrow } from '../logic/scoreCountdownLogic';
import type {
  ScoreCountdownData,
  CricketData,
  PrisonerData,
  GolfData,
  CricketNumber,
  PrisonerHitType,
  GameType,
} from '../types/game.types';
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

const GameScreen: React.FC = () => {
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();
  const { state, dispatch } = useGame();

  // Redirect if game not started or invalid game type
  useEffect(() => {
    // Only redirect if game is in setup state or no game data
    // Allow 'playing' and 'finished' states (finished shows win modal)
    if ((state.gameStatus !== 'playing' && state.gameStatus !== 'finished') || !state.gameData) {
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

  const handleCricketMarkAdd = (playerId: string, number: number) => {
    dispatch({ type: 'CRICKET_ADD_MARK', payload: { playerId, number: number as CricketNumber } });
  };

  const handlePrisonerHit = (hitType: PrisonerHitType) => {
    dispatch({ type: 'PRISONER_RECORD_HIT', payload: { hitType } });
    if (hitType !== 'miss') {
      // Auto-advance turn after valid hit or prisoner
      setTimeout(() => {
        dispatch({ type: 'PRISONER_END_TURN' });
      }, 100);
    }
  };

  const handleGolfIncrementStroke = () => {
    dispatch({ type: 'GOLF_INCREMENT_STROKE' });
  };

  const handleGolfCompleteHole = () => {
    dispatch({ type: 'GOLF_COMPLETE_HOLE' });
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
  const isCricket = gameType === 'cricket';
  const isPrisoner = gameType === 'prisoner';
  const isGolf = gameType === 'golf';

  // Render Prisoner
  if (isPrisoner) {
    const prisonerData = state.gameData as PrisonerData;

    return (
      <div className={styles.gameScreen}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleContainer}>
              <UsersIcon className={styles.headerIcon} />
              <h1 className={styles.title}>Prisoner</h1>
            </div>
            <Button variant="danger" size="sm" onClick={handleHome}>
              End Game
            </Button>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.section}>
            <PrisonerBoard
              players={state.players}
              gameData={prisonerData}
              currentPlayerIndex={state.currentPlayerIndex}
              onHit={handlePrisonerHit}
              disabled={state.gameStatus !== 'playing'}
            />
          </section>

          <section className={styles.actionSection}>
            <div className={styles.actionButtons}>
              <Button
                variant="secondary"
                size="md"
                onClick={handleUndo}
                disabled={state.history.length === 0}
              >
                ← Undo
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => dispatch({ type: 'PRISONER_END_TURN' })}
              >
                End Turn →
              </Button>
            </div>
          </section>
        </main>

        <Modal
          isOpen={state.gameStatus === 'finished' && state.winner !== null}
          onClose={handleHome}
          title="🎯 Game Over!"
        >
          <div className={styles.winModal}>
            <h2 className={styles.winnerName}>{state.winner?.name} Wins!</h2>
            <p className={styles.winMessage}>
              Completed all 20 numbers in sequence!
            </p>

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
  }

  // Render Golf
  if (isGolf) {
    const golfData = state.gameData as GolfData;

    return (
      <div className={styles.gameScreen}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleContainer}>
              <Flag className={styles.headerIcon} />
              <h1 className={styles.title}>Golf</h1>
            </div>
            <Button variant="danger" size="sm" onClick={handleHome}>
              End Game
            </Button>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.section}>
            <GolfScorecard
              players={state.players}
              gameData={golfData}
              currentPlayerIndex={state.currentPlayerIndex}
              onIncrementStroke={handleGolfIncrementStroke}
              onCompleteHole={handleGolfCompleteHole}
              disabled={state.gameStatus !== 'playing'}
            />
          </section>
        </main>

        <Modal
          isOpen={state.gameStatus === 'finished' && state.winner !== null}
          onClose={handleHome}
          title="🎯 Game Over!"
        >
          <div className={styles.winModal}>
            <h2 className={styles.winnerName}>{state.winner?.name} Wins!</h2>
            <p className={styles.winMessage}>
              Lowest score after 9 holes!
            </p>

            <div className={styles.finalScores}>
              <h3 className={styles.finalScoresTitle}>Final Scores:</h3>
              {state.players.map((player) => {
                const score = golfData.scores[player.id];
                const total = score?.total ?? 0;
                return (
                  <div key={player.id} className={styles.finalScoreItem}>
                    <span className={styles.finalPlayerName}>{player.name}:</span>
                    <span className={`${styles.finalScore} tabular-nums`}>
                      {total} strokes
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
  }

  // Render Cricket
  if (isCricket) {
    const cricketData = state.gameData as CricketData;

    return (
      <div className={styles.gameScreen}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleContainer}>
              <Target className={styles.headerIcon} />
              <h1 className={styles.title}>Cricket</h1>
            </div>
            <div className={styles.headerActions}>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleUndo}
                disabled={state.history.length === 0}
              >
                <RotateCcw size={16} />
                <span>Undo</span>
              </Button>
              <Button variant="danger" size="sm" onClick={handleHome}>
                End Game
              </Button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          {/* Cricket Board */}
          <section className={styles.section}>
            <CricketBoard
              players={state.players}
              gameData={cricketData}
              onMarkAdd={handleCricketMarkAdd}
              disabled={state.gameStatus !== 'playing'}
            />
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
              All numbers closed with the highest score!
            </p>

            <div className={styles.finalScores}>
              <h3 className={styles.finalScoresTitle}>Final Scores:</h3>
              {state.players.map((player) => {
                const points = cricketData.points[player.id] ?? 0;
                return (
                  <div key={player.id} className={styles.finalScoreItem}>
                    <span className={styles.finalPlayerName}>{player.name}:</span>
                    <span className={`${styles.finalScore} tabular-nums`}>
                      {points} points
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
  }

  // Render 301/501
  const gameData = state.gameData as ScoreCountdownData;
  const dartsRemaining = 3 - gameData.currentTurnDarts;

  return (
    <div className={styles.gameScreen}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleContainer}>
            <TrendingDown className={styles.headerIcon} />
            <h1 className={styles.title}>
              {gameType && GAME_NAMES[gameType as GameType]}
            </h1>
          </div>
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

export default GameScreen;

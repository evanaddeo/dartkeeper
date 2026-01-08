import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { Button, Input, Card } from '../components/common';
import styles from './PlayerSetup.module.css';
import type { GameType } from '../types/game.types';

/**
 * PlayerSetup Component
 * Player management interface before starting a game
 */

const GAME_NAMES: Record<GameType, string> = {
  cricket: 'Cricket',
  '301': '301',
  '501': '501',
  prisoner: 'Prisoner',
  golf: 'Golf',
};

const PlayerSetup: React.FC = () => {
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();
  const { state, dispatch } = useGame();
  
  const [playerName, setPlayerName] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState('');

  // Set game type when component mounts
  useEffect(() => {
    if (gameType && ['cricket', '301', '501', 'prisoner', 'golf'].includes(gameType)) {
      dispatch({ type: 'SET_GAME_TYPE', payload: gameType as GameType });
    } else {
      navigate('/');
    }
  }, [gameType, dispatch, navigate]);

  const handleAddPlayer = () => {
    if (!playerName.trim()) {
      setError('Please enter a player name');
      return;
    }

    if (playerName.trim().length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    if (state.players.length >= 6) {
      setError('Maximum 6 players allowed');
      return;
    }

    // Check for duplicate names
    const isDuplicate = state.players.some(
      (p) => p.name.toLowerCase() === playerName.trim().toLowerCase()
    );
    
    if (isDuplicate) {
      setError('Player name already exists');
      return;
    }

    dispatch({ type: 'ADD_PLAYER', payload: { name: playerName.trim() } });
    setPlayerName('');
    setError('');
    setShowInput(false);
  };

  const handleRemovePlayer = (playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: { playerId } });
  };

  const handleStartGame = () => {
    if (state.players.length < 2) {
      setError('Add at least 2 players to start');
      return;
    }

    dispatch({ type: 'START_GAME' });
    navigate(`/game/${gameType}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setPlayerName('');
      setError('');
    }
  };

  const canStartGame = state.players.length >= 2 && state.players.length <= 6;

  return (
    <div className={styles.playerSetup}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/')}
            className={styles.backButton}
          >
            ← Back
          </Button>
          <h1 className={styles.title}>
            {gameType && GAME_NAMES[gameType as GameType]}
          </h1>
          <div className={styles.placeholder} />
        </div>
      </header>

      <main className={styles.main}>
        <Card padding="lg" className={styles.setupCard}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Players</h2>
            <p className={styles.sectionSubtitle}>
              Add 2-6 players to start the game
            </p>

            {/* Player List */}
            {state.players.length > 0 && (
              <div className={styles.playerList}>
                {state.players.map((player, index) => (
                  <div key={player.id} className={styles.playerItem}>
                    <div className={styles.playerInfo}>
                      <span className={styles.playerNumber}>{index + 1}</span>
                      <span className={styles.playerName}>{player.name}</span>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemovePlayer(player.id)}
                      aria-label={`Remove ${player.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {state.players.length === 0 && (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>No players added yet</p>
                <p className={styles.emptyHint}>Click the button below to add your first player</p>
              </div>
            )}

            {/* Player Count */}
            <div className={styles.playerCount}>
              <span className={styles.countText}>
                {state.players.length} player{state.players.length !== 1 ? 's' : ''} added
              </span>
              {state.players.length > 0 && state.players.length < 2 && (
                <span className={styles.countHint}>(need at least 2)</span>
              )}
            </div>

            {/* Add Player Section */}
            {!showInput && state.players.length < 6 && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowInput(true)}
                fullWidth
                className={styles.addButton}
              >
                + Add Player
              </Button>
            )}

            {showInput && (
              <div className={styles.inputSection}>
                <Input
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setError('');
                  }}
                  onKeyDown={handleKeyPress}
                  placeholder="Enter player name"
                  autoFocus
                  error={error}
                  className={styles.nameInput}
                />
                <div className={styles.inputButtons}>
                  <Button
                    variant="success"
                    onClick={handleAddPlayer}
                    disabled={!playerName.trim()}
                  >
                    Add
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowInput(false);
                      setPlayerName('');
                      setError('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {state.players.length >= 6 && (
              <p className={styles.maxPlayersText}>Maximum players reached</p>
            )}
          </div>

          {/* Start Game Button */}
          <div className={styles.startSection}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleStartGame}
              disabled={!canStartGame}
              fullWidth
              className={styles.startButton}
            >
              {canStartGame ? 'Start Game' : 'Add at least 2 players'}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PlayerSetup;

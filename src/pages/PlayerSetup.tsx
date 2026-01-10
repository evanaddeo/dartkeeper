import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Target, TrendingDown, Users as UsersIcon, Flag } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Button } from '../components/common';
import styles from './PlayerSetup.module.css';
import type { GameType } from '../types/game.types';

/**
 * Modern PlayerSetup Component
 * Clean player management interface
 */

const GAME_CONFIG: Record<GameType, { name: string; icon: any }> = {
  cricket: { name: 'Cricket', icon: Target },
  '301': { name: '301', icon: TrendingDown },
  '501': { name: '501', icon: TrendingDown },
  prisoner: { name: 'Prisoner', icon: UsersIcon },
  golf: { name: 'Golf', icon: Flag },
};

const PlayerSetup: React.FC = () => {
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();
  const { state, dispatch } = useGame();
  
  const [playerName, setPlayerName] = useState('');

  // Set game type when component mounts
  useEffect(() => {
    if (gameType && ['cricket', '301', '501', 'prisoner', 'golf'].includes(gameType)) {
      dispatch({ type: 'SET_GAME_TYPE', payload: gameType as GameType });
    } else {
      navigate('/');
    }
  }, [gameType, dispatch, navigate]);

  const handleAddPlayer = () => {
    if (!playerName.trim() || playerName.trim().length < 2) {
      return;
    }

    if (state.players.length >= 6) {
      return;
    }

    dispatch({ type: 'ADD_PLAYER', payload: { name: playerName.trim() } });
    setPlayerName('');
  };

  const handleRemovePlayer = (playerId: string) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: { playerId } });
  };

  const handleStartGame = () => {
    if (state.players.length >= 2) {
      dispatch({ type: 'START_GAME' });
      navigate(`/game/${gameType}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const gameConfig = gameType ? GAME_CONFIG[gameType as GameType] : null;
  const GameIcon = gameConfig?.icon;
  const canStartGame = state.players.length >= 2 && state.players.length <= 6;

  return (
    <div className={styles.setupPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleContainer}>
            {GameIcon && <GameIcon className={styles.icon} />}
            <h1 className={styles.title}>{gameConfig?.name}</h1>
          </div>
          <Button variant="danger" size="sm" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Add Players</h2>
            <p className={styles.sectionSubtitle}>
              Add 2-6 players to start your game
            </p>
          </div>

          <div className={styles.card}>
            {/* Add Player Form */}
            <div className={styles.addPlayerSection}>
              <div className={styles.addPlayerForm}>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Enter player name..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    maxLength={20}
                    autoFocus
                  />
                </div>
                <button
                  className={styles.addButton}
                  onClick={handleAddPlayer}
                  disabled={!playerName.trim() || playerName.trim().length < 2 || state.players.length >= 6}
                >
                  Add Player
                </button>
              </div>
            </div>

            {/* Player List */}
            {state.players.length > 0 ? (
              <ul className={styles.playerList}>
                {state.players.map((player, index) => (
                  <li key={player.id} className={styles.playerItem}>
                    <div className={styles.playerInfo}>
                      <div className={styles.playerNumber}>{index + 1}</div>
                      <span className={styles.playerName}>{player.name}</span>
                    </div>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemovePlayer(player.id)}
                      aria-label={`Remove ${player.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <UsersIcon className={styles.emptyIcon} />
                <p className={styles.emptyText}>No players added yet</p>
              </div>
            )}

            {/* Validation Message */}
            {state.players.length === 1 && (
              <div className={styles.validationMessage}>
                Add at least 1 more player to start
              </div>
            )}

            {state.players.length > 6 && (
              <div className={styles.validationMessage}>
                Maximum 6 players allowed
              </div>
            )}

            {/* Start Button */}
            <div className={styles.startButtonContainer}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartGame}
                disabled={!canStartGame}
                fullWidth
                className={styles.startButton}
              >
                {canStartGame ? 'Start Game' : `Add ${2 - state.players.length} more player${2 - state.players.length === 1 ? '' : 's'}`}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerSetup;

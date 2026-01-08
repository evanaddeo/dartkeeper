import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common';
import styles from './HomePage.module.css';

/**
 * HomePage Component
 * Game selection interface with all 5 supported games
 */

interface GameInfo {
  type: 'cricket' | '301' | '501' | 'prisoner' | 'golf';
  name: string;
  icon: string;
  description: string;
  objective: string;
}

const GAMES: GameInfo[] = [
  {
    type: 'cricket',
    name: 'Cricket',
    icon: '🎯',
    description: 'Close numbers 15-20 and bullseye',
    objective: 'Strategic scoring game for 2-4 players',
  },
  {
    type: '301',
    name: '301',
    icon: '🎲',
    description: 'Race to zero from 301',
    objective: 'Classic countdown game',
  },
  {
    type: '501',
    name: '501',
    icon: '🎲',
    description: 'Race to zero from 501',
    objective: 'Professional countdown game',
  },
  {
    type: 'prisoner',
    name: 'Prisoner',
    icon: '⛓️',
    description: 'Hit numbers 1-20 in sequence',
    objective: 'Sequential targeting challenge',
  },
  {
    type: 'golf',
    name: 'Golf',
    icon: '⛳',
    description: '9 holes, lowest score wins',
    objective: 'Precision game for all skill levels',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGameSelect = (gameType: string) => {
    navigate(`/setup/${gameType}`);
  };

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.icon}>🎯</span>
            DartKeeper
          </h1>
          <p className={styles.subtitle}>
            Track your darts games with ease
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.introSection}>
          <h2 className={styles.introTitle}>Choose Your Game</h2>
          <p className={styles.introText}>
            Select a game type to start tracking your scores
          </p>
        </div>

        <div className={styles.gameGrid}>
          {GAMES.map((game) => (
            <Card
              key={game.type}
              shadow
              padding="lg"
              onClick={() => handleGameSelect(game.type)}
              className={styles.gameCard}
            >
              <div className={styles.gameIcon}>{game.icon}</div>
              <h3 className={styles.gameName}>{game.name}</h3>
              <p className={styles.gameDescription}>{game.description}</p>
              <p className={styles.gameObjective}>{game.objective}</p>
            </Card>
          ))}
        </div>

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            All games support 2-6 players • No signup required • Free forever
          </p>
        </footer>
      </main>
    </div>
  );
};

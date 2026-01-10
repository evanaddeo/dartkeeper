import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, TrendingDown, Users, Flag } from 'lucide-react';
import type { GameType } from '../types/game.types';
import styles from './HomePage.module.css';

/**
 * Modern HomePage Component
 * Clean, professional game selection interface
 */

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const games = [
    {
      id: 'cricket' as GameType,
      name: 'Cricket',
      description: 'Close numbers 15-20 and bullseye',
      subtitle: 'Strategic scoring game for 2-4 players',
      icon: Target,
      gradient: 'from-emerald-500 to-emerald-700',
    },
    {
      id: '301' as GameType,
      name: '301',
      description: 'Race to zero from 301',
      subtitle: 'Classic countdown game',
      icon: TrendingDown,
      gradient: 'from-blue-500 to-blue-700',
    },
    {
      id: '501' as GameType,
      name: '501',
      description: 'Race to zero from 501',
      subtitle: 'Professional countdown game',
      icon: TrendingDown,
      gradient: 'from-indigo-500 to-indigo-700',
    },
    {
      id: 'prisoner' as GameType,
      name: 'Prisoner',
      description: 'Sequential targeting 1-20',
      subtitle: 'Strategic progression game',
      icon: Users,
      gradient: 'from-purple-500 to-purple-700',
    },
    {
      id: 'golf' as GameType,
      name: 'Golf',
      description: '9-hole stroke play',
      subtitle: 'Lowest score wins',
      icon: Flag,
      gradient: 'from-amber-500 to-amber-700',
    },
  ];

  const handleGameSelect = (gameType: GameType) => {
    navigate(`/setup/${gameType}`);
  };

  return (
    <div className={styles.homePage}>
      {/* Hero Header */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.logoContainer}>
            <Target className={styles.logoIcon} />
            <h1 className={styles.appTitle}>DartKeeper</h1>
          </div>
          <p className={styles.tagline}>Professional darts scorekeeping, simplified</p>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Choose Your Game</h2>
            <p className={styles.sectionSubtitle}>
              Select a game mode to start tracking your scores
            </p>
          </div>

          {/* Game Cards Grid */}
          <div className={styles.gameGrid}>
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.id}
                  className={styles.gameCard}
                  onClick={() => handleGameSelect(game.id)}
                  aria-label={`Start ${game.name} game`}
                >
                  <div className={`${styles.iconContainer} ${styles[game.gradient]}`}>
                    <Icon className={styles.icon} strokeWidth={2} />
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.gameName}>{game.name}</h3>
                    <p className={styles.gameDescription}>{game.description}</p>
                    <p className={styles.gameSubtitle}>{game.subtitle}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.startText}>Start Game</span>
                    <svg
                      className={styles.arrowIcon}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M6 12L10 8L6 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className={styles.footer}>
            <p className={styles.footerText}>
              All games support 2-6 players • No signup required • Free forever
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;

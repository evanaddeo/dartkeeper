import React from 'react';
import styles from './GameLayout.module.css';

/**
 * GameLayout Component
 * Wrapper layout for game screens with consistent structure
 */
interface GameLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, title }) => {
  return (
    <div className={styles.layout}>
      {title && (
        <header className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
        </header>
      )}
      <main className={styles.main}>{children}</main>
    </div>
  );
};


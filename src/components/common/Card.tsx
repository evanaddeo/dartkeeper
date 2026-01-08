import React from 'react';
import type { CardProps } from '../../types/game.types';
import styles from './Card.module.css';

/**
 * Reusable Card Component
 * Container with subtle shadow and rounded corners
 */
export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = true,
  className = '',
  onClick,
}) => {
  const classNames = [
    styles.card,
    styles[`padding-${padding}`],
    shadow ? styles.shadow : '',
    onClick ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classNames} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {children}
    </div>
  );
};


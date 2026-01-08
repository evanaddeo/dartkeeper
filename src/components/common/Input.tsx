import React from 'react';
import type { InputProps } from '../../types/game.types';
import styles from './Input.module.css';

/**
 * Input Component
 * Styled text input for player names and other text entry
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  ...rest
}) => {
  const inputClassNames = [
    styles.input,
    error ? styles.error : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label} htmlFor={rest.id}>
          {label}
        </label>
      )}
      <input className={inputClassNames} {...rest} />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};


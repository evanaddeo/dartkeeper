import React from 'react';
import type { ButtonProps } from '../../types/game.types';
import styles from './Button.module.css';

/**
 * Reusable Button Component
 * Styled according to pub theme with multiple variants
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  ...rest
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};


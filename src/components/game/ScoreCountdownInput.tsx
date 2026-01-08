import React, { useState } from 'react';
import { Button } from '../common';
import { calculateDartValue } from '../../logic/scoreCountdownLogic';
import styles from './ScoreCountdownInput.module.css';

/**
 * Score Input Component for 301/501 Games
 * Number grid + multiplier selector for entering dart scores
 */

interface ScoreCountdownInputProps {
  onDartConfirm: (number: number, multiplier: 1 | 2 | 3) => void;
  dartsRemaining: number;
  disabled?: boolean;
}

const DARTBOARD_NUMBERS = [
  20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5,
];

const BULL_OPTIONS = [
  { number: 25, label: 'Bull (25)' },
  { number: 50, label: 'Bullseye (50)' },
];

export const ScoreCountdownInput: React.FC<ScoreCountdownInputProps> = ({
  onDartConfirm,
  dartsRemaining,
  disabled = false,
}) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedMultiplier, setSelectedMultiplier] = useState<1 | 2 | 3>(1);

  const handleNumberSelect = (number: number) => {
    setSelectedNumber(number);
    // Reset multiplier for bull/bullseye
    if (number === 50) {
      setSelectedMultiplier(1);
    }
  };

  const handleMultiplierSelect = (multiplier: 1 | 2 | 3) => {
    // Don't allow triple on 25
    if (selectedNumber === 25 && multiplier === 3) {
      return;
    }
    // Don't allow multiplier on 50 (already double bull)
    if (selectedNumber === 50) {
      return;
    }
    setSelectedMultiplier(multiplier);
  };

  const handleConfirm = () => {
    if (selectedNumber === null) {
      return;
    }

    onDartConfirm(selectedNumber, selectedMultiplier);
    setSelectedNumber(null);
    setSelectedMultiplier(1);
  };

  const handleMiss = () => {
    setSelectedNumber(null);
    setSelectedMultiplier(1);
  };

  const dartValue =
    selectedNumber !== null ? calculateDartValue(selectedNumber, selectedMultiplier) : 0;

  const canConfirm = selectedNumber !== null && !disabled;

  return (
    <div className={styles.container}>
      {/* Dart Counter */}
      <div className={styles.dartCounter}>
        <span className={styles.counterLabel}>Dart:</span>
        <span className={styles.counterValue}>{4 - dartsRemaining} of 3</span>
      </div>

      {/* Selected Dart Display */}
      {selectedNumber !== null && (
        <div className={styles.selectedDisplay}>
          <span className={styles.selectedLabel}>Selected:</span>
          <span className={styles.selectedValue}>
            {selectedNumber} × {selectedMultiplier} = {dartValue}
          </span>
        </div>
      )}

      {/* Multiplier Selector */}
      <div className={styles.multiplierSection}>
        <span className={styles.sectionLabel}>Multiplier:</span>
        <div className={styles.multiplierButtons}>
          <button
            className={`${styles.multiplierButton} ${
              selectedMultiplier === 1 ? styles.active : ''
            }`}
            onClick={() => handleMultiplierSelect(1)}
            disabled={disabled}
          >
            ×1 Single
          </button>
          <button
            className={`${styles.multiplierButton} ${
              selectedMultiplier === 2 ? styles.active : ''
            }`}
            onClick={() => handleMultiplierSelect(2)}
            disabled={disabled || selectedNumber === 50}
          >
            ×2 Double
          </button>
          <button
            className={`${styles.multiplierButton} ${
              selectedMultiplier === 3 ? styles.active : ''
            }`}
            onClick={() => handleMultiplierSelect(3)}
            disabled={disabled || selectedNumber === 25 || selectedNumber === 50}
          >
            ×3 Triple
          </button>
        </div>
      </div>

      {/* Number Grid */}
      <div className={styles.numberSection}>
        <span className={styles.sectionLabel}>Number:</span>
        <div className={styles.numberGrid}>
          {DARTBOARD_NUMBERS.map((number) => (
            <button
              key={number}
              className={`${styles.numberButton} ${
                selectedNumber === number ? styles.selected : ''
              }`}
              onClick={() => handleNumberSelect(number)}
              disabled={disabled}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      {/* Bull Options */}
      <div className={styles.bullSection}>
        {BULL_OPTIONS.map((option) => (
          <button
            key={option.number}
            className={`${styles.bullButton} ${
              selectedNumber === option.number ? styles.selected : ''
            }`}
            onClick={() => handleNumberSelect(option.number)}
            disabled={disabled}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <Button
          variant="success"
          size="lg"
          onClick={handleConfirm}
          disabled={!canConfirm}
          fullWidth
        >
          Confirm Dart
        </Button>
        <Button
          variant="secondary"
          size="md"
          onClick={handleMiss}
          disabled={disabled}
          fullWidth
        >
          Miss (0 points)
        </Button>
      </div>
    </div>
  );
};


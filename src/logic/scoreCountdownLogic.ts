/**
 * Score Countdown Logic for 301/501 Games
 * Handles dart value calculation, bust detection, and win conditions
 */

import type { DartThrow } from '../types/game.types';

/**
 * Calculate the value of a dart based on number and multiplier
 */
export function calculateDartValue(number: number, multiplier: 1 | 2 | 3): number {
  return number * multiplier;
}

/**
 * Subtract score and check for bust
 * Returns new score and bust status
 */
export function subtractScore(
  currentScore: number,
  dartValue: number
): { newScore: number; isBust: boolean } {
  const newScore = currentScore - dartValue;

  // Bust if score goes below 0
  if (newScore < 0) {
    return { newScore: currentScore, isBust: true };
  }

  return { newScore, isBust: false };
}

/**
 * Check if player has won (exactly 0)
 */
export function checkWin(score: number): boolean {
  return score === 0;
}

/**
 * Validate dart input
 */
export function validateDartInput(number: number, multiplier: number): boolean {
  // Valid numbers: 1-20, 25 (bull), 50 (double bull)
  const validNumbers = [25, 50];
  for (let i = 1; i <= 20; i++) {
    validNumbers.push(i);
  }

  if (!validNumbers.includes(number)) {
    return false;
  }

  // Valid multipliers: 1, 2, 3
  if (![1, 2, 3].includes(multiplier)) {
    return false;
  }

  // Special case: 25 can only be 1x or 2x (50 is double bull)
  if (number === 25 && multiplier > 2) {
    return false;
  }

  // Special case: 50 is already double bull, can't have multiplier
  if (number === 50 && multiplier !== 1) {
    return false;
  }

  return true;
}

/**
 * Get checkout suggestions for scores < 170
 * Returns array of possible checkout combinations
 */
export function getCheckoutSuggestions(score: number): string[] {
  if (score > 170 || score < 2) {
    return [];
  }

  const suggestions: string[] = [];

  // Common checkout combinations
  const checkouts: Record<number, string[]> = {
    2: ['D1'],
    4: ['D2'],
    6: ['D3'],
    8: ['D4'],
    10: ['D5'],
    12: ['D6'],
    14: ['D7'],
    16: ['D8'],
    18: ['D9'],
    20: ['D10'],
    22: ['D11'],
    24: ['D12'],
    26: ['D13'],
    28: ['D14'],
    30: ['D15'],
    32: ['D16'],
    34: ['D17'],
    36: ['D18'],
    38: ['D19'],
    40: ['D20'],
    50: ['Bull'],
    60: ['20, D20'],
    81: ['T19, D12'],
    90: ['T20, D15'],
    100: ['T20, D20'],
    110: ['T20, T18, D8'],
    120: ['T20, T20, D15'],
    130: ['T20, T20, D20', 'T19, T19, D17'],
    141: ['T20, T19, D12'],
    150: ['T20, T20, T18, D12'],
    160: ['T20, T20, T20, D20'],
    167: ['T20, T19, Bull'],
    170: ['T20, T20, Bull'],
  };

  if (checkouts[score]) {
    return checkouts[score];
  }

  // For other scores, provide generic suggestion
  if (score <= 40 && score % 2 === 0) {
    suggestions.push(`D${score / 2}`);
  }

  return suggestions;
}

/**
 * Create a dart throw object
 */
export function createDartThrow(number: number, multiplier: 1 | 2 | 3): DartThrow {
  return {
    number,
    multiplier,
    value: calculateDartValue(number, multiplier),
  };
}

/**
 * Check if a score is achievable with remaining darts
 */
export function isScoreAchievable(score: number, dartsRemaining: number): boolean {
  // Maximum possible with one dart is 60 (T20)
  // Maximum possible with two darts is 120 (T20, T20)
  // Maximum possible with three darts is 180 (T20, T20, T20)
  const maxPossible = dartsRemaining * 60;
  return score <= maxPossible;
}


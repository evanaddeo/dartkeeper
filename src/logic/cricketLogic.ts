/**
 * Cricket Logic
 * Handles mark tracking, point calculation, and win detection
 */

import type { CricketMarks, CricketNumber, Player } from '../types/game.types';

export const CRICKET_NUMBERS: CricketNumber[] = [20, 19, 18, 17, 16, 15, 25];

/**
 * Add marks to a number for a player
 */
export function addMark(
  marks: CricketMarks,
  playerId: string,
  number: CricketNumber,
  count: number = 1
): CricketMarks {
  const newMarks = { ...marks };
  if (!newMarks[playerId]) {
    newMarks[playerId] = {
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
      25: 0,
    };
  }

  newMarks[playerId] = {
    ...newMarks[playerId],
    [number]: Math.min((newMarks[playerId]?.[number] ?? 0) + count, 10), // Cap at 10
  };

  return newMarks;
}

/**
 * Remove last mark from a number for a player
 */
export function removeMark(
  marks: CricketMarks,
  playerId: string,
  number: CricketNumber
): CricketMarks {
  const newMarks = { ...marks };
  if (!newMarks[playerId]) {
    return marks;
  }

  const currentMarks = newMarks[playerId]?.[number] ?? 0;
  if (currentMarks > 0) {
    newMarks[playerId] = {
      ...newMarks[playerId],
      [number]: currentMarks - 1,
    };
  }

  return newMarks;
}

/**
 * Check if a number is open for a player (3+ marks)
 */
export function isNumberOpen(
  marks: CricketMarks,
  playerId: string,
  number: CricketNumber
): boolean {
  return (marks[playerId]?.[number] ?? 0) >= 3;
}

/**
 * Check if a number is closed for ALL players (everyone has 3+ marks)
 */
export function isNumberClosedForAll(
  marks: CricketMarks,
  players: Player[],
  number: CricketNumber
): boolean {
  return players.every((player) => isNumberOpen(marks, player.id, number));
}

/**
 * Calculate points scored for hitting a number (single dart)
 * Points only scored if your number is open AND not closed for all
 * Returns the number value if conditions are met, 0 otherwise
 */
export function calculatePoints(
  marks: CricketMarks,
  playerId: string,
  number: CricketNumber,
  players: Player[]
): number {
  const playerMarks = marks[playerId]?.[number] ?? 0;

  // Must have at least 4 marks to score points (3 to open + 1 to score)
  if (playerMarks <= 3) {
    return 0;
  }

  // Check if number is closed for ALL players
  if (isNumberClosedForAll(marks, players, number)) {
    return 0;
  }

  // Score the number value for THIS SINGLE HIT
  return number;
}

/**
 * Check if all numbers are open for a player
 */
export function allNumbersOpen(marks: CricketMarks, playerId: string): boolean {
  return CRICKET_NUMBERS.every((num) => isNumberOpen(marks, playerId, num));
}

/**
 * Check if player has won Cricket
 * Win: All numbers open AND score >= all opponents
 */
export function checkCricketWin(
  marks: CricketMarks,
  points: Record<string, number>,
  players: Player[]
): string | null {
  for (const player of players) {
    // Must have all numbers open
    if (!allNumbersOpen(marks, player.id)) {
      continue;
    }

    // Must have score >= all opponents
    const playerPoints = points[player.id] ?? 0;
    const hasHighestScore = players.every((opponent) => {
      if (opponent.id === player.id) return true;
      const opponentPoints = points[opponent.id] ?? 0;
      return playerPoints >= opponentPoints;
    });

    if (hasHighestScore) {
      return player.id;
    }
  }

  return null;
}

/**
 * Get display symbol for mark count
 */
export function getMarkSymbol(markCount: number): string {
  if (markCount === 0) return '';
  if (markCount === 1) return '/';
  if (markCount === 2) return 'X';
  return '⊗'; // 3+ marks (closed)
}

/**
 * Calculate total points for marks beyond opening
 */
export function calculateTotalPointsForNumber(
  marks: CricketMarks,
  playerId: string,
  number: CricketNumber,
  players: Player[]
): number {
  const playerMarks = marks[playerId]?.[number] ?? 0;

  if (playerMarks <= 3) {
    return 0;
  }

  // Check if number is closed for ALL players
  if (isNumberClosedForAll(marks, players, number)) {
    return 0;
  }

  return (playerMarks - 3) * number;
}


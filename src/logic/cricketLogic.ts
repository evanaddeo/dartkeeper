/**
 * Cricket Logic
 * Handles mark tracking, point calculation, and win detection
 */

import type { CricketMarks, CricketNumber, Player } from '../types/game.types';

export const CRICKET_NUMBERS: CricketNumber[] = [15, 16, 17, 18, 19, 20, 25];

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
 * Check if a number is closed for a player (3+ marks)
 */
export function isNumberClosed(
  marks: CricketMarks,
  playerId: string,
  number: CricketNumber
): boolean {
  return (marks[playerId]?.[number] ?? 0) >= 3;
}

/**
 * Calculate points scored for hitting a number
 * Points only scored if your number is closed but opponent's isn't
 */
export function calculatePoints(
  marks: CricketMarks,
  playerId: string,
  number: CricketNumber,
  players: Player[]
): number {
  const playerMarks = marks[playerId]?.[number] ?? 0;

  // Must have closed the number (3+ marks) to score points
  if (playerMarks < 3) {
    return 0;
  }

  // Check if any opponent hasn't closed this number
  const anyOpponentOpen = players.some((player) => {
    if (player.id === playerId) return false;
    return !isNumberClosed(marks, player.id, number);
  });

  // Only score points if at least one opponent hasn't closed
  if (!anyOpponentOpen) {
    return 0;
  }

  // Score points for marks beyond 3
  const pointsToScore = playerMarks - 3;
  return pointsToScore * number;
}

/**
 * Check if all numbers are closed for a player
 */
export function allNumbersClosed(marks: CricketMarks, playerId: string): boolean {
  return CRICKET_NUMBERS.every((num) => isNumberClosed(marks, playerId, num));
}

/**
 * Check if player has won Cricket
 * Win: All numbers closed AND score >= all opponents
 */
export function checkCricketWin(
  marks: CricketMarks,
  points: Record<string, number>,
  players: Player[]
): string | null {
  for (const player of players) {
    // Must have all numbers closed
    if (!allNumbersClosed(marks, player.id)) {
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
 * Calculate total points for marks beyond closing
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

  // Check if any opponent hasn't closed this number
  const anyOpponentOpen = players.some((player) => {
    if (player.id === playerId) return false;
    return !isNumberClosed(marks, player.id, number);
  });

  if (!anyOpponentOpen) {
    return 0;
  }

  return (playerMarks - 3) * number;
}


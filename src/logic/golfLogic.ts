/**
 * Golf Logic
 * Handles 9-hole scoring, stroke tracking, and win detection
 */

import type { GolfData, Player } from '../types/game.types';

const PAR = 3;
const TOTAL_HOLES = 9;

/**
 * Increment strokes for current hole
 */
export function incrementStrokes(
  gameData: GolfData,
  playerId: string
): GolfData {
  const currentStrokes = gameData.currentStrokes[playerId] ?? 0;

  return {
    ...gameData,
    currentStrokes: {
      ...gameData.currentStrokes,
      [playerId]: currentStrokes + 1,
    },
  };
}

/**
 * Complete a hole for a player
 */
export function completeHole(
  gameData: GolfData,
  playerId: string,
  hole: number,
  strokes: number
): GolfData {
  const playerScore = gameData.scores[playerId] ?? { holes: [], total: 0 };
  const newHoles = [...playerScore.holes];
  newHoles[hole - 1] = strokes;

  const newTotal = newHoles.reduce((sum, s) => sum + (s || 0), 0);

  return {
    ...gameData,
    scores: {
      ...gameData.scores,
      [playerId]: {
        holes: newHoles,
        total: newTotal,
      },
    },
    currentStrokes: {
      ...gameData.currentStrokes,
      [playerId]: 0, // Reset strokes for next hole
    },
  };
}

/**
 * Check if all players have completed current hole
 */
export function allPlayersCompletedHole(
  gameData: GolfData,
  hole: number,
  players: Player[]
): boolean {
  return players.every((player) => {
    const playerScore = gameData.scores[player.id];
    if (!playerScore) return false;
    const holeScore = playerScore.holes[hole - 1];
    return holeScore !== undefined && holeScore > 0;
  });
}

/**
 * Advance to next hole
 */
export function advanceHole(gameData: GolfData): GolfData {
  return {
    ...gameData,
    currentHole: Math.min(gameData.currentHole + 1, TOTAL_HOLES + 1),
  };
}

/**
 * Calculate score relative to par for a hole
 */
export function calculateScore(strokes: number, par: number = PAR): number {
  return strokes - par;
}

/**
 * Get total score relative to par for a player
 */
export function getTotalScore(gameData: GolfData, playerId: string): number {
  const playerScore = gameData.scores[playerId];
  if (!playerScore) return 0;

  const completedHoles = playerScore.holes.filter((s) => s !== undefined && s > 0).length;
  const expectedPar = completedHoles * PAR;
  return playerScore.total - expectedPar;
}

/**
 * Check if game is over (all 9 holes completed)
 */
export function checkGolfWin(
  gameData: GolfData,
  players: Player[]
): { isFinished: boolean; winner: string | null } {
  // Check if all players have completed all 9 holes
  const allFinished = players.every((player) => {
    const playerScore = gameData.scores[player.id];
    if (!playerScore) return false;
    return playerScore.holes.length === TOTAL_HOLES &&
           playerScore.holes.every((s) => s !== undefined && s > 0);
  });

  if (!allFinished) {
    return { isFinished: false, winner: null };
  }

  // Find player with lowest total strokes
  let lowestScore = Infinity;
  let winnerId: string | null = null;

  players.forEach((player) => {
    const playerScore = gameData.scores[player.id];
    if (playerScore && playerScore.total < lowestScore) {
      lowestScore = playerScore.total;
      winnerId = player.id;
    }
  });

  return { isFinished: true, winner: winnerId };
}

/**
 * Get score display string (e.g., "-2", "E", "+3")
 */
export function getScoreDisplay(relativeToPar: number): string {
  if (relativeToPar === 0) return 'E'; // Even
  if (relativeToPar < 0) return `${relativeToPar}`;
  return `+${relativeToPar}`;
}


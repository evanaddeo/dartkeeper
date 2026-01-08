/**
 * Prisoner Logic
 * Handles sequential targeting, prisoner tracking, and win detection
 */

import type { PrisonerData, PrisonerHitType } from '../types/game.types';

/**
 * Record a hit (valid or prisoner) for the current player
 */
export function recordHit(
  gameData: PrisonerData,
  playerId: string,
  hitType: PrisonerHitType
): PrisonerData {
  const currentTarget = gameData.currentTargets[playerId] ?? 1;

  if (hitType === 'valid') {
    // Valid hit - advance to next number
    const newCompletedNumbers = [
      ...(gameData.completedNumbers[playerId] ?? []),
      currentTarget,
    ];

    return {
      ...gameData,
      currentTargets: {
        ...gameData.currentTargets,
        [playerId]: Math.min(currentTarget + 1, 21), // Cap at 21 (game complete)
      },
      completedNumbers: {
        ...gameData.completedNumbers,
        [playerId]: newCompletedNumbers,
      },
    };
  } else if (hitType === 'prisoner') {
    // Prisoner - add to prisoner list
    const newPrisoners = [...(gameData.prisoners[playerId] ?? []), currentTarget];

    return {
      ...gameData,
      prisoners: {
        ...gameData.prisoners,
        [playerId]: newPrisoners,
      },
    };
  }

  // Miss - no change
  return gameData;
}

/**
 * Free all prisoners on a given number (when any player hits it validly)
 */
export function freePrisoners(gameData: PrisonerData, number: number): PrisonerData {
  const newPrisoners: Record<string, number[]> = {};

  Object.keys(gameData.prisoners).forEach((playerId) => {
    newPrisoners[playerId] = (gameData.prisoners[playerId] ?? []).filter(
      (prisonerNum) => prisonerNum !== number
    );
  });

  return {
    ...gameData,
    prisoners: newPrisoners,
  };
}

/**
 * Get current target number for a player
 */
export function getCurrentTarget(gameData: PrisonerData, playerId: string): number {
  return gameData.currentTargets[playerId] ?? 1;
}

/**
 * Check if player has won (completed all 20 numbers)
 */
export function checkPrisonerWin(gameData: PrisonerData, playerId: string): boolean {
  const currentTarget = gameData.currentTargets[playerId] ?? 1;
  return currentTarget > 20;
}

/**
 * Get progress percentage for a player
 */
export function getProgressPercentage(gameData: PrisonerData, playerId: string): number {
  const completedCount = (gameData.completedNumbers[playerId] ?? []).length;
  return Math.round((completedCount / 20) * 100);
}


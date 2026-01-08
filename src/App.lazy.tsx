/**
 * Lazy-loaded route components for code splitting
 */
import { lazy } from 'react';

export const HomePage = lazy(() => import('./pages/HomePage'));
export const PlayerSetup = lazy(() => import('./pages/PlayerSetup'));
export const GameScreen = lazy(() => import('./pages/GameScreen'));


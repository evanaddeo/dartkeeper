/**
 * DartKeeper Type Definitions
 * Complete TypeScript interfaces for game state, actions, and data structures
 */

// ==================== Game Types ====================

export type GameType = 'cricket' | '301' | '501' | 'prisoner' | 'golf';

export type GameStatus = 'setup' | 'playing' | 'finished';

// ==================== Player Types ====================

export interface Player {
  id: string;
  name: string;
}

// ==================== Cricket Types ====================

export interface CricketData {
  marks: CricketMarks;
  points: Record<string, number>; // playerId -> points
}

export type CricketMarks = Record<string, Record<CricketNumber, number>>;
// playerId -> number -> mark count (0-3+)

export type CricketNumber = 15 | 16 | 17 | 18 | 19 | 20 | 25;

export const CRICKET_NUMBERS: CricketNumber[] = [15, 16, 17, 18, 19, 20, 25];

// ==================== 301/501 Types ====================

export interface ScoreCountdownData {
  startingScore: 301 | 501;
  remainingScores: Record<string, number>; // playerId -> remaining score
  currentTurnDarts: number; // 0-3
  turnStartScore: number; // For bust detection
  dartHistory: DartThrow[]; // Current turn's darts
}

export interface DartThrow {
  number: number; // 1-20, 25, 50
  multiplier: 1 | 2 | 3;
  value: number; // calculated value
}

// ==================== Prisoner Types ====================

export interface PrisonerData {
  currentTargets: Record<string, number>; // playerId -> current target (1-20)
  prisoners: Record<string, number[]>; // playerId -> array of prisoner numbers
  completedNumbers: Record<string, number[]>; // playerId -> completed numbers
}

export type PrisonerHitType = 'valid' | 'prisoner' | 'miss';

// ==================== Golf Types ====================

export interface GolfData {
  currentHole: number; // 1-9
  scores: Record<string, GolfPlayerScore>; // playerId -> scores
  currentStrokes: Record<string, number>; // playerId -> current hole strokes
  par: number; // 3
}

export interface GolfPlayerScore {
  holes: number[]; // strokes per hole (index 0 = hole 1)
  total: number; // total strokes
}

// ==================== Game State ====================

export interface GameState {
  gameType: GameType | null;
  players: Player[];
  currentPlayerIndex: number;
  gameStatus: GameStatus;
  winner: Player | null;
  gameData: CricketData | ScoreCountdownData | PrisonerData | GolfData | null;
  history: GameStateSnapshot[];
}

export interface GameStateSnapshot {
  gameData: CricketData | ScoreCountdownData | PrisonerData | GolfData;
  currentPlayerIndex: number;
  timestamp: number;
}

// ==================== Action Types ====================

export type GameAction =
  | { type: 'SET_GAME_TYPE'; payload: GameType }
  | { type: 'ADD_PLAYER'; payload: { name: string } }
  | { type: 'REMOVE_PLAYER'; payload: { playerId: string } }
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'NEXT_PLAYER' }
  | { type: 'UNDO_ACTION' }
  | { type: 'RESET_GAME' }
  // Cricket Actions
  | { type: 'CRICKET_ADD_MARK'; payload: { number: CricketNumber } }
  | { type: 'CRICKET_REMOVE_MARK'; payload: { number: CricketNumber } }
  | { type: 'CRICKET_END_TURN' }
  // 301/501 Actions
  | { type: 'SCORE_COUNTDOWN_RECORD_DART'; payload: DartThrow }
  | { type: 'SCORE_COUNTDOWN_UNDO_DART' }
  | { type: 'SCORE_COUNTDOWN_END_TURN' }
  // Prisoner Actions
  | { type: 'PRISONER_RECORD_HIT'; payload: { hitType: PrisonerHitType } }
  | { type: 'PRISONER_END_TURN' }
  // Golf Actions
  | { type: 'GOLF_INCREMENT_STROKE' }
  | { type: 'GOLF_COMPLETE_HOLE' }
  | { type: 'GOLF_ADVANCE_HOLE' };

// ==================== Context Types ====================

export interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// ==================== Component Props Types ====================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}


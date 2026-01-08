import React, { createContext, useContext, useReducer } from 'react';
import type {
  GameState,
  GameAction,
  GameContextValue,
  CricketData,
  ScoreCountdownData,
  PrisonerData,
  GolfData,
} from '../types/game.types';

/**
 * Game Context for managing global game state
 * Uses useReducer for predictable state updates
 */

// Initial state
const initialState: GameState = {
  gameType: null,
  players: [],
  currentPlayerIndex: 0,
  gameStatus: 'setup',
  winner: null,
  gameData: null,
  history: [],
};

// Game reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_GAME_TYPE':
      return {
        ...state,
        gameType: action.payload,
        gameStatus: 'setup',
      };

    case 'ADD_PLAYER': {
      const newPlayer = {
        id: `player-${Date.now()}-${Math.random()}`,
        name: action.payload.name,
      };
      return {
        ...state,
        players: [...state.players, newPlayer],
      };
    }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.payload.playerId),
      };

    case 'START_GAME': {
      if (state.players.length < 2 || !state.gameType) {
        return state;
      }

      // Initialize game-specific data
      let gameData = null;

      switch (state.gameType) {
        case 'cricket':
          gameData = initializeCricketData(state.players);
          break;
        case '301':
          gameData = initializeScoreCountdownData(state.players, 301);
          break;
        case '501':
          gameData = initializeScoreCountdownData(state.players, 501);
          break;
        case 'prisoner':
          gameData = initializePrisonerData(state.players);
          break;
        case 'golf':
          gameData = initializeGolfData(state.players);
          break;
      }

      return {
        ...state,
        gameStatus: 'playing',
        gameData,
        currentPlayerIndex: 0,
        history: [],
      };
    }

    case 'NEXT_PLAYER':
      return {
        ...state,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
      };

    case 'END_GAME':
      return {
        ...state,
        gameStatus: 'finished',
      };

    case 'RESET_GAME':
      return initialState;

    case 'UNDO_ACTION': {
      if (state.history.length === 0) {
        return state;
      }

      const lastSnapshot = state.history[state.history.length - 1];
      if (!lastSnapshot) {
        return state;
      }
      
      return {
        ...state,
        gameData: lastSnapshot.gameData,
        currentPlayerIndex: lastSnapshot.currentPlayerIndex,
        history: state.history.slice(0, -1),
      };
    }

    // Cricket actions (stub implementations - will be expanded in Step 4)
    case 'CRICKET_ADD_MARK':
    case 'CRICKET_REMOVE_MARK':
    case 'CRICKET_END_TURN':
      // TODO: Implement in Step 4
      return state;

    // 301/501 actions (stub implementations - will be expanded in Step 3)
    case 'SCORE_COUNTDOWN_RECORD_DART':
    case 'SCORE_COUNTDOWN_UNDO_DART':
    case 'SCORE_COUNTDOWN_END_TURN':
      // TODO: Implement in Step 3
      return state;

    // Prisoner actions (stub implementations - will be expanded in Step 5)
    case 'PRISONER_RECORD_HIT':
    case 'PRISONER_END_TURN':
      // TODO: Implement in Step 5
      return state;

    // Golf actions (stub implementations - will be expanded in Step 5)
    case 'GOLF_INCREMENT_STROKE':
    case 'GOLF_COMPLETE_HOLE':
    case 'GOLF_ADVANCE_HOLE':
      // TODO: Implement in Step 5
      return state;

    default:
      return state;
  }
}

// Initialize game-specific data structures
function initializeCricketData(players: GameState['players']): CricketData {
  const marks: CricketData['marks'] = {};
  const points: CricketData['points'] = {};

  players.forEach((player) => {
    marks[player.id] = {
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
      25: 0,
    };
    points[player.id] = 0;
  });

  return { marks, points };
}

function initializeScoreCountdownData(
  players: GameState['players'],
  startingScore: 301 | 501
): ScoreCountdownData {
  const remainingScores: ScoreCountdownData['remainingScores'] = {};

  players.forEach((player) => {
    remainingScores[player.id] = startingScore;
  });

  return {
    startingScore,
    remainingScores,
    currentTurnDarts: 0,
    turnStartScore: startingScore,
    dartHistory: [],
  };
}

function initializePrisonerData(players: GameState['players']): PrisonerData {
  const currentTargets: PrisonerData['currentTargets'] = {};
  const prisoners: PrisonerData['prisoners'] = {};
  const completedNumbers: PrisonerData['completedNumbers'] = {};

  players.forEach((player) => {
    currentTargets[player.id] = 1;
    prisoners[player.id] = [];
    completedNumbers[player.id] = [];
  });

  return { currentTargets, prisoners, completedNumbers };
}

function initializeGolfData(players: GameState['players']): GolfData {
  const scores: GolfData['scores'] = {};
  const currentStrokes: GolfData['currentStrokes'] = {};

  players.forEach((player) => {
    scores[player.id] = {
      holes: [],
      total: 0,
    };
    currentStrokes[player.id] = 0;
  });

  return {
    currentHole: 1,
    scores,
    currentStrokes,
    par: 3,
  };
}

// Create context
const GameContext = createContext<GameContextValue | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for consuming context
export const useGame = (): GameContextValue => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};


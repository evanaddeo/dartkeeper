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
import {
  addMark,
  removeMark,
  calculatePoints,
  calculateTotalPointsForNumber,
  checkCricketWin,
} from '../logic/cricketLogic';

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

    // Cricket actions
    case 'CRICKET_ADD_MARK': {
      if (
        state.gameStatus !== 'playing' ||
        !state.gameData ||
        state.gameType !== 'cricket'
      ) {
        return state;
      }

      const gameData = state.gameData as CricketData;
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      if (!currentPlayer) {
        return state;
      }

      // Add mark
      const newMarks = addMark(
        gameData.marks,
        currentPlayer.id,
        action.payload.number,
        1
      );

      // Calculate points earned from this hit
      const pointsEarned = calculatePoints(
        newMarks,
        currentPlayer.id,
        action.payload.number,
        state.players
      );

      const newPoints = {
        ...gameData.points,
        [currentPlayer.id]: (gameData.points[currentPlayer.id] ?? 0) + pointsEarned,
      };

      const newGameData: CricketData = {
        marks: newMarks,
        points: newPoints,
      };

      // Check for win
      const winnerId = checkCricketWin(newMarks, newPoints, state.players);
      const winner = winnerId ? state.players.find((p) => p.id === winnerId) : null;

      // Save to history
      const newHistory = [
        ...state.history,
        {
          gameData: state.gameData,
          currentPlayerIndex: state.currentPlayerIndex,
          timestamp: Date.now(),
        },
      ];

      if (winner) {
        return {
          ...state,
          gameData: newGameData,
          gameStatus: 'finished',
          winner,
          history: newHistory,
        };
      }

      return {
        ...state,
        gameData: newGameData,
        history: newHistory,
      };
    }

    case 'CRICKET_REMOVE_MARK': {
      if (
        state.gameStatus !== 'playing' ||
        !state.gameData ||
        state.gameType !== 'cricket'
      ) {
        return state;
      }

      const gameData = state.gameData as CricketData;
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      if (!currentPlayer) {
        return state;
      }

      // Remove mark
      const newMarks = removeMark(
        gameData.marks,
        currentPlayer.id,
        action.payload.number
      );

      // Recalculate total points for this number
      const newTotalPoints = calculateTotalPointsForNumber(
        newMarks,
        currentPlayer.id,
        action.payload.number,
        state.players
      );

      // Get old total points
      const oldMarks = gameData.marks[currentPlayer.id]?.[action.payload.number] ?? 0;
      const oldTotalPoints = oldMarks > 3 ? (oldMarks - 3) * action.payload.number : 0;

      // Adjust points
      const pointsDiff = newTotalPoints - oldTotalPoints;
      const newPoints = {
        ...gameData.points,
        [currentPlayer.id]: Math.max(0, (gameData.points[currentPlayer.id] ?? 0) + pointsDiff),
      };

      return {
        ...state,
        gameData: {
          marks: newMarks,
          points: newPoints,
        },
      };
    }

    case 'CRICKET_END_TURN': {
      return {
        ...state,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
      };
    }

    // 301/501 actions
    case 'SCORE_COUNTDOWN_RECORD_DART': {
      if (
        state.gameStatus !== 'playing' ||
        !state.gameData ||
        (state.gameType !== '301' && state.gameType !== '501')
      ) {
        return state;
      }

      const gameData = state.gameData as ScoreCountdownData;
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      if (!currentPlayer) {
        return state;
      }

      const currentScore = gameData.remainingScores[currentPlayer.id] ?? gameData.startingScore;
      const dartValue = action.payload.value;
      const newScore = currentScore - dartValue;

      // Check for bust
      if (newScore < 0) {
        // Bust! Revert to turn start score and end turn
        const newGameData: ScoreCountdownData = {
          ...gameData,
          remainingScores: {
            ...gameData.remainingScores,
            [currentPlayer.id]: gameData.turnStartScore,
          },
          currentTurnDarts: 0,
          dartHistory: [],
        };

        return {
          ...state,
          gameData: newGameData,
          currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
        };
      }

      // Check for win
      if (newScore === 0) {
        const newGameData: ScoreCountdownData = {
          ...gameData,
          remainingScores: {
            ...gameData.remainingScores,
            [currentPlayer.id]: 0,
          },
          currentTurnDarts: 0,
          dartHistory: [],
        };

        return {
          ...state,
          gameData: newGameData,
          gameStatus: 'finished',
          winner: currentPlayer,
        };
      }

      // Normal dart - update score
      const newDartHistory = [...gameData.dartHistory, action.payload];
      const newDartsCount = gameData.currentTurnDarts + 1;

      // Save state to history before updating
      const newHistory = [
        ...state.history,
        {
          gameData: state.gameData,
          currentPlayerIndex: state.currentPlayerIndex,
          timestamp: Date.now(),
        },
      ];

      const newGameData: ScoreCountdownData = {
        ...gameData,
        remainingScores: {
          ...gameData.remainingScores,
          [currentPlayer.id]: newScore,
        },
        currentTurnDarts: newDartsCount,
        dartHistory: newDartHistory,
      };

      // Auto-advance after 3 darts
      if (newDartsCount >= 3) {
        return {
          ...state,
          gameData: {
            ...newGameData,
            currentTurnDarts: 0,
            dartHistory: [],
            turnStartScore: newScore,
          },
          currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
          history: newHistory,
        };
      }

      return {
        ...state,
        gameData: newGameData,
        history: newHistory,
      };
    }

    case 'SCORE_COUNTDOWN_UNDO_DART': {
      // Use the undo action instead
      return gameReducer(state, { type: 'UNDO_ACTION' });
    }

    case 'SCORE_COUNTDOWN_END_TURN': {
      if (
        state.gameStatus !== 'playing' ||
        !state.gameData ||
        (state.gameType !== '301' && state.gameType !== '501')
      ) {
        return state;
      }

      const gameData = state.gameData as ScoreCountdownData;
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      if (!currentPlayer) {
        return state;
      }

      const currentScore = gameData.remainingScores[currentPlayer.id] ?? gameData.startingScore;

      return {
        ...state,
        gameData: {
          ...gameData,
          currentTurnDarts: 0,
          dartHistory: [],
          turnStartScore: currentScore,
        },
        currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
      };
    }

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


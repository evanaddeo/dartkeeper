import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { HomePage } from './pages/HomePage';
import { PlayerSetup } from './pages/PlayerSetup';
import { GameScreen } from './pages/GameScreen';

/**
 * Main DartKeeper application component
 * Sets up routing and global state management
 */
function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/setup/:gameType" element={<PlayerSetup />} />
          <Route path="/game/:gameType" element={<GameScreen />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;


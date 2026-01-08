import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { HomePage, PlayerSetup, GameScreen } from './App.lazy';

/**
 * Loading fallback component
 */
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontSize: '1.5rem',
    color: 'var(--color-primary)',
  }}>
    <div className="animate-pulse">Loading DartKeeper...</div>
  </div>
);

/**
 * Main DartKeeper application component
 * Sets up routing, lazy loading, and global state management
 */
function App() {
  return (
    <ErrorBoundary>
      <GameProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <div className="page-enter">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/setup/:gameType" element={<PlayerSetup />} />
                <Route path="/game/:gameType" element={<GameScreen />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Suspense>
        </BrowserRouter>
      </GameProvider>
    </ErrorBoundary>
  );
}

export default App;


import { useState } from 'react';
import './App.css';

/**
 * Main DartKeeper application component
 */
function App() {
  const [score, setScore] = useState<number>(0);

  return (
    <div className="app">
      <header className="header">
        <h1>🎯 DartKeeper</h1>
        <p>Track your darts game with ease</p>
      </header>

      <main className="main">
        <div className="score-display">
          <h2>Current Score</h2>
          <div className="score">{score}</div>
        </div>

        <div className="controls">
          <button onClick={() => setScore(score + 1)}>+1</button>
          <button onClick={() => setScore(0)}>Reset</button>
        </div>
      </main>
    </div>
  );
}

export default App;


import React from 'react';
import MainApp from './components/App';
import { GameProvider } from './context/GameContext';

// This file purely exports the main component, keeping standard React structure.
const App: React.FC = () => {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
};

export default App;
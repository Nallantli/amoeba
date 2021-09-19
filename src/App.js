import './App.css';
import { Board } from './Board';
import React from 'react';

function App() {
  const params = new URLSearchParams(window.location.search);
  const winLength = params.get('win') ? parseInt(params.get('win')) : 5;
  const playerCount = params.get('count') ? parseInt(params.get('count')) : 2;
  const limit = params.get('limit') ? parseInt(params.get('limit')) : 0;

  return (
    <Board
      params={params}
      winLength={winLength}
      playerCount={playerCount}
      limit={limit}
      isLimited={limit > 0}
    />
  );
}

export default App;

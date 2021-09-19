import './App.css';
import { Board } from './Board';
import React from 'react';
import { Menu } from './Menu';

function App() {
	const params = new URLSearchParams(window.location.search);
	const winLength = params.get('win') ? parseInt(params.get('win'), 10) : 5;
	const playerCount = params.get('count') ? parseInt(params.get('count'), 10) : 2;
	const limit = params.get('limit') ? parseInt(params.get('limit'), 10) : 0;
	const delay = params.get('delay') ? parseInt(params.get('delay'), 10) : 0;

	switch (window.location.pathname) {
		case '/':
			return (<Board
				params={params}
				winLength={winLength}
				playerCount={playerCount}
				limit={limit}
				isLimited={limit > 0}
				turnDelay={delay}
			/>);
		case '/menu':
			return (<Menu
				params={params}
				winLength={winLength}
				playerCount={playerCount}
				limit={limit}
				isLimited={limit > 0}
				turnDelay={delay}
			/>);
	}
}

export default App;

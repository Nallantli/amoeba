import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemeSelector from './ThemeSelector';
import { AI } from './AI';
import { Elk } from './ais/Elk';
import { ElkAtt } from './ais/ElkAtt';
import { ElkDef } from './ais/ElkDef';
import { Fuzzy } from './ais/Fuzzy';

const params = new URLSearchParams(window.location.search);
const winLength = params.get('win') ? parseInt(params.get('win') as string, 10) : 5;
const playerCount = params.get('count') ? parseInt(params.get('count') as string, 10) : 2;
const limit = params.get('limit') ? parseInt(params.get('limit') as string, 10) : 0;

let AIs: (AI | undefined)[] = [];
for (let i = 0; i < playerCount; i++) {
	switch (params.get(`p${i + 1}`)) {
		case "fuzzy":
			AIs.push(new Fuzzy(winLength, i + 1, playerCount));
			break;
		case "elk":
			AIs.push(new Elk(winLength, i + 1, playerCount));
			break;
		case "elkatt":
			AIs.push(new ElkAtt(winLength, i + 1, playerCount));
			break;
		case "elkdef":
			AIs.push(new ElkDef(winLength, i + 1, playerCount));
			break;
		default:
			AIs.push(undefined);
			break;
	}
}

const gameState = {
	turn: 0,
	placements: [],
	map: {},
	playerCount: playerCount,
	moveLimit: (limit > 0 ? limit : 0),
	winLength: winLength,
	isLimited: limit > 0,
	AIs: AIs,
	win: false,
	playerScores: Array(playerCount).fill(0)
}

ReactDOM.render(
	<React.StrictMode>
		<ThemeSelector theme={params.get('theme') || 'default'}>
			<App gameState={gameState} params={params} />
		</ThemeSelector>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

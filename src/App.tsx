import { Board } from './Board';
import { CircleIcon } from './assets/CircleIcon';
import { CrossIcon } from './assets/CrossIcon';
import { DiamondIcon } from './assets/DiamondIcon';
import { SquareIcon } from './assets/SquareIcon';
import { addChunk, GameState } from './GameState';
import { AI } from './AI';
import { Elk } from './ais/Elk';
import { ElkAtt } from './ais/ElkAtt';
import { ElkDef } from './ais/ElkDef';
import { Fuzzy } from './ais/Fuzzy';
import { useState } from 'react';

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

let defaultGameState: GameState = {
	turn: 0,
	placements: [],
	map: {},
	playerCount: playerCount,
	moveLimit: (limit > 0 ? limit : 0),
	winLength: winLength,
	isLimited: limit > 0
};

for (let i = -1; i <= 1; i++) {
	for (let j = -1; j <= 1; j++) {
		defaultGameState = { ...defaultGameState, ...addChunk(defaultGameState, i, j) };
	}
}

function doLocalTurn(gameState: GameState, boardRef: any, turnDelay: number) {
	if (AIs[gameState.turn] !== undefined) {
		const { x, y } = (AIs[gameState.turn] as AI).doTurn(gameState);
		setTimeout(
			() => boardRef.current?.dispatchEvent(
				new CustomEvent('selectSquare',
					{ detail: { x: x, y: y } })),
			turnDelay);
	}
}

function App() {
	const delay = params.get('delay') ? parseInt(params.get('delay') as string, 10) : 0;
	const [gameState, setGameState] = useState(defaultGameState);

	return (<Board
		config={{
			playerColors: [
				'#5588ff',
				'#ff3344',
				"#33ff44",
				'#ffcc33'
			],
			playerIcons: [
				CircleIcon,
				CrossIcon,
				DiamondIcon,
				SquareIcon
			],
			turnDelay: delay
		}}
		gameState={gameState}
		broadcast={(gs: GameState, callback: (gs: GameState) => void) => {
			setGameState(gs);
			callback(gs);
		}}
		doLocalTurn={doLocalTurn}
		canMove={AIs[gameState.turn] === undefined}
	/>);
}

export default App;

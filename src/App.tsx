import { Board } from './Board';
import { addChunk, GameState } from './GameState';
import { AI } from './AI';
import { Elk } from './ais/Elk';
import { ElkAtt } from './ais/ElkAtt';
import { ElkDef } from './ais/ElkDef';
import { Fuzzy } from './ais/Fuzzy';
import React from 'react';
import { GameProps } from './GameProps';
import { ElkSurf } from './ais/ElkSurf';
import { ElkTimid } from './ais/ElkTimid';

// const params = new URLSearchParams(window.location.search);

function doLocalTurn(gameState: GameState, boardRef: any, turnDelay: number, playerScores: number[]) {
	if (gameState.AIs[gameState.turn] !== undefined) {
		const { x, y } = (gameState.AIs[gameState.turn] as AI).doTurn(gameState, playerScores);
		setTimeout(
			() => boardRef.current?.dispatchEvent(
				new CustomEvent('selectSquare',
					{ detail: { x: x, y: y } })),
			turnDelay);
	}
}

class App extends React.Component<GameProps, GameState> {
	constructor(props: GameProps) {
		super(props);

		const { winLength, limit, AINames, delay } = props;

		let AIs: (AI | undefined)[] = [];
		for (let i = 0; i < AINames.length; i++) {
			switch (AINames[i]) {
				case "fuzzy":
					AIs.push(new Fuzzy(winLength, i + 1, AINames.length));
					break;
				case "elk":
					AIs.push(new Elk(winLength, i + 1, AINames.length));
					break;
				case "elkatt":
					AIs.push(new ElkAtt(winLength, i + 1, AINames.length));
					break;
				case "elkdef":
					AIs.push(new ElkDef(winLength, i + 1, AINames.length));
					break;
				case "elksurf":
					AIs.push(new ElkSurf(winLength, i + 1, AINames.length));
					break;
				case "elktimid":
					AIs.push(new ElkTimid(winLength, i + 1, AINames.length));
					break;
				default:
					AIs.push(undefined);
					break;
			}
		}

		this.state = {
			turn: 0,
			placements: [],
			map: {},
			playerCount: AINames.length,
			moveLimit: (limit > 0 ? limit : 0),
			winLength: winLength,
			isLimited: limit > 0,
			delay,
			AIs
		};

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				this.state = { ...this.state, ...addChunk(this.state, i, j) };
			}
		}
	}

	render() {
		const { iconConfig } = this.props;
		const { AIs } = this.state;

		return (<Board
			iconConfig={iconConfig}
			gameState={this.state}
			broadcast={(gs: GameState, callback: (gs: GameState) => void) => {
				this.setState(gs);
				callback(gs);
			}}
			doLocalTurn={doLocalTurn}
			canMove={AIs[this.state.turn] === undefined}
		/>);
	}
}

export default App;

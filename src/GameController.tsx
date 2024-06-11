import { Board } from "./Board";
import { addChunk, GameState } from "./GameState";
import { AI } from "./AI";
import React from "react";
import { GameProps } from "./GameProps";
import { IconConfig } from "./IconConfig";

interface GameControllerProps {
	gameProps: GameProps;
	iconConfig: IconConfig;
}

export class GameController extends React.Component<GameControllerProps, GameState> {
	constructor(props: GameControllerProps) {
		super(props);

		const { winLength, limit, AINames, AISelectOptions } = props.gameProps;

		const players: (AI | null)[] = AINames.map((AIName, i) => (AIName === "player" ? null : new AISelectOptions[AIName](winLength, i + 1, AINames.length)));

		this.state = {
			turn: 0,
			placements: [],
			map: {},
			moveLimit: limit > 0 ? limit : 0,
			isLimited: limit > 0,
			players,
		};

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				this.state = { ...this.state, ...addChunk(this.state, i, j) };
			}
		}
	}

	render() {
		const {
			gameProps: { delay, winLength },
			iconConfig,
		} = this.props;
		const { players } = this.state;

		return (
			<Board
				iconConfig={iconConfig}
				gameState={this.state}
				broadcast={(gs: GameState, callback: (gs: GameState) => void) => {
					this.setState(gs);
					callback(gs);
				}}
				canMove={players[this.state.turn] === null}
				delay={delay}
				winLength={winLength}
			/>
		);
	}
}

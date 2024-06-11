import { Board } from "./Board";
import { addChunk, GameState } from "./GameState";
import { AI } from "./AI";
import React, { useState } from "react";
import { GameProps } from "./GameProps";
import { IconConfig } from "./IconConfig";
import { generateInitialGameState } from "./utils";

interface GameControllerProps {
	gameProps: GameProps;
	iconConfig: IconConfig;
}

export function GameController({ gameProps, gameProps: { delay, winLength }, iconConfig }: GameControllerProps) {
	const [gameState, setGameState] = useState<GameState>(generateInitialGameState(gameProps));

	const { players, turn } = gameState;

	return (
		<Board
			iconConfig={iconConfig}
			gameState={gameState}
			broadcast={(gs: GameState, callback: (gs: GameState) => void) => {
				setGameState(gs);
				callback(gs);
			}}
			canMove={players[turn] === null}
			delay={delay}
			winLength={winLength}
		/>
	);
}

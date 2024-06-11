import { Board } from "./Board";
import { GameProps } from "./GameProps";
import { GameState } from "./GameState";
import { IconConfig } from "./IconConfig";

interface GameControllerProps {
	gameProps: GameProps;
	gameState: GameState;
	setGameState: (gameState: GameState) => void;
	iconConfig: IconConfig;
}

export function GameController({ gameState, setGameState, gameProps: { delay, winLength }, iconConfig }: GameControllerProps) {
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

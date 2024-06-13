import { AppState } from "./AppState";
import { Board } from "./Board";
import { GameProps } from "./GameProps";
import { GameState } from "./GameState";
import { IconConfig } from "./IconConfig";

interface GameControllerProps {
	gameProps: GameProps;
	gameState: GameState;
	appState: AppState;
	setGameState: (gameState: GameState) => void;
	iconConfig: IconConfig;
}

export function GameController({
	gameState,
	gameState: { players, turn },
	setGameState,
	appState,
	gameProps: { delay, winLength, socket },
	iconConfig,
}: GameControllerProps) {
	return (
		<Board
			iconConfig={iconConfig}
			gameState={gameState}
			broadcast={(gs: GameState, callback: (gs: GameState) => void) => {
				if (socket) {
					socket?.send(
						JSON.stringify([
							{
								action: "BROADCAST_MOVE",
								id: appState?.multiplayerState?.id,
								gameState: gs,
							},
						])
					);
				} else {
					setGameState(gs);
				}
				callback(gs);
			}}
			canMove={!socket ? players[turn] === null : turn === appState.multiplayerState?.playerIndex}
			delay={delay}
			winLength={winLength}
		/>
	);
}

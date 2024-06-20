import { MultiplayerState } from "../MultiplayerState";
import { Board } from "./Board";
import { GameProps } from "../GameProps";
import { GameState } from "../GameState";
import { IconConfig } from "../IconConfig";

interface GameControllerProps {
	socket?: WebSocket;
	gameProps: GameProps;
	gameState: GameState;
	multiplayerState?: MultiplayerState;
	setGameState: (gameState: GameState) => void;
	iconConfig: IconConfig;
}

export function GameController({
	socket,
	gameState,
	multiplayerState,
	gameState: { players, turn },
	setGameState,
	gameProps,
	gameProps: { delay, winLength },
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
								id: multiplayerState?.id,
								gameState: gs,
								gameProps,
							},
						])
					);
				} else {
					setGameState(gs);
				}
				callback(gs);
			}}
			canMove={!socket ? players[turn] === null : turn === multiplayerState?.playerIndex}
			delay={delay}
			winLength={winLength}
		/>
	);
}

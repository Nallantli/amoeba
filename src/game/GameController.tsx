import { MultiplayerState } from "../state/MultiplayerState";
import { Board } from "./Board";
import { GameState } from "../state/GameState";
import { IconConfig } from "../state/IconConfig";
import { GameSettings } from "../state/GameSettings";

interface GameControllerProps {
	socket?: WebSocket;
	gameSettings: GameSettings;
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
	gameSettings,
	gameSettings: { delay, winLength },
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
								gameSettings,
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

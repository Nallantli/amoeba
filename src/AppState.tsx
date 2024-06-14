import { GameState } from "./GameState";

export interface MultiplayerState {
	id: string;
	playerIndex: number;
	players: {
		isReady: boolean;
		isHost: boolean;
		wins: number;
	}[];
}

export interface AppState {
	gameState?: GameState;
	multiplayerState?: MultiplayerState;
}

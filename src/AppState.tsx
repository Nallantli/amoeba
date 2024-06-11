import { GameState } from "./GameState";

export interface MultiplayerState {
	id: string;
    playerIndex: number;
    players: {
        pos: number;
        isReady: boolean,
        isHost: boolean
    }[]
}

export interface AppState {
	gameState?: GameState;
	multiplayerState?: MultiplayerState;
}

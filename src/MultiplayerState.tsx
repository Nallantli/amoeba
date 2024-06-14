export interface MultiplayerState {
	id: string;
	playerIndex: number;
	players: {
		isReady: boolean;
		isHost: boolean;
		wins: number;
	}[];
}
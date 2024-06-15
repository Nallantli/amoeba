export interface MultiplayerState {
	id: string;
	playerIndex: number;
	players: {
		isReady: boolean;
		isHost: boolean;
		name: string;
		wins: number;
	}[];
}
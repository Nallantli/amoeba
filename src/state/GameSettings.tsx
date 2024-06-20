export interface GameSettings {
	winLength: number;
	limit: number;
	delay: number;
	playerName?: string;
}

export interface LocalGameSettings {
	AINames: string[];
	AISelectOptions: { [key: string]: any };
	socket?: WebSocket;
}

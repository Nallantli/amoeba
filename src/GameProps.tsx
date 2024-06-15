export interface GameProps {
	winLength: number;
	limit: number;
	delay: number;
	playerName?: string;
}

export interface LocalGameProps {
	AINames: string[];
	AISelectOptions: { [key: string]: any };
	socket?: WebSocket;
}

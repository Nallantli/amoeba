export interface GameProps {
	winLength: number;
	limit: number;
	delay: number;
}

export interface LocalGameProps {
	AINames: string[];
	AISelectOptions: { [key: string]: any };
	socket?: WebSocket;
}
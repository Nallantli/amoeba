export type GameProps = {
	winLength: number;
	limit: number;
	delay: number;
	AINames: string[];
	AISelectOptions: { [key: string]: any };
	socket?: WebSocket;
};

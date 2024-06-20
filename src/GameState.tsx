import { AI } from "./game/AI";

export interface GameMap {
	[key: string]: { x: number; y: number; chunkData: number[][] };
}

export type GameState = {
	map: GameMap;
	placements: { x: number; y: number; v: number }[];
	moveLimit: number;
	isLimited: boolean;
	turn: number;
	players: (AI | null)[];
	status: number;
};
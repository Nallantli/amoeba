import { AI } from "./AI";
import { GameProps } from "./GameProps";
import { GameMap, addChunk } from "./GameState";

export const serverUrl = "wss://wmgs.nallant.li:8081";

export function flatten(x: number, d: number): number {
	while (x < 0) x += d;
	return x % d;
}

/* carter code */
export function fib(n: number): number {
	if (n === 1 || n === 0) return n;
	else return fib(n - 2) + fib(n - 1);
}

function generateInitialChunks() {
	let map: GameMap = {};
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			map = addChunk(map, i, j);
		}
	}
	return map;
}

export function generateInitialGameState(gameProps: GameProps) {
	const { AINames, AISelectOptions, limit, winLength } = gameProps;
	const players: (AI | null)[] = AINames.map((AIName, i) => (AIName === "player" ? null : new AISelectOptions[AIName](winLength, i + 1, AINames.length)));
	return {
		turn: 0,
		placements: [],
		map: generateInitialChunks(),
		moveLimit: limit > 0 ? limit : 0,
		isLimited: limit > 0,
		players,
		isStarted: true
	};
}

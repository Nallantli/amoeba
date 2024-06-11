import { AI } from "./AI";
import { AppState } from "./AppState";
import { GameProps } from "./GameProps";
import { GameMap, GameState, addChunk } from "./GameState";

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

function getPlayers(gameProps: GameProps, appState: AppState) {
	if (appState.multiplayerState) {
		return appState.multiplayerState.players.map(() => null);
	}
	const { AINames, AISelectOptions, winLength } = gameProps;
	return AINames.map((AIName, i) => (AIName === "player" ? null : new AISelectOptions[AIName](winLength, i + 1, AINames.length)));
}

export function generateInitialGameState(gameProps: GameProps, appState: AppState): GameState {
	const { limit } = gameProps;
	const players: (AI | null)[] = getPlayers(gameProps, appState);
	return {
		turn: 0,
		placements: [],
		map: generateInitialChunks(),
		moveLimit: limit > 0 ? limit : 0,
		isLimited: limit > 0,
		players,
		isStarted: true,
	};
}

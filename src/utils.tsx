import { AI } from "./AI";
import { AppState } from "./AppState";
import { GameProps } from "./GameProps";
import { GameMap, GameState, addChunk, calculateLimitScore, getValue } from "./GameState";
import { IconConfig } from "./IconConfig";

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

export function displayWin(gameState: GameState, iconConfig: IconConfig, winner: number) {
	const { placements, map } = gameState;
	placements.forEach((placement) => {
		let element = document.getElementById(placement.x + "_" + placement.y) as HTMLElement;
		element.classList.add("amoeba-square");
		let shadow = [];
		if (window.getComputedStyle(element).boxShadow !== "none") {
			shadow.push(window.getComputedStyle(element).boxShadow);
		}
		if (getValue(map, placement.x, placement.y + 1) === 0) {
			shadow.push(`${iconConfig.playerColors[winner]} 0rem 0.4rem`);
		}
		if (
			getValue(map, placement.x + 1, placement.y) === 0 &&
			getValue(map, placement.x, placement.y + 1) === 0 &&
			getValue(map, placement.x + 1, placement.y + 1) === 0
		) {
			shadow.push(`${iconConfig.playerColors[winner]} 0.4rem 0.4rem`);
		}
		if (getValue(map, placement.x + 1, placement.y) === 0) {
			shadow.push(`${iconConfig.playerColors[winner]} 0.4rem 0rem`);
		}
		if (
			getValue(map, placement.x + 1, placement.y) === 0 &&
			getValue(map, placement.x, placement.y - 1) === 0 &&
			getValue(map, placement.x + 1, placement.y - 1) === 0
		) {
			shadow.push(`${iconConfig.playerColors[winner]} 0.4rem -0.4rem`);
		}
		if (getValue(map, placement.x, placement.y - 1) === 0) {
			shadow.push(`${iconConfig.playerColors[winner]} 0rem -0.4rem`);
		}
		if (
			getValue(map, placement.x - 1, placement.y) === 0 &&
			getValue(map, placement.x, placement.y + 1) === 0 &&
			getValue(map, placement.x - 1, placement.y + 1) === 0
		) {
			shadow.push(`${iconConfig.playerColors[winner]} -0.4rem 0.4rem`);
		}
		if (getValue(map, placement.x - 1, placement.y) === 0) {
			shadow.push(`${iconConfig.playerColors[winner]} -0.4rem 0rem`);
		}
		if (
			getValue(map, placement.x - 1, placement.y) === 0 &&
			getValue(map, placement.x, placement.y - 1) === 0 &&
			getValue(map, placement.x - 1, placement.y - 1) === 0
		) {
			shadow.push(`${iconConfig.playerColors[winner]} -0.4rem -0.4rem`);
		}
		element.style.boxShadow = shadow.join(", ");
	});
}

export function calculateWinner(gameState: GameState, winLength: number) {
	const { isLimited, players, turn } = gameState;
	return flatten(
		isLimited
			? calculateLimitScore(gameState, winLength)
					.map((e, i) => ({ e, i }))
					.sort((a, b) => b.e - a.e)[0].i
			: turn - 1,
		players.length
	);
}

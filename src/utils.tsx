import { AI } from "./AI";
import { AppState } from "./AppState";
import { GameProps } from "./GameProps";
import { GameMap, GameState, addChunk, calculateLimitScore, getValue } from "./GameState";
import { IconConfig } from "./IconConfig";
import startSoundFile from "./audio/start.ogg";
import buttonSoundFile from "./audio/button.wav";
import winSoundFile from "./audio/win.wav";
import loseSoundFile from "./audio/lose.wav";

export const serverUrl = "wss://wmgs.nallant.li:8081";

export const startAudio = new Audio(startSoundFile);
export const buttonAudio = new Audio(buttonSoundFile);
export const winSoundAudio = new Audio(winSoundFile);
export const loseSoundAudio = new Audio(loseSoundFile);

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
	if (gameProps.socket && appState.multiplayerState) {
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

export function getWinBorder(map: GameMap, x: number, y: number, winner: number, iconConfig: IconConfig) {
	let shadow = [];
	if (getValue(map, x, y + 1) === 0) {
		shadow.push(`${iconConfig.playerColors[winner]} 0rem 0.4rem`);
	}
	if (getValue(map, x + 1, y) === 0 && getValue(map, x, y + 1) === 0 && getValue(map, x + 1, y + 1) === 0) {
		shadow.push(`${iconConfig.playerColors[winner]} 0.4rem 0.4rem`);
	}
	if (getValue(map, x + 1, y) === 0) {
		shadow.push(`${iconConfig.playerColors[winner]} 0.4rem 0rem`);
	}
	if (getValue(map, x + 1, y) === 0 && getValue(map, x, y - 1) === 0 && getValue(map, x + 1, y - 1) === 0) {
		shadow.push(`${iconConfig.playerColors[winner]} 0.4rem -0.4rem`);
	}
	if (getValue(map, x, y - 1) === 0) {
		shadow.push(`${iconConfig.playerColors[winner]} 0rem -0.4rem`);
	}
	if (getValue(map, x - 1, y) === 0 && getValue(map, x, y + 1) === 0 && getValue(map, x - 1, y + 1) === 0) {
		shadow.push(`${iconConfig.playerColors[winner]} -0.4rem 0.4rem`);
	}
	if (getValue(map, x - 1, y) === 0) {
		shadow.push(`${iconConfig.playerColors[winner]} -0.4rem 0rem`);
	}
	if (getValue(map, x - 1, y) === 0 && getValue(map, x, y - 1) === 0 && getValue(map, x - 1, y - 1) === 0) {
		shadow.push(`${iconConfig.playerColors[winner]} -0.4rem -0.4rem`);
	}
	return shadow.join(", ");
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

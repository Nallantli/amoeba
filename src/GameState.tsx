import { AI } from "./AI";
import { chunkSize } from "./Chunk";
import { fib, flatten } from "./utils";

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
	isStarted: boolean;
};

function horizontalCount(map: GameMap, x: number, y: number, v: number) {
	let ps = [];
	while (getValue(map, x, y) === v) {
		ps.push({ x, y });
		x++;
	}
	return { ps, type: 0 };
}

function verticalCount(map: GameMap, x: number, y: number, v: number) {
	let ps = [];
	while (getValue(map, x, y) === v) {
		ps.push({ x, y });
		y++;
	}
	return { ps, type: 1 };
}

function diagonalUp(map: GameMap, x: number, y: number, v: number) {
	let ps = [];
	while (getValue(map, x, y) === v) {
		ps.push({ x, y });
		y++;
		x++;
	}
	return { ps, type: 2 };
}

function diagonalDown(map: GameMap, x: number, y: number, v: number) {
	let ps = [];
	while (getValue(map, x, y) === v) {
		ps.push({ x, y });
		y--;
		x++;
	}
	return { ps, type: 3 };
}

export function getValue(map: GameMap, x: number, y: number) {
	const chunk = map[Math.floor(x / chunkSize) + "_" + Math.floor(y / chunkSize)];
	if (chunk === undefined) {
		return 0;
	}
	return chunk.chunkData[flatten(x, chunkSize)][flatten(y, chunkSize)];
}

function sharePoint(a: { x: number; y: number }[], b: { x: number; y: number }[]) {
	for (let i = 0; i < a.length; i++) {
		for (let j = 0; j < b.length; j++) {
			if (a[i].x === b[j].x && a[i].y === b[j].y) return true;
		}
	}
	return false;
}

export function getPlayerScores(gameState: GameState, winLength: number) {
	const { isLimited } = gameState;
	return isLimited ? calculateLimitScore(gameState, winLength) : [];
}

export function calculateLimitScore(gameState: GameState, winLength: number) {
	const { players, placements, map } = gameState;
	let matches: { type: number; ps: { x: number; y: number }[]; old?: boolean }[][] = [];
	for (let i = 0; i < players.length; i++) {
		matches.push([]);
	}
	placements.forEach((placement: { x: number; y: number; v: number }) => {
		[
			horizontalCount(map, placement.x, placement.y, placement.v),
			verticalCount(map, placement.x, placement.y, placement.v),
			diagonalUp(map, placement.x, placement.y, placement.v),
			diagonalDown(map, placement.x, placement.y, placement.v),
		].forEach((e) => {
			if (e.ps.length < winLength) {
				return;
			}
			let flag = false;
			let removes: number[] = [];
			matches[placement.v - 1].forEach((p: { type: number; ps: { x: number; y: number }[] }, i: number) => {
				if (p.type === e.type && sharePoint(p.ps, e.ps)) {
					if (p.ps.length < e.ps.length) {
						removes.push(i);
					} else {
						flag = true;
					}
				}
			});
			removes.forEach((i) => (matches[placement.v - 1][i].old = true));
			if (!flag) {
				matches[placement.v - 1].push(e);
			}
		});
	});
	let playerScores: number[] = [];
	matches.map((m) => m.filter((e) => e.old === undefined));
	matches.forEach((e) => {
		let score = 0;
		e.forEach((p) => {
			score += fib(p.ps.length - winLength + 2);
		});
		playerScores.push(score);
	});
	return playerScores;
}

export function checkWin(gameState: GameState, winLength: number): boolean {
	if (gameState.placements.length === 0) {
		return false;
	}
	const { x, y } = gameState.placements[gameState.placements.length - 1];
	const { isLimited, moveLimit, map } = gameState;
	if (isLimited) {
		if (moveLimit === 0) {
			return true;
		}
		return false;
	} else {
		const check = getValue(map, x, y);
		if (check === 0) return false;
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(map, x - i + j, y);
				if (s === undefined) break;
				if (s !== check) break;
				squares.push(x - i + j + "_" + y);
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
				return true;
			}
		}
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				const s = getValue(map, x, y - i + j);
				if (s === undefined) break;
				if (s !== check) break;
				squares.push(x + "_" + (y - i + j));
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
				return true;
			}
		}
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(map, x - i + j, y - i + j);
				if (s === undefined) break;
				if (s !== check) break;
				squares.push(x - i + j + "_" + (y - i + j));
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
				return true;
			}
		}
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(map, x - i + j, y + i - j);
				if (s === undefined) break;
				if (s !== check) break;
				squares.push(x - i + j + "_" + (y + i - j));
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
				return true;
			}
		}
	}
	return false;
}

export function addChunk(map: GameMap, x: number, y: number): GameMap {
	if (map[x + "_" + y] !== undefined) {
		return map;
	}
	let chunkData: number[][] = [];
	for (let i = 0; i < chunkSize; i++) {
		chunkData[i] = [];
		for (let j = 0; j < chunkSize; j++) {
			chunkData[i][j] = 0;
		}
	}
	return {
		...map,
		[`${x}_${y}`]: {
			x: x,
			y: y,
			chunkData,
		},
	};
}

function generateBorderChunks(map: GameMap, chunkX: number, chunkY: number): GameMap {
	let newMap = {
		...map,
	};
	for (let i = chunkX - 1; i <= chunkX + 1; i++) {
		for (let j = chunkY - 1; j <= chunkY + 1; j++) {
			newMap = addChunk(newMap, i, j);
		}
	}
	return newMap;
}

export function selectSquare(gameState: GameState, x: number, y: number): GameState {
	const { turn, moveLimit, placements, players, map } = gameState;
	let newGameState = { ...gameState };

	const chunkX = Math.floor(x / chunkSize);
	const chunkY = Math.floor(y / chunkSize);
	const v = turn + 1;
	const chunk = gameState.map[chunkX + "_" + chunkY];
	if (chunk === undefined) {
		newGameState.map = addChunk(map, chunkX, chunkY);
		return selectSquare(newGameState, x, y);
	}
	chunk.chunkData[flatten(x, chunkSize)][flatten(y, chunkSize)] = v;
	newGameState.map = generateBorderChunks(map, chunkX, chunkY);
	return {
		...newGameState,
		map: {
			...newGameState.map,
			[chunkX + "_" + chunkY]: chunk,
		},
		placements: [...placements, { x, y, v }],
		turn: (turn + 1) % players.length,
		moveLimit: moveLimit - (turn === players.length - 1 ? 1 : 0),
	};
}

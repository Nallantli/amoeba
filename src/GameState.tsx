import { AI } from "./AI";
import { chunkSize } from "./Chunk";
import { fib, flatten } from "./utils";

export type GameState = {
	map: { [key: string]: { x: number, y: number, chunkData: number[][] } };
	placements: { x: number, y: number, v: number }[];
	playerCount: number;
	winLength: number;
	moveLimit: number;
	isLimited: boolean;
	turn: number;
	AIs: (AI | undefined)[];
	win: boolean;
	playerScores: number[];
};

function horizontalCount(gameState: GameState, x: number, y: number, v: number) {
	let ps = [];
	while (getValue(gameState, x, y) === v) {
		ps.push({ x, y });
		x++;
	}
	return { ps, type: 0 };
}

function verticalCount(gameState: GameState, x: number, y: number, v: number) {
	let ps = [];
	while (getValue(gameState, x, y) === v) {
		ps.push({ x, y });
		y++;
	}
	return { ps, type: 1 };
}

function diagonalUp(gameState: GameState, x: number, y: number, v: number) {
	let ps = [];
	while (getValue(gameState, x, y) === v) {
		ps.push({ x, y });
		y++;
		x++;
	}
	return { ps, type: 2 };
}

function diagonalDown(gameState: GameState, x: number, y: number, v: number) {
	let ps = [];
	while (getValue(gameState, x, y) === v) {
		ps.push({ x, y });
		y--;
		x++;
	}
	return { ps, type: 3 };
}

export function getValue(gameState: GameState, x: number, y: number) {
	const { map } = gameState;
	const chunk = map[Math.floor(x / chunkSize) + '_' + Math.floor(y / chunkSize)];
	if (chunk === undefined) {
		return 0;
	}
	return chunk.chunkData[flatten(x, chunkSize)][flatten(y, chunkSize)];
}

function sharePoint(a: { x: number, y: number }[], b: { x: number, y: number }[]) {
	for (let i = 0; i < a.length; i++) {
		for (let j = 0; j < b.length; j++) {
			if (a[i].x === b[j].x && a[i].y === b[j].y)
				return true;
		}
	}
	return false;
}

function calculateLimitScore(gameState: GameState) {
	const { playerCount, winLength, placements } = gameState;
	let matches: { type: number, ps: { x: number, y: number }[], old?: boolean }[][] = [];
	for (let i = 0; i < playerCount; i++) {
		matches.push([]);
	}
	placements.forEach((placement: { x: number, y: number, v: number }) => {
		[
			horizontalCount(gameState, placement.x, placement.y, placement.v),
			verticalCount(gameState, placement.x, placement.y, placement.v),
			diagonalUp(gameState, placement.x, placement.y, placement.v),
			diagonalDown(gameState, placement.x, placement.y, placement.v)
		].forEach(e => {
			if (e.ps.length < winLength) {
				return;
			}
			let flag = false;
			let removes: number[] = [];
			matches[placement.v - 1].forEach((p: { type: number, ps: { x: number, y: number }[] }, i: number) => {
				if (p.type === e.type && sharePoint(p.ps, e.ps)) {
					if (p.ps.length < e.ps.length) {
						removes.push(i);
					} else {
						flag = true;
					}
				}
			});
			removes.forEach(i => matches[placement.v - 1][i].old = true);
			if (!flag) {
				matches[placement.v - 1].push(e);
			}
		});
	});
	let playerScores: number[] = [];
	matches.map(m => m.filter(e => e.old === undefined));
	matches.forEach(e => {
		let score = 0;
		e.forEach(p => {
			score += fib(p.ps.length - winLength + 2);
		});
		playerScores.push(score);
	});
	return playerScores;
}

export function checkWin(gameState: GameState, lastMove: { x: number, y: number }): GameState {
	const { x, y } = lastMove;
	const { winLength, isLimited, moveLimit } = gameState;
	if (isLimited) {
		const playerScores = calculateLimitScore(gameState);
		if (moveLimit === 0) {
			return gameState = { ...gameState, win: true, playerScores };
		}
		return gameState = { ...gameState, win: false, playerScores };
	} else {
		const check = getValue(gameState, x, y);
		if (check === 0)
			return gameState = { ...gameState, win: false, playerScores: [] };
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(gameState, x - i + j, y);
				if (s === undefined)
					break;
				if (s !== check)
					break;
				squares.push((x - i + j) + "_" + y);
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
				return gameState = { ...gameState, win: true, playerScores: [] };
			}
		}
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				const s = getValue(gameState, x, y - i + j);
				if (s === undefined)
					break;
				if (s !== check)
					break;
				squares.push(x + "_" + (y - i + j));
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
				return gameState = { ...gameState, win: true, playerScores: [] };
			}
		}
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(gameState, x - i + j, y - i + j);
				if (s === undefined)
					break;
				if (s !== check)
					break;
				squares.push((x - i + j) + "_" + (y - i + j));
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
				return gameState = { ...gameState, win: true, playerScores: [] };
			}
		}
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(gameState, x - i + j, y + i - j);
				if (s === undefined)
					break;
				if (s !== check)
					break;
				squares.push((x - i + j) + "_" + (y + i - j));
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
				return gameState = { ...gameState, win: true, playerScores: [] };
			}
		}
	}
	return gameState = { ...gameState, win: false, playerScores: [] };
}

export function addChunk(gameState: GameState, x: number, y: number) {
	const { map } = gameState;
	if (map[x + '_' + y] !== undefined) {
		return gameState;
	}
	let chunkData: number[][] = [];
	for (let i = 0; i < chunkSize; i++) {
		chunkData[i] = [];
		for (let j = 0; j < chunkSize; j++) {
			chunkData[i][j] = 0;
		}
	}
	return gameState = {
		...gameState,
		map: {
			...map,
			[`${x}_${y}`]: {
				x: x,
				y: y,
				chunkData
			}
		}
	};
}

export function selectSquare(gameState: GameState, x: number, y: number) {
	const { map, turn, moveLimit, placements, playerCount } = gameState;
	const v = turn + 1;
	const chunk = map[Math.floor(x / chunkSize) + '_' + Math.floor(y / chunkSize)];
	chunk.chunkData[flatten(x, chunkSize)][flatten(y, chunkSize)] = v;
	gameState = {
		...gameState,
		map: {
			...map,
			[Math.floor(x / chunkSize) + '_' + Math.floor(y / chunkSize)]: chunk
		},
		placements: [...placements, { x, y, v }],
		turn: (turn + 1) % playerCount,
		moveLimit: moveLimit - (turn === playerCount - 1 ? 1 : 0)
	};
	return { v, gameState };
}
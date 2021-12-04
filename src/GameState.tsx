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

export function calculateLimitScore(gameState: GameState) {
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

export function checkWin(gameState: GameState): boolean {
	if (gameState.placements.length === 0) {
		return false;
	}
	const { x, y } = gameState.placements[gameState.placements.length - 1];
	const { winLength, isLimited, moveLimit } = gameState;
	if (isLimited) {
		if (moveLimit === 0) {
			return true;
		}
		return false;
	} else {
		const check = getValue(gameState, x, y);
		if (check === 0)
			return false;
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
				return true;
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
				return true;
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
				return true;
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
				return true;
			}
		}
	}
	return false;
}

export function addChunk(gameState: GameState, x: number, y: number): GameState {
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

function generateBorderChunks(gameState: GameState, chunkX: number, chunkY: number): GameState {
	for (let i = chunkX - 1; i <= chunkX + 1; i++) {
		for (let j = chunkY - 1; j <= chunkY + 1; j++) {
			gameState = { ...gameState, ...addChunk(gameState, i, j) };
		}
	}
	return gameState;
}

export function selectSquare(gameState: GameState, x: number, y: number): GameState {
	const { turn, moveLimit, placements, playerCount } = gameState;
	const chunkX = Math.floor(x / chunkSize);
	const chunkY = Math.floor(y / chunkSize);
	const v = turn + 1;
	const chunk = gameState.map[chunkX + '_' + chunkY];
	if (chunk === undefined) {
		return selectSquare(
			addChunk(
				gameState,
				chunkX,
				chunkY),
			x,
			y);
	}
	chunk.chunkData[flatten(x, chunkSize)][flatten(y, chunkSize)] = v;
	gameState = generateBorderChunks(gameState, chunkX, chunkY);
	return gameState = {
		...gameState,
		map: {
			...gameState.map,
			[chunkX + '_' + chunkY]: chunk
		},
		placements: [...placements, { x, y, v }],
		turn: (turn + 1) % playerCount,
		moveLimit: moveLimit - (turn === playerCount - 1 ? 1 : 0)
	};
}
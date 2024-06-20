import { AI } from "./game/AI";
import { MultiplayerState } from "./MultiplayerState";
import { GameProps, LocalGameProps } from "./GameProps";
import { GameMap, GameState } from "./GameState";
import { IconConfig } from "./IconConfig";
import { chunkSize } from "./game/Chunk";

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

function getPlayers(localGameProps: LocalGameProps, winLength: number, multiplayerState?: MultiplayerState) {
	if (localGameProps.socket && multiplayerState) {
		return multiplayerState.players.map(() => null);
	}
	const { AINames, AISelectOptions } = localGameProps;
	return AINames.map((AIName, i) => (AIName === "player" ? null : new AISelectOptions[AIName](winLength, i + 1, AINames.length)));
}

export function generateInitialGameState(localGameProps: LocalGameProps, gameProps: GameProps, multiplayerState?: MultiplayerState): GameState {
	const { limit, winLength } = gameProps;
	const players: (AI | null)[] = getPlayers(localGameProps, winLength, multiplayerState);
	return {
		turn: 0,
		placements: [],
		map: generateInitialChunks(),
		moveLimit: limit > 0 ? limit : 0,
		isLimited: limit > 0,
		players,
		status: 0,
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
	return calculateLimitScore(gameState, winLength)
		.map((e, i) => ({ e, i }))
		.sort((a, b) => b.e - a.e)[0].i;
}

export function setUpSocket(
	socket: WebSocket,
	setGameState: (gameState: GameState) => void,
	setMultiplayerState: (multiplayerState: MultiplayerState) => void,
	setGameProps: (gameProps: GameProps) => void,
	closeSocket: () => void,
	startClientGame: () => void,
	clientSocketClosed: () => void,
	checkMPWin: (gameState: GameState, multiplayerState: MultiplayerState) => [boolean, number?]
) {
	socket.addEventListener("message", (event) => {
		const data = JSON.parse(event.data);
		switch (data.action) {
			case "JOIN_FAILURE": {
				// const { message } = data;
				// TODO
				closeSocket();
				break;
			}
			case "START": {
				const { gameProps } = data;
				setGameProps(gameProps);
				startClientGame();
				break;
			}
			case "CLOSE": {
				clientSocketClosed();
				closeSocket();
				break;
			}
			// @ts-ignore
			case "STATE_UPDATE_MOVE": {
				const { gameState, id, playerIndex, players } = data;
				const [win, winner] = checkMPWin(gameState, {
					id,
					playerIndex,
					players,
				});
				if (win && players[playerIndex].isHost) {
					socket.send(
						JSON.stringify([
							{
								action: "END_GAME",
								id,
								winner,
							},
						])
					);
				} else {
					setGameState(gameState);
					setMultiplayerState({
						id,
						playerIndex,
						players,
					});
				}
				break;
			}
			case "STATE_UPDATE": {
				const { gameState, id, playerIndex, players } = data;
				if (players.length < 2 && gameState.status === 1) {
					socket.send(
						JSON.stringify([
							{
								action: "END_GAME",
								id,
								winner: 0,
							},
						])
					);
				} else {
					setGameState(gameState);
					setMultiplayerState({
						id,
						playerIndex,
						players,
					});
				}
				break;
			}
		}
	});
}

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

export function checkWin(gameState: GameState, winLength: number): [boolean, string[], number?] {
	if (gameState.placements.length === 0) {
		return [false, [], undefined];
	}
	const { x, y } = gameState.placements[gameState.placements.length - 1];
	const { isLimited, moveLimit, map } = gameState;
	if (isLimited) {
		if (moveLimit === 0) {
			return [true, [], calculateWinner(gameState, winLength)];
		}
		return [false, [], undefined];
	} else {
		const check = getValue(map, x, y);
		if (check === 0) return [false, [], undefined];
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(map, x - i + j, y);
				if (s === undefined) break;
				if (s !== check) break;
				squares.push(x - i + j + "_" + y);
			}
			if (squares.length === winLength) {
				return [true, squares, check - 1];
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
				return [true, squares, check - 1];
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
				return [true, squares, check - 1];
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
				return [true, squares, check - 1];
			}
		}
	}
	return [false, [], undefined];
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

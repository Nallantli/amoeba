import { GameState } from "./GameState";

export class AI {
	winLength: number;
	icon: number;
	pCount: number;
	constructor(
		winLength: number,
		icon: number,
		pCount: number
	) {
		this.winLength = winLength;
		this.icon = icon;
		this.pCount = pCount;
	}
	doTurn(_gameState: GameState, _playerScores: number[]): { x: number, y: number } {
		throw new Error("Method not implemented.");
	}
}
import { GameState } from "../state/GameState";

export class AI {
	winLength: number;
	icon: number;
	pCount: number;
	constructor(winLength: number, icon: number, pCount: number) {
		this.winLength = winLength;
		this.icon = icon;
		this.pCount = pCount;
	}
	async doTurn(_gameState: GameState): Promise<{ x: number; y: number }> {
		throw new Error("Method not implemented.");
	}
}

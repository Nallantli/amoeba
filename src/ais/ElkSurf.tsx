import { AI } from "../game/AI";
import { GameState } from "../GameState";
import { getValue, getPlayerScores } from "../utils";
import { countLine, getRandomElement } from "./utils";

// Becomes ElkAtt when winning, ElkDef when losing

export class ElkSurf extends AI {
	async doTurn(gameState: GameState) {
		const { placements, players, map } = gameState;
		let highAtt = 0;
		let highDef = 0;
		let heatMap: { x: number; y: number; att: number; def: number }[] = [];
		placements.forEach((e) => {
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					if (x === 0 && y === 0) {
						continue;
					}
					if (getValue(map, e.x + x, e.y + y) !== 0) {
						continue;
					}
					if (heatMap.find((h) => h.x === e.x + x && h.y === e.y + y)) {
						continue;
					}
					const mappings = Array(this.pCount)
						.fill(0)
						.map(
							(_, i) =>
								countLine(map, e.x + x, e.y + y, i + 1, 1, 0, getValue, this.winLength) +
								countLine(map, e.x + x, e.y + y, i + 1, 1, 1, getValue, this.winLength) +
								countLine(map, e.x + x, e.y + y, i + 1, 0, 1, getValue, this.winLength) +
								countLine(map, e.x + x, e.y + y, i + 1, -1, 1, getValue, this.winLength)
						);
					const o = {
						x: e.x + x,
						y: e.y + y,
						att: mappings[this.icon - 1],
						def: Math.max(...mappings.filter((_, i) => i !== this.icon - 1)),
					};
					if (o.att > highAtt) {
						highAtt = o.att;
					}
					if (o.def > highDef) {
						highDef = o.def;
					}
					heatMap.push(o);
				}
			}
		});
		if (heatMap.length === 0) {
			return { x: 0, y: 0 };
		} else {
			let maxDef = 0;
			let maxAtt = 0;
			let attMap = heatMap.filter((e) => e.att === highAtt);
			attMap.forEach((e) => {
				if (e.def > maxDef) {
					maxDef = e.def;
				}
			});
			attMap = attMap.filter((e) => e.def === maxDef);
			let defMap = heatMap.filter((e) => e.def === highDef);
			defMap.forEach((e) => {
				if (e.att > maxAtt) {
					maxAtt = e.att;
				}
			});
			defMap = defMap.filter((e) => e.att === maxAtt);
			let opponentScores = 0;
			let AIScore = 0;
			const playerScores = getPlayerScores(gameState, this.winLength);
			playerScores.forEach((score, index) => {
				if (players[index] === this) {
					AIScore = score;
				} else {
					opponentScores += score;
				}
			});
			const modif = opponentScores / (this.pCount - 1) < AIScore ? -1 : 1;
			return highAtt - highDef > modif ? getRandomElement(attMap) : getRandomElement(defMap);
		}
	}
}

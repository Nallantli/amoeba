import { AI } from "../AI";
import { GameState, getValue } from "../GameState";
import { countLine } from "./utils";

// Becomes ElkAtt when winning, ElkDef when losing

export class ElkSurf extends AI {
	doTurn(gameState: GameState, playerScores: number[]) {
		const { placements, AIs } = gameState;
		let highAtt = 0;
		let highDef = 0;
		let heatMap: { x: number; y: number; att: number; def: number; }[] = [];
		placements.forEach(e => {
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					if (x === 0 && y === 0) {
						continue;
					}
					if (getValue(gameState, e.x + x, e.y + y) !== 0) {
						continue;
					}
					let flag = false;
					heatMap.forEach(h => {
						if (h.x === e.x + x && h.y === e.y + y) {
							flag = true;
						}
					});
					if (flag) {
						continue;
					}
					let o = {
						x: e.x + x,
						y: e.y + y,
						att: Math.max(
							countLine(gameState, e.x + x, e.y + y, this.icon, 1, 0, getValue, this.winLength),
							countLine(gameState, e.x + x, e.y + y, this.icon, 1, 1, getValue, this.winLength),
							countLine(gameState, e.x + x, e.y + y, this.icon, 0, 1, getValue, this.winLength),
							countLine(gameState, e.x + x, e.y + y, this.icon, -1, 1, getValue, this.winLength),
							countLine(gameState, e.x + x, e.y + y, this.icon, -1, 0, getValue, this.winLength),
							countLine(gameState, e.x + x, e.y + y, this.icon, -1, -1, getValue, this.winLength),
							countLine(gameState, e.x + x, e.y + y, this.icon, 0, -1, getValue, this.winLength),
							countLine(gameState, e.x + x, e.y + y, this.icon, 1, -1, getValue, this.winLength)),
						def: Math.max(...Array(this.pCount).fill(0).map((_, i) => {
							return Math.max(
								countLine(gameState, e.x + x, e.y + y, i + 1, 1, 0, getValue, this.winLength),
								countLine(gameState, e.x + x, e.y + y, i + 1, 1, 1, getValue, this.winLength),
								countLine(gameState, e.x + x, e.y + y, i + 1, 0, 1, getValue, this.winLength),
								countLine(gameState, e.x + x, e.y + y, i + 1, -1, 1, getValue, this.winLength),
								countLine(gameState, e.x + x, e.y + y, i + 1, -1, 0, getValue, this.winLength),
								countLine(gameState, e.x + x, e.y + y, i + 1, -1, -1, getValue, this.winLength),
								countLine(gameState, e.x + x, e.y + y, i + 1, 0, -1, getValue, this.winLength),
								countLine(gameState, e.x + x, e.y + y, i + 1, 1, -1, getValue, this.winLength))
						}).filter((_, i) => i !== this.icon - 1))
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
			let attMap = heatMap.filter(e => e.att === highAtt);
			attMap.forEach(e => {
				if (e.def > maxDef) {
					maxDef = e.def;
				}
			});
			attMap = attMap.filter(e => e.def === maxDef);
			let defMap = heatMap.filter(e => e.def === highDef);
			defMap.forEach(e => {
				if (e.att > maxAtt) {
					maxAtt = e.att;
				}
			});
			defMap = defMap.filter(e => e.att === maxAtt);
			let opponentScores = 0;
			let AIScore = 0;
			playerScores.forEach((score, index) => {
				if (AIs[index] === this) {
					AIScore = score;
				} else {
					opponentScores += score;
				}
			});
			const modif = (opponentScores / (this.pCount - 1)) < AIScore ? -1 : 1;
			console.log(opponentScores / (this.pCount - 1), AIScore, modif);
			return (highAtt - highDef) > modif ? attMap[Math.floor(Math.random() * attMap.length)] : defMap[Math.floor(Math.random() * defMap.length)];
		}
	}
}
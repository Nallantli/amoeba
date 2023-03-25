import { AI } from "../AI";
import { GameState, getValue } from "../GameState";
import { countLine } from "./utils";

export class AttAndDef extends AI {
	doTurn(gameState: GameState) {
		const { placements } = gameState;
		let heatMap: { x: number; y: number; att: number; def: number; }[] = [];
		let hottest = 0;
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
						att: countLine(gameState, e.x + x, e.y + y, this.icon, 1, 0, getValue) +
							countLine(gameState, e.x + x, e.y + y, this.icon, 1, 1, getValue) +
							countLine(gameState, e.x + x, e.y + y, this.icon, 0, 1, getValue) +
							countLine(gameState, e.x + x, e.y + y, this.icon, -1, 1, getValue),
						def: Math.max(...Array(this.pCount).fill(0).map((_, i) =>
							countLine(gameState, e.x + x, e.y + y, i + 1, 1, 0, getValue) +
							countLine(gameState, e.x + x, e.y + y, i + 1, 1, 1, getValue) +
							countLine(gameState, e.x + x, e.y + y, i + 1, 0, 1, getValue) +
							countLine(gameState, e.x + x, e.y + y, i + 1, -1, 1, getValue)
						).filter((_, i) => i !== this.icon - 1))
					};
					if (o.att + o.def > hottest) {
						hottest = o.att + o.def;
					}
					heatMap.push(o);
				}
			}
		});
		if (heatMap.length === 0) {
			return { x: 0, y: 0 };
		} else {
			let bestMap = heatMap.filter(e => e.att + e.def === hottest);
			return bestMap[Math.floor(Math.random() * bestMap.length)];
		}
	}
}
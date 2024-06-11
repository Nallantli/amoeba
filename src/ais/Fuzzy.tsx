import { AI } from "../AI";
import { GameState, getValue } from "../GameState";
import { countLineOld, getRandomElement } from "./utils";

export class Fuzzy extends AI {
	async doTurn(gameState: GameState) {
		const { placements, map } = gameState;
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
						.map((_, i) =>
							Math.max(
								countLineOld(map, e.x + x, e.y + y, i + 1, 1, 0, getValue, this.winLength),
								countLineOld(map, e.x + x, e.y + y, i + 1, 1, 1, getValue, this.winLength),
								countLineOld(map, e.x + x, e.y + y, i + 1, 0, 1, getValue, this.winLength),
								countLineOld(map, e.x + x, e.y + y, i + 1, -1, 1, getValue, this.winLength),
								countLineOld(map, e.x + x, e.y + y, i + 1, -1, 0, getValue, this.winLength),
								countLineOld(map, e.x + x, e.y + y, i + 1, -1, -1, getValue, this.winLength),
								countLineOld(map, e.x + x, e.y + y, i + 1, 0, -1, getValue, this.winLength),
								countLineOld(map, e.x + x, e.y + y, i + 1, 1, -1, getValue, this.winLength)
							)
						);
					heatMap.push({
						x: e.x + x,
						y: e.y + y,
						att: mappings[this.icon - 1],
						def: Math.max(...mappings.filter((_, i) => i !== this.icon - 1)),
					});
				}
			}
		});
		if (heatMap.length === 0) {
			return { x: 0, y: 0 };
		} else {
			let attMap = [...heatMap].sort((a, b) => (a.att === b.att ? b.def - a.def : b.att - a.att));
			let defMap = [...heatMap].sort((a, b) => (a.def === b.def ? b.att - a.att : b.def - a.def));
			attMap = attMap.filter(({ att, def }) => att === attMap[0].att && def === attMap[0].def);
			defMap = defMap.filter(({ att, def }) => att === defMap[0].att && def === defMap[0].def);
			if (attMap[0].att > this.winLength - 1) {
				return getRandomElement(attMap);
			}
			if (defMap[0].def > this.winLength - 1) {
				return getRandomElement(defMap);
			}
			return attMap[0].att >= defMap[0].def ? getRandomElement(attMap) : getRandomElement(defMap);
		}
	}
}

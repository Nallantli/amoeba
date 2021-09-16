export class Basic {
	constructor(getValue, selectSquare, winLength, icon) {
		this.getValue = getValue;
		this.selectSquare = selectSquare;
		this.icon = icon;
	}
	doTurn(last) {
		let search_radius = 1;
		while (true) {
			let possible = [];
			for (let i = -search_radius; i <= search_radius; i++) {
				for (let j = -search_radius; j <= search_radius; j++) {
					if (this.getValue(i + last.x, j + last.y) === 0)
						possible.push({ x: i + last.x, y: j + last.y });
				}
			}
			if (possible.length > 0) {
				let choice = possible[Math.floor(Math.random() * possible.length)];
				return { x: choice.x, y: choice.y };
			}
			search_radius++;
		}
	}
}

/*export class Fuzzy {
	constructor(getValue, selectSquare, winLength, icon) {
		this.getValue = getValue;
		this.selectSquare = selectSquare;
		this.winLength = winLength;
		this.heatMap = {};
		this.icon = icon;
	}
	doTurn(last) {
		if (last === undefined) {
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (i === 0 && j === 0)
						continue;
					this.heatMap[i + "_" + j] = {
						x: i,
						y: j
					};
				}
			}
			return { x: 0, y: 0 };
		}
		if (this.heatMap[last.x + "_" + last.y] !== undefined)
			delete this.heatMap[last.x + "_" + last.y];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0)
					continue;
				if (this.getValue(i + last.x, j + last.y) === 0) {
					if (this.heatMap[(i + last.x) + "_" + (j + last.y)] === undefined) {
						this.heatMap[(i + last.x) + "_" + (j + last.y)] = {
							x: i + last.x,
							y: j + last.y
						};
					}
				}
			}
		}

		//defense
		Object.values(this.heatMap).forEach(e => {
			let high = 0;

			let a = 0;
			let b = 0;
			let tx = e.x + 1;
			let ty = e.y;
			while (this.getValue(tx, ty) !== this.icon) {
				a++;
				tx++;
			}
			a += (a !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y;
			while (this.getValue(tx, ty) !== this.icon) {
				b++;
				tx--;
			}
			b += (b !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x;
			ty = e.y + 1;
			while (this.getValue(tx, ty) !== this.icon) {
				a++;
				ty++;
			}
			a += (a !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x;
			ty = e.y - 1;
			while (this.getValue(tx, ty) !== this.icon) {
				b++;
				ty--;
			}
			b += (b !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x + 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) !== this.icon) {
				a++;
				tx++;
				ty++;
			}
			a += (a !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) !== this.icon) {
				b++;
				tx--;
				ty--;
			}
			b += (b !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x + 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) !== this.icon) {
				a++;
				tx++;
				ty--;
			}
			a += (a !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) !== this.icon) {
				b++;
				tx--;
				ty++;
			}
			b += (b !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			e.def = high;
		});

		//attack
		Object.values(this.heatMap).forEach(e => {
			let high = 0;

			let a = 0;
			let b = 0;
			let tx = e.x + 1;
			let ty = e.y;
			while (this.getValue(tx, ty) === this.icon) {
				a++;
				tx++;
			}
			a += (a !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y;
			while (this.getValue(tx, ty) === this.icon) {
				b++;
				tx--;
			}
			b += (b !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === this.icon) {
				a++;
				ty++;
			}
			a += (a !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === this.icon) {
				b++;
				ty--;
			}
			b += (b !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x + 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === this.icon) {
				a++;
				tx++;
				ty++;
			}
			a += (a !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === this.icon) {
				b++;
				tx--;
				ty--;
			}
			b += (b !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x + 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === this.icon) {
				a++;
				tx++;
				ty--;
			}
			a += (a !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === this.icon) {
				b++;
				tx--;
				ty++;
			}
			b += (b !== 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			e.att = high;
		});

		let defenseHighs = [];
		let defenseHighest = 0;
		let attackHighs = [];
		let attackHighest = 0;
		Object.values(this.heatMap).forEach(e => {
			if (e.def > defenseHighest) {
				defenseHighs = [e];
				defenseHighest = e.def;
			} else if (e.def === defenseHighest) {
				defenseHighs.push(e);
			}
			if (e.att > attackHighest) {
				attackHighs = [e];
				attackHighest = e.att;
			} else if (e.att === attackHighest) {
				attackHighs.push(e);
			}
		});

		defenseHighs.sort((a, b) => b.att - a.att).filter(e => e.att === defenseHighs[0].att);

		attackHighs.sort((a, b) => b.def - a.def).filter(e => e.def === attackHighs[0].def);

		let select;
		if ((defenseHighest > this.winLength - 2 && attackHighest < this.winLength - 1.5) || (defenseHighest >= this.winLength - 1 && attackHighest < this.winLength - 1))
			select = defenseHighs[Math.floor(Math.random() * defenseHighs.length)];
		else if (attackHighest > this.winLength / 2)
			select = attackHighs[Math.floor(Math.random() * attackHighs.length)];
		else
			select = defenseHighs[Math.floor(Math.random() * defenseHighs.length)];

		delete this.heatMap[select.x + "_" + select.y];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0)
					continue;
				if (this.getValue(i + select.x, j + select.y) === 0) {
					if (this.heatMap[(i + select.x) + "_" + (j + select.y)] === undefined) {
						this.heatMap[(i + select.x) + "_" + (j + select.y)] = {
							x: i + select.x,
							y: j + select.y
						};
					}
				}
			}
		}

		return { x: select.x, y: select.y };
	}
}*/

function countLine(x, y, v, dx, dy, getValue, winLength, map) {
	let l = 0;
	for (let i = -winLength + 1; i < 0; i++) {
		let d = 0;
		let nx = x + i * dx;
		let ny = y + i * dy;
		while (getValue(nx, ny, map) === v || (nx === x && ny === y)) {
			d++;
			nx += dx;
			ny += dy;
		}
		if (d < winLength) {
			for (let j = d; j <= winLength; j++) {
				let nx2 = x + (i + j) * dx;
				let ny2 = y + (i + j) * dy;
				if (getValue(nx2, ny2, map) !== v && getValue(nx2, ny2, map) !== 0) {
					d = 0;
					break;
				}
			}
		}
		if (d > l) {
			l = d;
		}
	}
	return l;
}

export class Fuzzy {
	constructor(getValue, winLength, icon, pCount) {
		this.getValue = getValue;
		this.winLength = winLength;
		this.icon = icon;
		this.pCount = pCount;
	}
	doTurn(placements, map) {
		let highAtt = 0;
		let highDef = Array(this.pCount - 1).fill(0);
		let heatMap = [];
		placements.forEach(e => {
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					if (x === 0 && y === 0) {
						continue;
					}
					if (this.getValue(e.x + x, e.y + y, map) !== 0) {
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
							countLine(e.x + x, e.y + y, this.icon, 1, 0, this.getValue, this.winLength, map),
							countLine(e.x + x, e.y + y, this.icon, 1, 1, this.getValue, this.winLength, map),
							countLine(e.x + x, e.y + y, this.icon, 0, 1, this.getValue, this.winLength, map),
							countLine(e.x + x, e.y + y, this.icon, -1, 1, this.getValue, this.winLength, map),
							countLine(e.x + x, e.y + y, this.icon, -1, 0, this.getValue, this.winLength, map),
							countLine(e.x + x, e.y + y, this.icon, -1, -1, this.getValue, this.winLength, map),
							countLine(e.x + x, e.y + y, this.icon, 0, -1, this.getValue, this.winLength, map),
							countLine(e.x + x, e.y + y, this.icon, 1, -1, this.getValue, this.winLength, map)),
						def: Array(this.pCount).fill(0).map((_, i) => {
							return Math.max(
								countLine(e.x + x, e.y + y, i + 1, 1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, -1, this.getValue, this.winLength, map))
						}).filter((_, i) => i !== this.icon - 1)
					};
					if (o.att > highAtt) {
						highAtt = o.att;
					}
					o.def.forEach((def, i) => {
						if (def > highDef[i]) {
							highDef[i] = def;
						}
					});
					heatMap.push(o);
				}
			}
		});
		if (heatMap.length === 0) {
			return { x: 0, y: 0 };
		} else {
			const attMap = heatMap.filter(e => e.att === highAtt);
			const defMap = heatMap.filter(e => e.def.filter((e2, i) => e2 === highDef[i]).length > 0);
			if (highAtt === this.winLength) {
				return attMap[Math.floor(Math.random() * attMap.length)];
			}
			if (highDef === this.winLength) {
				return defMap[Math.floor(Math.random() * defMap.length)];
			}
			return highAtt >= highDef ? attMap[Math.floor(Math.random() * attMap.length)] : defMap[Math.floor(Math.random() * defMap.length)];
		}
	}
}
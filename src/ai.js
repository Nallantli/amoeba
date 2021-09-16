function countLine(x, y, v, dx, dy, getValue, winLength, map) {
	let l = 0;
	let i = -1;
	while (getValue(x + i * dx, y + i * dy, map) === v) {
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
		i--;
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
		let highDef = 0;
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
						def: Math.max(...Array(this.pCount).fill(0).map((_, i) => {
							return Math.max(
								countLine(e.x + x, e.y + y, i + 1, 1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, -1, this.getValue, this.winLength, map))
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
			const attMap = heatMap.filter(e => e.att === highAtt);
			const defMap = heatMap.filter(e => e.def === highDef);
			console.log({ highAtt, highDef, attMap, defMap });
			if (highAtt >= this.winLength) {
				return attMap[Math.floor(Math.random() * attMap.length)];
			}
			if (highDef >= this.winLength) {
				return defMap[Math.floor(Math.random() * defMap.length)];
			}
			return highAtt >= highDef ? attMap[Math.floor(Math.random() * attMap.length)] : defMap[Math.floor(Math.random() * defMap.length)];
		}
	}
}

export class Elk {
	constructor(getValue, winLength, icon, pCount) {
		this.getValue = getValue;
		this.winLength = winLength;
		this.icon = icon;
		this.pCount = pCount;
	}
	doTurn(placements, map) {
		let highAtt = 0;
		let highDef = 0;
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
						def: Math.max(...Array(this.pCount).fill(0).map((_, i) => {
							return Math.max(
								countLine(e.x + x, e.y + y, i + 1, 1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, -1, this.getValue, this.winLength, map))
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
			const attMap = heatMap.filter(e => e.att === highAtt);
			const defMap = heatMap.filter(e => e.def === highDef);
			console.log({ highAtt, highDef, attMap, defMap });
			return (highAtt - highDef) > 0 ? attMap[Math.floor(Math.random() * attMap.length)] : defMap[Math.floor(Math.random() * defMap.length)];
		}
	}
}

export class ElkAtt {
	constructor(getValue, winLength, icon, pCount) {
		this.getValue = getValue;
		this.winLength = winLength;
		this.icon = icon;
		this.pCount = pCount;
	}
	doTurn(placements, map) {
		let highAtt = 0;
		let highDef = 0;
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
						def: Math.max(...Array(this.pCount).fill(0).map((_, i) => {
							return Math.max(
								countLine(e.x + x, e.y + y, i + 1, 1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, -1, this.getValue, this.winLength, map))
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
			const attMap = heatMap.filter(e => e.att === highAtt);
			const defMap = heatMap.filter(e => e.def === highDef);
			console.log({ highAtt, highDef, attMap, defMap });
			return (highAtt - highDef) > -1 ? attMap[Math.floor(Math.random() * attMap.length)] : defMap[Math.floor(Math.random() * defMap.length)];
		}
	}
}
export class ElkDef {
	constructor(getValue, winLength, icon, pCount) {
		this.getValue = getValue;
		this.winLength = winLength;
		this.icon = icon;
		this.pCount = pCount;
	}
	doTurn(placements, map) {
		let highAtt = 0;
		let highDef = 0;
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
						def: Math.max(...Array(this.pCount).fill(0).map((_, i) => {
							return Math.max(
								countLine(e.x + x, e.y + y, i + 1, 1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, 0, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, -1, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 0, -1, this.getValue, this.winLength, map),
								countLine(e.x + x, e.y + y, i + 1, 1, -1, this.getValue, this.winLength, map))
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
			const attMap = heatMap.filter(e => e.att === highAtt);
			const defMap = heatMap.filter(e => e.def === highDef);
			console.log({ highAtt, highDef, attMap, defMap });
			return (highAtt - highDef) > 1 ? attMap[Math.floor(Math.random() * attMap.length)] : defMap[Math.floor(Math.random() * defMap.length)];
		}
	}
}
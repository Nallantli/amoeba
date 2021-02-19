export class Basic {
	constructor(getValue, selectSquare, winLength, isCross) {
		this.getValue = getValue;
		this.selectSquare = selectSquare;
	}
	doTurn(last) {
		let search_radius = 1;
		while (true) {
			let possible = [];
			for (let i = -search_radius; i <= search_radius; i++) {
				for (let j = -search_radius; j <= search_radius; j++) {
					if (this.getValue(i + last.x, j + last.y) == 0)
						possible.push({ x: i + last.x, y: j + last.y });
				}
			}
			if (possible.length > 0) {
				let choice = possible[Math.floor(Math.random() * possible.length)];
				this.selectSquare(choice.x, choice.y);
				return;
			}
			search_radius++;
		}
	}
}

export class Fuzzy {
	constructor(getValue, selectSquare, winLength, isCross) {
		this.getValue = getValue;
		this.selectSquare = selectSquare;
		this.winLength = winLength;
		this.heatMap = {};
		this.debugHistory = [];
		this.player = isCross ? 1 : 2;
		this.enemy = isCross ? 2 : 1;
	}
	doTurn(last) {
		if (last === undefined) {
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (i == 0 && j == 0)
						continue;
					this.heatMap[i + "_" + j] = {
						x: i,
						y: j
					};
				}
			}
			this.selectSquare(0, 0);
			return;
		}
		if (this.heatMap[last.x + "_" + last.y] !== undefined)
			delete this.heatMap[last.x + "_" + last.y];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i == 0 && j == 0)
					continue;
				if (this.getValue(i + last.x, j + last.y) == 0) {
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
			while (this.getValue(tx, ty) === this.player) {
				a++;
				tx++;
			}
			a += (a != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y;
			while (this.getValue(tx, ty) === this.player) {
				b++;
				tx--;
			}
			b += (b != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === this.player) {
				a++;
				ty++;
			}
			a += (a != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === this.player) {
				b++;
				ty--;
			}
			b += (b != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x + 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === this.player) {
				a++;
				tx++;
				ty++;
			}
			a += (a != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === this.player) {
				b++;
				tx--;
				ty--;
			}
			b += (b != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x + 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === this.player) {
				a++;
				tx++;
				ty--;
			}
			a += (a != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === this.player) {
				b++;
				tx--;
				ty++;
			}
			b += (b != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
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
			while (this.getValue(tx, ty) === this.enemy) {
				a++;
				tx++;
			}
			a += (a != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y;
			while (this.getValue(tx, ty) === this.enemy) {
				b++;
				tx--;
			}
			b += (b != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === this.enemy) {
				a++;
				ty++;
			}
			a += (a != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === this.enemy) {
				b++;
				ty--;
			}
			b += (b != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x + 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === this.enemy) {
				a++;
				tx++;
				ty++;
			}
			a += (a != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === this.enemy) {
				b++;
				tx--;
				ty--;
			}
			b += (b != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			if (a + b > high)
				high = a + b;

			a = 0;
			b = 0;
			tx = e.x + 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === this.enemy) {
				a++;
				tx++;
				ty--;
			}
			a += (a != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
			tx = e.x - 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === this.enemy) {
				b++;
				tx--;
				ty++;
			}
			b += (b != 0 && this.getValue(tx, ty) === 0) ? 0.25 : 0;
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
			} else if (e.def == defenseHighest) {
				defenseHighs.push(e);
			}
			if (e.att > attackHighest) {
				attackHighs = [e];
				attackHighest = e.att;
			} else if (e.att == attackHighest) {
				attackHighs.push(e);
			}
		});

		defenseHighs.sort((a, b) => b.att - a.att).filter(e => e.att == defenseHighs[0].att);

		attackHighs.sort((a, b) => b.def - a.def).filter(e => e.def == attackHighs[0].def);

		let select;
		if ((defenseHighest > this.winLength - 2 && attackHighest < this.winLength - 1.5) || (defenseHighest >= this.winLength - 1 && attackHighest < this.winLength - 1))
			select = defenseHighs[Math.floor(Math.random() * defenseHighs.length)];
		else if (attackHighest > this.winLength / 2)
			select = attackHighs[Math.floor(Math.random() * attackHighs.length)];
		else
			select = defenseHighs[Math.floor(Math.random() * defenseHighs.length)];

		this.debugHistory.push({
			player: {
				x: last.x,
				y: last.y
			},
			enemy: {
				x: select.x,
				y: select.y
			},
			data: JSON.parse(JSON.stringify(this.heatMap))
		});

		delete this.heatMap[select.x + "_" + select.y];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i == 0 && j == 0)
					continue;
				if (this.getValue(i + select.x, j + select.y) == 0) {
					if (this.heatMap[(i + select.x) + "_" + (j + select.y)] === undefined) {
						this.heatMap[(i + select.x) + "_" + (j + select.y)] = {
							x: i + select.x,
							y: j + select.y
						};
					}
				}
			}
		}

		this.selectSquare(select.x, select.y);
	}
}
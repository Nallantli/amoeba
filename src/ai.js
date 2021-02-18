export class Basic {
	constructor(getValue, selectSquare) {
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
	constructor(getValue, selectSquare) {
		this.getValue = getValue;
		this.selectSquare = selectSquare;
		this.heatMap = {};
	}
	doTurn(last) {
		if (this.heatMap[last.x + "_" + last.y] !== undefined)
			delete this.heatMap[last.x + "_" + last.y];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i == 0 && j == 0)
					continue;
				if (this.getValue(i + last.x, j + last.y) == 0 && this.heatMap[(i + last.x) + "_" + (j + last.y)] === undefined) {
					this.heatMap[(i + last.x) + "_" + (j + last.y)] = {
						x: i + last.x,
						y: j + last.y
					};
				}
			}
		}
		Object.values(this.heatMap).forEach(e => {
			let high = 0;

			let curr = 0;
			let tx = e.x + 1;
			let ty = e.y;
			while (this.getValue(tx, ty) === 1) {
				curr++;
				tx++;
			}
			if (curr > high)
				high = curr;

			curr = 0;
			tx = e.x - 1;
			ty = e.y;
			while (this.getValue(tx, ty) === 1) {
				curr++;
				tx--;
			}
			if (curr > high)
				high = curr;

			curr = 0;
			tx = e.x;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === 1) {
				curr++;
				ty++;
			}
			if (curr > high)
				high = curr;

			curr = 0;
			tx = e.x;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === 1) {
				curr++;
				ty--;
			}
			if (curr > high)
				high = curr;

			curr = 0;
			tx = e.x + 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === 1) {
				curr++;
				tx++;
				ty++;
			}
			if (curr > high)
				high = curr;

			curr = 0;
			tx = e.x - 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === 1) {
				curr++;
				tx--;
				ty--;
			}
			if (curr > high)
				high = curr;

			curr = 0;
			tx = e.x + 1;
			ty = e.y - 1;
			while (this.getValue(tx, ty) === 1) {
				curr++;
				tx++;
				ty--;
			}
			if (curr > high)
				high = curr;

			curr = 0;
			tx = e.x - 1;
			ty = e.y + 1;
			while (this.getValue(tx, ty) === 1) {
				curr++;
				tx--;
				ty++;
			}
			if (curr > high)
				high = curr;

			e.val = high;
		});
		console.log(this.heatMap);
		let highs = [];
		let highest = 0;
		Object.values(this.heatMap).forEach(e => {
			if (e.val > highest) {
				highs = [e];
				highest = e.val;
			} else if (e.val == highest) {
				highs.push(e);
			}
		});
		let select = highs[Math.floor(Math.random() * highs.length)];
		delete this.heatMap[select.x + "_" + select.y];
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i == 0 && j == 0)
					continue;
				if (this.getValue(i + select.x, j + select.y) == 0 && this.heatMap[(i + select.x) + "_" + (j + select.y)] === undefined) {
					this.heatMap[(i + select.x) + "_" + (j + select.y)] = {
						x: i + select.x,
						y: j + select.y
					};
				}
			}
		}
		console.log(select);
		this.selectSquare(select.x, select.y);
	}
}
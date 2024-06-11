import { GameMap } from "../GameState";

export function countLine(
	map: GameMap,
	x: number,
	y: number,
	v: number,
	dx: number,
	dy: number,
	getValue: (map: GameMap, x: number, y: number) => number,
	winLength: number
): number {
	let i = 1;
	let contiguous = 0;
	let space = 0;
	while (getValue(map, x + i * dx, y + i * dy) === v) {
		contiguous++;
		i++;
	}
	while (getValue(map, x + i * dx, y + i * dy) === 0 && i < winLength) {
		space++;
		i++;
	}
	i = -1;
	while (getValue(map, x + i * dx, y + i * dy) === v) {
		contiguous++;
		i--;
	}
	while (getValue(map, x + i * dx, y + i * dy) === v && -i < winLength) {
		space++;
		i--;
	}
	if (space + contiguous + 1 < winLength) {
		return 0;
	}
	return contiguous;
}

// I don't remember how this works
export function countLineOld(
	map: GameMap,
	x: number,
	y: number,
	v: number,
	dx: number,
	dy: number,
	getValue: (map: GameMap, x: number, y: number) => number,
	winLength: number
): number {
	let l = 0;
	let i = -1;
	while (getValue(map, x + i * dx, y + i * dy) === v) {
		let d = 0;
		let nx = x + i * dx;
		let ny = y + i * dy;
		while (getValue(map, nx, ny) === v || (nx === x && ny === y)) {
			d++;
			nx += dx;
			ny += dy;
		}
		if (d < winLength) {
			for (let j = d; j <= winLength; j++) {
				let nx2 = x + (i + j) * dx;
				let ny2 = y + (i + j) * dy;
				if (getValue(map, nx2, ny2) !== v && getValue(map, nx2, ny2) !== 0) {
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

export function getRandomElement(array: any[]) {
	return array[Math.floor(Math.random() * array.length)];
}

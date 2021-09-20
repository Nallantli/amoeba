export class AI {
	getValue: (x: number, y: number) => number;
	winLength: number;
	icon: number;
	pCount: number;
	constructor(
		getValue: (x: number, y: number) => number,
		winLength: number,
		icon: number,
		pCount: number
	) {
		this.getValue = getValue;
		this.winLength = winLength;
		this.icon = icon;
		this.pCount = pCount;
	}
	doTurn(_: { x: number, y: number, v: number }[]): { x: number, y: number } {
		throw new Error("Method not implemented.");
	}
}
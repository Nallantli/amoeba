import SVGCross from './img/cross.svg';
import SVGCircle from './img/circle.svg';
import SVGDiamond from './img/diamond.svg';
import SVGSquare from './img/square.svg';

export function flatten(x, d) {
	while (x < 0)
		x += d;
	return x % d;
}

export const CONFIG = {
	SIZE: 10,
	S_SIZE: 40,
	player_colors: [
		'#5588ff',
		'#ff3344',
		'#ffcc33',
		"#33ff44"
	],
	player_icons: [
		SVGCircle,
		SVGCross,
		SVGDiamond,
		SVGSquare
	]
};
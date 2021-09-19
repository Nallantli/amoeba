import { CircleIcon } from "./assets/CircleIcon";
import { CrossIcon } from "./assets/CrossIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { SquareIcon } from "./assets/SquareIcon";

export function flatten(x, d) {
	while (x < 0)
		x += d;
	return x % d;
}

export const CONFIG = {
	player_colors: [
		'#5588ff',
		'#ff3344',
		"#33ff44",
		'#ffcc33'
	],
	player_icons: [
		CircleIcon,
		CrossIcon,
		DiamondIcon,
		SquareIcon
	]
};
import React from "react";
import { IconConfig } from "./IconConfig";

interface SpaceProps {
	x: number;
	y: number;
	id: string;
	value: number;
	win: boolean;
	canPlayerMove: boolean;
	onClick: (e: any) => void;
	view: { spaceSize: number };
	iconConfig: IconConfig;
}

export function Space({ x, y, id, value, win, canPlayerMove, onClick, view, iconConfig }: SpaceProps) {
	const { spaceSize } = view;
	return (
		<button
			id={id}
			onClick={value === 0 && !win && canPlayerMove ? onClick : () => {}}
			className="space"
			style={{
				position: "absolute",
				width: `${spaceSize}px`,
				height: `${spaceSize}px`,
				left: `${x * spaceSize}px`,
				top: `${y * spaceSize}px`,
			}}
		>
			<span
				style={{
					position: "absolute",
					left: `0`,
					top: `0`,
					color: "#888",
					fontSize: "10px",
				}}
			>
				{id}
			</span>
			{value > 0 && React.createElement(iconConfig.playerIcons[value - 1], { color: iconConfig.playerColors[value - 1] })}
		</button>
	);
}

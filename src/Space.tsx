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
	isLastPlacement: boolean;
}

export function Space({ x, y, id, value, win, canPlayerMove, onClick, view, iconConfig, isLastPlacement }: SpaceProps) {
	const { spaceSize } = view;
	return (
		<button
			id={id}
			onClick={value === 0 && !win && canPlayerMove ? onClick : () => {}}
			className={isLastPlacement ? "last-space" : "space"}
			style={{
				position: "absolute",
				width: `${spaceSize}px`,
				height: `${spaceSize}px`,
				left: `${x * spaceSize}px`,
				top: `${y * spaceSize}px`,
			}}
		>
			{value > 0 && React.createElement(iconConfig.playerIcons[value - 1], { color: iconConfig.playerColors[value - 1] })}
		</button>
	);
}

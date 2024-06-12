import React from "react";
import { IconConfig } from "./IconConfig";

interface SpaceProps {
	relX: number;
	relY: number;
	id: string;
	value: number;
	winner?: number;
	canPlayerMove: boolean;
	onClick: (e: any) => void;
	view: { spaceSize: number };
	iconConfig: IconConfig;
	isLastPlacement: boolean;
	isWinSquare: boolean;
	boxShadow?: string;
}

export function Space({
	relX,
	relY,
	id,
	value,
	winner,
	canPlayerMove,
	onClick,
	view: { spaceSize },
	iconConfig,
	isLastPlacement,
	isWinSquare,
	boxShadow,
}: SpaceProps) {
	return (
		<button
			id={id}
			onClick={value === 0 && winner === undefined && canPlayerMove ? onClick : () => {}}
			className={isWinSquare ? "win-square" : isLastPlacement ? "last-space" : "space"}
			style={{
				boxShadow: boxShadow,
				position: "absolute",
				width: `${spaceSize}px`,
				height: `${spaceSize}px`,
				left: `${relX * spaceSize}px`,
				top: `${relY * spaceSize}px`,
				zIndex: boxShadow ? 2 : 1,
			}}
		>
			{value > 0 && React.createElement(iconConfig.playerIcons[value - 1], { color: iconConfig.playerColors[value - 1] })}
		</button>
	);
}

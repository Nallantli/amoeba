import React from "react";
import { ConfigType } from "./Board";

type SpaceProps = {
	x: number;
	y: number;
	id: string;
	value: number;
	win: boolean;
	canPlayerMove: boolean;
	onClick: (e: any) => void;
	view: { spaceSize: number };
	config: ConfigType;
};

export const Space = (props: SpaceProps) => {
	const { x, y, id, value, win, canPlayerMove, onClick, view, config } = props;
	const { spaceSize } = view;
	return (<button
		id={id}
		onClick={value === 0 && !win && canPlayerMove ? onClick : () => { }}
		className="space"
		style={{
			width: `${spaceSize}px`,
			height: `${spaceSize}px`,
			position: "absolute",
			left: `${x * spaceSize}px`,
			top: `${y * spaceSize}px`
		}}
	>
		{value > 0 && React.createElement(config.playerIcons[value - 1], { color: config.playerColors[value - 1] })}
	</button>);
}
import React from "react";
import { CONFIG } from "./Utils";

export class Space extends React.Component {
	render() {
		const { x, y, id, value, win, canPlayerMove, onClick, view } = this.props;
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
			{value > 0 && React.createElement(CONFIG.player_icons[value - 1], { color: CONFIG.player_colors[value - 1] })}
		</button>);
	}
}
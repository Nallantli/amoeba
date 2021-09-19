import React from "react";
import { CONFIG } from "./Utils";

export const spaceSize = 40;

export class Space extends React.Component {
	render() {
		return (<button
			id={this.props.id}
			onClick={this.props.value === 0 && !this.props.win ? this.props.onClick : () => { }}
			className="space"
			style={{
				width: `${spaceSize}px`,
				height: `${spaceSize}px`,
				position: "absolute",
				left: `${this.props.x * spaceSize}px`,
				top: `${this.props.y * spaceSize}px`
			}}
		>
			{this.props.value > 0 && <img className="player-icon" src={CONFIG.player_icons[this.props.value - 1]} />}
		</button>);
	}
}
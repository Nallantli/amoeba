import React from "react";

export class CrossIcon extends React.Component {
	render() {
		return (
			<svg className="player-icon" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
				<polygon fill={this.props.color} points="1000 858.58 641.42 500 1000 141.42 858.58 0 500 358.58 141.42 0 0 141.42 358.58 500 0 858.58 141.42 1000 500 641.42 858.58 1000 1000 858.58" />
			</svg>
		);
	}
}
import React from "react";

export class CircleIcon extends React.Component {
	render() {
		return (
			<svg className="player-icon" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
				<path fill={this.props.color} d="M500,0C223.86,0,0,223.86,0,500s223.86,500,500,500,500-223.86,500-500S776.14,0,500,0Zm0,800c-165.69,0-300-134.31-300-300S334.31,200,500,200,800,334.31,800,500,665.69,800,500,800Z" />
			</svg>
		);
	}
}
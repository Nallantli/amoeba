import React from "react";
import PropTypes from 'prop-types';
import { flatten, CONFIG } from "./Utils";

export class Square extends React.Component {
	render() {
		const { x, y, value, map, setValue, postMove, win, turn } = this.props;
		return (
			<div
				className="square"
				id={x + "_" + y}
				style={{
					top: flatten(y, CONFIG.SIZE) * CONFIG.S_SIZE,
					left: flatten(x, CONFIG.SIZE) * CONFIG.S_SIZE,
					width: CONFIG.S_SIZE,
					height: CONFIG.S_SIZE,
					fontSize: CONFIG.S_SIZE * 0.78
				}}
				onClick={
					() => {
						if (value === 0 && !win) {
							setValue(x, y, turn + 1, map);
							postMove({ x: x, y: y }, map);
						}
					}
				}
			>
				<div className="icon"><img className="svg" src={CONFIG.player_icons[value - 1]} />
				</div>
			</div>
		)
	}
}

Square.propTypes = {
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
	map: PropTypes.object.isRequired,
	setValue: PropTypes.func.isRequired,
	postMove: PropTypes.func.isRequired,
	win: PropTypes.bool.isRequired,
	turn: PropTypes.number.isRequired
}
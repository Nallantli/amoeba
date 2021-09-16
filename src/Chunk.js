import React from "react";
import PropTypes from 'prop-types';
import { CONFIG } from "./Utils";
import { Square } from "./Square";

export class Chunk extends React.Component {
	render() {
		const { getValue, setValue, postMove, map, turn, win } = this.props;
		let squares = [];
		for (let i = 0; i < CONFIG.SIZE; i++) {
			for (let j = 0; j < CONFIG.SIZE; j++) {
				const value = getValue(i + this.props.x * CONFIG.SIZE, j + this.props.y * CONFIG.SIZE, map);
				const x = i + this.props.x * CONFIG.SIZE;
				const y = j + this.props.y * CONFIG.SIZE;
				squares[i * CONFIG.SIZE + j] = (
					<Square
						map={map}
						x={x}
						y={y}
						value={value}
						setValue={setValue}
						postMove={postMove}
						win={win}
						turn={turn}
					/>
				);
			}
		}
		return (
			<div style={{
				position: 'absolute',
				top: this.props.ry * CONFIG.SIZE * CONFIG.S_SIZE,
				left: this.props.rx * CONFIG.SIZE * CONFIG.S_SIZE,
				width: CONFIG.SIZE * CONFIG.S_SIZE,
				height: CONFIG.SIZE * CONFIG.S_SIZE
			}}>
				{squares}
			</div>
		);
	}
}

Chunk.propTypes = {
	getValue: PropTypes.func.isRequired,
	setValue: PropTypes.func.isRequired,
	postMove: PropTypes.func.isRequired,
	map: PropTypes.object.isRequired,
	turn: PropTypes.number.isRequired,
	win: PropTypes.bool.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	rx: PropTypes.number.isRequired,
	ry: PropTypes.number.isRequired
}
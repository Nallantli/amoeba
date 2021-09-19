import React from "react";
import { Space, spaceSize } from "./Space";

export const chunkSize = 3;

export class Chunk extends React.Component {
	constructor(props) {
		super(props);
	}
	processClick(x, y) {
		const { chunkX, chunkY, selectSquare } = this.props;
		selectSquare({ detail: { x: chunkX * chunkSize + x, y: chunkY * chunkSize + y } });
	}
	render() {
		const { chunkData, posX, posY, chunkX, chunkY } = this.props;
		return (
			<div
				className="chunk"
				style={{
					width: `${chunkSize * spaceSize}px`,
					height: `${chunkSize * spaceSize}px`,
					display: "block",
					position: "absolute",
					left: `${posX * chunkSize * spaceSize}px`,
					top: `${posY * chunkSize * spaceSize}px`,
				}}
			>
				{chunkData.map((col, x) => {
					return col.map((cell, y) =>
						<Space
							id={`${x + chunkX * chunkSize}_${y + chunkY * chunkSize}`}
							value={cell}
							x={x}
							y={y}
							onClick={() => this.processClick(x, y)}
							win={this.props.win}
						/>
					);
				})}
			</div>
		)
	}
}
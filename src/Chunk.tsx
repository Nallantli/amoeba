import { ConfigType } from "./Board";
import { Space } from "./Space";

export const chunkSize = 3;

export const Chunk = (props: {
	chunkX: number;
	chunkY: number;
	selectSquare: (e: any) => void;
	chunkData: number[][];
	posX: number;
	posY: number;
	win: boolean;
	canPlayerMove: boolean;
	view: { spaceSize: number; };
	config: ConfigType;
}) => {
	const { chunkData, posX, posY, chunkX, chunkY, win, canPlayerMove, view, selectSquare, config } = props;
	const { spaceSize } = view;
	return (
		<div
			className="chunk"
			style={{
				width: `${chunkSize * spaceSize}px`,
				height: `${chunkSize * spaceSize}px`,
				display: 'block',
				position: 'absolute',
				left: `${posX * chunkSize * spaceSize}px`,
				top: `${posY * chunkSize * spaceSize}px`,
			}}
		>
			{chunkData.map((col, x) => {
				return col.map((cell, y) =>
					<Space
						key={`${x + chunkX * chunkSize}_${y + chunkY * chunkSize}`}
						id={`${x + chunkX * chunkSize}_${y + chunkY * chunkSize}`}
						value={cell}
						x={x}
						y={y}
						onClick={() => selectSquare({ detail: { x: chunkX * chunkSize + x, y: chunkY * chunkSize + y } })}
						win={win}
						canPlayerMove={canPlayerMove}
						view={view}
						config={config}
					/>
				);
			})}
		</div>
	)
}
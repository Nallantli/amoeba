import { IconConfig } from "./IconConfig";
import { Space } from "./Space";

export const chunkSize = 3;

interface ChunkProps {
	chunkX: number;
	chunkY: number;
	selectSquare: (e: any) => void;
	chunkData: number[][];
	posX: number;
	posY: number;
	win: boolean;
	canPlayerMove: boolean;
	view: { spaceSize: number };
	iconConfig: IconConfig;
}

export function Chunk({ chunkData, posX, posY, chunkX, chunkY, win, canPlayerMove, view, view: { spaceSize }, selectSquare, iconConfig }: ChunkProps) {
	return (
		<div
			className="chunk"
			style={{
				position: "absolute",
				width: `${chunkSize * spaceSize}px`,
				height: `${chunkSize * spaceSize}px`,
				left: `${posX * chunkSize * spaceSize}px`,
				top: `${posY * chunkSize * spaceSize}px`,
			}}
		>
			{chunkData.map((col, x) => {
				return col.map((cell, y) => (
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
						iconConfig={iconConfig}
					/>
				));
			})}
		</div>
	);
}

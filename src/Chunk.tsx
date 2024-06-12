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
	placements: { x: number; y: number; v: number }[];
	winSquares: string[];
}
export function Chunk({
	chunkData,
	posX,
	posY,
	chunkX,
	chunkY,
	win,
	canPlayerMove,
	view,
	view: { spaceSize },
	selectSquare,
	iconConfig,
	placements,
	winSquares,
}: ChunkProps) {
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
				return col.map((cell, y) => {
					const spaceX = x + chunkX * chunkSize;
					const spaceY = y + chunkY * chunkSize;
					const lastPlacement = placements.length > 0 && placements[placements.length - 1];
					const id = `${spaceX}_${spaceY}`;
					return (
						<Space
							key={id}
							id={id}
							value={cell}
							x={x}
							y={y}
							onClick={() => selectSquare({ detail: { x: chunkX * chunkSize + x, y: chunkY * chunkSize + y } })}
							win={win}
							canPlayerMove={canPlayerMove}
							view={view}
							iconConfig={iconConfig}
							isLastPlacement={lastPlacement ? lastPlacement.x === spaceX && lastPlacement.y === spaceY : false}
							isWinSquare={winSquares.includes(id)}
						/>
					);
				});
			})}
		</div>
	);
}

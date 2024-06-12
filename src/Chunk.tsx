import { GameMap } from "./GameState";
import { IconConfig } from "./IconConfig";
import { Space } from "./Space";
import { getWinBorder } from "./utils";

export const chunkSize = 3;

interface ChunkProps {
	map: GameMap;
	chunkX: number;
	chunkY: number;
	selectSquare: (e: any) => void;
	chunkData: number[][];
	posX: number;
	posY: number;
	canPlayerMove: boolean;
	view: { spaceSize: number };
	iconConfig: IconConfig;
	placements: { x: number; y: number; v: number }[];
	winSquares: string[];
	winner?: number;
}
export function Chunk({
	map,
	chunkData,
	posX,
	posY,
	chunkX,
	chunkY,
	canPlayerMove,
	view,
	view: { spaceSize },
	selectSquare,
	iconConfig,
	placements,
	winSquares,
	winner,
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
					const boxShadow =
						winner !== undefined && placements.find(({ x, y }) => spaceX === x && spaceY === y) !== undefined
							? getWinBorder(map, spaceX, spaceY, winner, iconConfig)
							: undefined;
					return (
						<Space
							key={id}
							id={id}
							value={cell}
							relX={x}
							relY={y}
							onClick={() => selectSquare({ detail: { x: chunkX * chunkSize + x, y: chunkY * chunkSize + y } })}
							winner={winner}
							canPlayerMove={canPlayerMove}
							view={view}
							iconConfig={iconConfig}
							isLastPlacement={lastPlacement ? lastPlacement.x === spaceX && lastPlacement.y === spaceY : false}
							isWinSquare={winSquares.includes(id)}
							boxShadow={boxShadow}
						/>
					);
				});
			})}
		</div>
	);
}

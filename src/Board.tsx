import React from 'react';
import { Chunk, chunkSize } from './Chunk';
import { calculateLimitScore, checkWin, GameState, getValue, selectSquare } from './GameState';
import { flatten } from './utils';

export type ConfigType = {
	playerIcons: any[];
	playerColors: string[];
	turnDelay: number;
};

const Limit = (props: { moveLimit: number }) => {
	return (<div id="limit-dialog">Turns Left: {props.moveLimit}</div>);
}

const ScoreScreen = (props: { playerScores: number[], config: ConfigType }) => {
	return (
		<div id="score-dialog">
			<table>
				<tbody>
					{props.playerScores.map((score, i) => <tr key={i}><td style={{ width: "40px" }}>{React.createElement(props.config.playerIcons[i], { color: props.config.playerColors[i] })}</td><td>{score}</td></tr>)}
				</tbody>
			</table>
		</div>
	);
}

type BoardProps = {
	gameState: GameState;
	config: ConfigType;
	broadcast: (gameState: GameState, callback: (gameState: GameState) => void) => void;
	doLocalTurn: (gameState: GameState, boardRef: any, turnDelay: number) => void;
	canMove: (gameState: GameState) => boolean;
};

type BoardState = {
	view: {
		offsetX: number;
		offsetY: number;
		spaceSize: number;
	};
	xLow: number;
	xHigh: number;
	yLow: number;
	yHigh: number;
	isTouching: boolean;
	touchStart: { x: number, y: number };
	touchOffset: { x: number, y: number };
	shiftScroll: boolean;
	ctrlScroll: boolean;
};

export class Board extends React.Component<BoardProps, BoardState> {
	boardRef: React.RefObject<HTMLDivElement>;
	constructor(props: BoardProps) {
		super(props);

		this.selectSquare = this.selectSquare.bind(this);
		this.postMove = this.postMove.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.handleZoom = this.handleZoom.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);

		this.boardRef = React.createRef();

		this.state = {
			view: {
				offsetX: 0,
				offsetY: 0,
				spaceSize: 50
			},
			xLow: 0,
			xHigh: 0,
			yLow: 0,
			yHigh: 0,
			isTouching: false,
			touchStart: { x: 0, y: 0 },
			touchOffset: { x: 0, y: 0 },
			shiftScroll: false,
			ctrlScroll: false
		}
	}
	handleZoom(v: number) {
		const { offsetX, offsetY, spaceSize } = this.state.view;
		const newSpaceSize = Math.max(15, Math.min(160, spaceSize * v));
		this.setState({
			view: {
				offsetX: offsetX * (newSpaceSize / spaceSize),
				offsetY: offsetY * (newSpaceSize / spaceSize),
				spaceSize: newSpaceSize
			}
		});
	}
	handleScroll(e: any) {
		e.preventDefault();
		const { shiftScroll, ctrlScroll } = this.state;
		const { offsetX, offsetY, spaceSize } = this.state.view;
		if (ctrlScroll) {
			this.handleZoom(Math.exp(e.deltaY / 200));
		} else {
			const deltaX = e.deltaX * 0.25;
			const deltaY = e.deltaY * 0.25;
			this.setState({
				view: {
					offsetX: offsetX - (shiftScroll ? deltaY : deltaX),
					offsetY: offsetY - (shiftScroll ? deltaX : deltaY),
					spaceSize: spaceSize
				}
			});
		}
	}
	handleTouchMove(e: any) {
		e.preventDefault();
		const evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		const touch = evt.touches[0] || evt.changedTouches[0];
		this.setState({
			touchOffset: { x: touch.pageX, y: touch.pageY }
		});
	}
	handleTouchStart(e: any) {
		e.preventDefault();
		const evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		const touch = evt.touches[0] || evt.changedTouches[0];
		this.setState({
			isTouching: true,
			touchStart: { x: touch.pageX, y: touch.pageY },
			touchOffset: { x: touch.pageX, y: touch.pageY }
		});
	}
	handleTouchEnd(e: any) {
		e.preventDefault();
		const evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		const touch = evt.touches[0] || evt.changedTouches[0];
		const { view, touchStart, touchOffset } = this.state;
		const { offsetX, offsetY, spaceSize } = view;
		this.setState({
			isTouching: false,
			view: {
				offsetX: offsetX + (touchOffset.x - touchStart.x),
				offsetY: offsetY + (touchOffset.y - touchStart.y),
				spaceSize: spaceSize
			}
		}, () => {
			if (Math.pow(touchStart.x - touch.pageX, 2) + Math.pow(touchStart.y - touch.pageY, 2) < 10) {
				if (touch.target.click !== undefined) {
					touch.target.click();
				}
			}
		});
	}
	handleKeyDown(e: any) {
		switch (e.key) {
			case 'Shift':
				this.setState({
					shiftScroll: true
				});
				break;
			case 'Control':
				this.setState({
					ctrlScroll: true
				});
				break;
		}
	}
	handleKeyUp(e: any) {
		switch (e.key) {
			case 'Shift':
				this.setState({
					shiftScroll: false
				});
				break;
			case 'Control':
				this.setState({
					ctrlScroll: false
				});
				break;
		}
	}
	componentDidMount() {
		window.addEventListener('wheel', this.handleScroll, { passive: false });
		window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
		window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
		window.addEventListener('touchend', this.handleTouchEnd, { passive: false });
		window.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
		window.addEventListener('keydown', this.handleKeyDown, { passive: false });
		window.addEventListener('keyup', this.handleKeyUp, { passive: false });
		this.boardRef.current?.addEventListener('selectSquare', this.selectSquare);
		this.props.doLocalTurn(this.props.gameState, this.boardRef, this.props.config.turnDelay);
	}
	postMove(gameState: GameState) {
		const { config } = this.props;
		const { isLimited, playerCount, placements, turn } = gameState;
		if (checkWin(gameState)) {
			const winner =
				flatten(
					(isLimited ?
						calculateLimitScore(gameState).map((e, i) => ({ e, i })).sort((a, b) => b.e - a.e)[0].i
						: turn - 1),
					playerCount
				);
			placements.forEach(placement => {
				let element = document.getElementById(placement.x + "_" + placement.y) as HTMLElement;
				element.classList.add("amoeba-square");
				let shadow = [];
				if (window.getComputedStyle(element).boxShadow !== "none") {
					shadow.push(window.getComputedStyle(element).boxShadow);
				}
				if (getValue(gameState, placement.x, placement.y + 1) === 0) {
					shadow.push(`${config.playerColors[winner]} 0rem 5rem`);
				}
				if (getValue(gameState, placement.x + 1, placement.y) === 0
					&& getValue(gameState, placement.x, placement.y + 1) === 0
					&& getValue(gameState, placement.x + 1, placement.y + 1) === 0) {
					shadow.push(`${config.playerColors[winner]} 5rem 5rem`);
				}
				if (getValue(gameState, placement.x + 1, placement.y) === 0) {
					shadow.push(`${config.playerColors[winner]} 5rem 0rem`);
				}
				if (getValue(gameState, placement.x + 1, placement.y) === 0
					&& getValue(gameState, placement.x, placement.y - 1) === 0
					&& getValue(gameState, placement.x + 1, placement.y - 1) === 0) {
					shadow.push(`${config.playerColors[winner]} 5rem -5rem`);
				}
				if (getValue(gameState, placement.x, placement.y - 1) === 0) {
					shadow.push(`${config.playerColors[winner]} 0rem -5rem`);
				}
				if (getValue(gameState, placement.x - 1, placement.y) === 0
					&& getValue(gameState, placement.x, placement.y + 1) === 0
					&& getValue(gameState, placement.x - 1, placement.y + 1) === 0) {
					shadow.push(`${config.playerColors[winner]} -5rem 5rem`);
				}
				if (getValue(gameState, placement.x - 1, placement.y) === 0) {
					shadow.push(`${config.playerColors[winner]} -5rem 0rem`);
				}
				if (getValue(gameState, placement.x - 1, placement.y) === 0
					&& getValue(gameState, placement.x, placement.y - 1) === 0
					&& getValue(gameState, placement.x - 1, placement.y - 1) === 0) {
					shadow.push(`${config.playerColors[winner]} -5rem -5rem`);
				}
				element.style.boxShadow = shadow.join(", ");
			});
		} else {
			this.props.doLocalTurn(gameState, this.boardRef, config.turnDelay);
		}
	}
	selectSquare(e: any) {
		const { broadcast, gameState } = this.props;
		const { x, y } = e.detail;
		document.getElementById(x + "_" + y)?.classList.add("space-pressed");
		broadcast(selectSquare(gameState, x, y), this.postMove);
	}
	render() {
		const { config, canMove, gameState,
			gameState: { moveLimit, turn, map, isLimited, playerCount } } = this.props;
		const { view,
			view: { offsetX, offsetY, spaceSize },
			isTouching, touchOffset, touchStart,
			xLow, yLow, xHigh, yHigh
		} = this.state;
		const width = spaceSize * chunkSize * (xHigh - xLow + 1);
		const height = spaceSize * chunkSize * (yHigh - yLow + 1);
		const playerScores = isLimited ? calculateLimitScore(gameState) : [];
		const win = checkWin(gameState);
		return (
			<div id="screen">
				<div id="player-bar"
					style={{
						background: (win ?
							config.playerColors[flatten((isLimited ?
								playerScores.map((e, i) => ({ e, i })).sort((a, b) => b.e - a.e)[0].i
								: turn - 1), playerCount)]
							: config.playerColors[turn])
					}}
				/>
				<div id="zoom-bar">
					<button id="zoom-in" onClick={() => this.handleZoom(3 / 2)}>+</button>
					<button id="zoom-out" onClick={() => this.handleZoom(2 / 3)}>-</button>
				</div>
				{isLimited && <Limit moveLimit={moveLimit} />}
				{isLimited && <ScoreScreen playerScores={playerScores} config={config} />}
				<button id="reset-button" onClick={() => window.location.reload()}>Reset Game</button>
				<div className="board" ref={this.boardRef}>
					<div
						className="chunk-container"
						style={{
							position: "absolute",
							width: `${width}px`,
							height: `${height}px`,
							marginTop: `${-height / 2 + offsetY + (isTouching ? (touchOffset.y - touchStart.y) : 0)}px`,
							marginLeft: `${-width / 2 + offsetX + (isTouching ? (touchOffset.x - touchStart.x) : 0)}px`
						}}
					>
						{Object.values(map).map(value =>
							<Chunk
								config={config}
								key={value.x + '_' + value.y}
								posX={value.x - xLow}
								posY={value.y - yLow}
								chunkX={value.x}
								chunkY={value.y}
								chunkData={value.chunkData}
								selectSquare={this.selectSquare}
								win={win}
								canPlayerMove={canMove(gameState)}
								view={view}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}
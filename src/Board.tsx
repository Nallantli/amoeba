import { faArrowsToDot, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { AI } from "./AI";
import "./App.css";
import { Chunk, chunkSize } from "./Chunk";
import { GameState, checkWin, getPlayerScores, selectSquare } from "./GameState";
import { IconConfig } from "./IconConfig";
import { buttonAudio, flatten } from "./utils";

type BoardProps = {
	gameState: GameState;
	iconConfig: IconConfig;
	broadcast: (gameState: GameState, callback: (gameState: GameState) => void) => void;
	canMove: boolean;
	delay: number;
	winLength: number;
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
	touchStart: { x: number; y: number };
	touchOffset: { x: number; y: number };
	shiftScroll: boolean;
	ctrlScroll: boolean;
};

const Limit = (props: { moveLimit: number }) => {
	return <div id="limit-dialog">Turns Left: {props.moveLimit}</div>;
};

const ScoreScreen = (props: { playerScores: number[]; iconConfig: IconConfig }) => {
	const { playerScores, iconConfig } = props;
	return (
		<div id="score-dialog">
			<table>
				<tbody>
					{playerScores.map((score, i) => (
						<tr key={i}>
							<td style={{ width: "40px" }}>{React.createElement(iconConfig.playerIcons[i], { color: iconConfig.playerColors[i] })}</td>
							<td>{score}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

function doLocalTurn(gameState: GameState, callback: (x: number, y: number) => void) {
	if (gameState.players[gameState.turn] !== null) {
		(gameState.players[gameState.turn] as AI).doTurn(gameState).then(({ x, y }) => callback(x, y));
	}
}

function postMove(gameState: GameState, winLength: number, setSquare: (x: number, y: number) => void) {
	if (!checkWin(gameState, winLength)[0]) {
		doLocalTurn(gameState, setSquare);
	}
}

export class Board extends React.Component<BoardProps, BoardState> {
	boardRef: React.RefObject<HTMLDivElement>;
	constructor(props: BoardProps) {
		super(props);

		this.selectSquare = this.selectSquare.bind(this);
		this.setSquare = this.setSquare.bind(this);
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
				spaceSize: 50,
			},
			xLow: 0,
			xHigh: 0,
			yLow: 0,
			yHigh: 0,
			isTouching: false,
			touchStart: { x: 0, y: 0 },
			touchOffset: { x: 0, y: 0 },
			shiftScroll: false,
			ctrlScroll: false,
		};
	}
	handleZoom(v: number) {
		const { offsetX, offsetY, spaceSize } = this.state.view;
		const newSpaceSize = Math.max(15, Math.min(160, spaceSize * v));
		this.setState({
			view: {
				offsetX: offsetX * (newSpaceSize / spaceSize),
				offsetY: offsetY * (newSpaceSize / spaceSize),
				spaceSize: newSpaceSize,
			},
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
					spaceSize: spaceSize,
				},
			});
		}
	}
	handleTouchMove(e: any) {
		e.preventDefault();
		const evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
		const touch = evt.touches[0] || evt.changedTouches[0];
		this.setState({
			touchOffset: { x: touch.pageX, y: touch.pageY },
		});
	}
	handleTouchStart(e: any) {
		e.preventDefault();
		const evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
		const touch = evt.touches[0] || evt.changedTouches[0];
		this.setState({
			isTouching: true,
			touchStart: { x: touch.pageX, y: touch.pageY },
			touchOffset: { x: touch.pageX, y: touch.pageY },
		});
	}
	handleTouchEnd(e: any) {
		e.preventDefault();
		const evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
		const touch = evt.touches[0] || evt.changedTouches[0];
		const { view, touchStart, touchOffset } = this.state;
		const { offsetX, offsetY, spaceSize } = view;
		this.setState(
			{
				isTouching: false,
				view: {
					offsetX: offsetX + (touchOffset.x - touchStart.x),
					offsetY: offsetY + (touchOffset.y - touchStart.y),
					spaceSize: spaceSize,
				},
			},
			() => {
				if (Math.pow(touchStart.x - touch.pageX, 2) + Math.pow(touchStart.y - touch.pageY, 2) < 10) {
					if (touch.target.click !== undefined) {
						touch.target.click();
					}
				}
			}
		);
	}
	handleKeyDown(e: any) {
		switch (e.key) {
			case "Shift":
				this.setState({
					shiftScroll: true,
				});
				break;
			case "Control":
				this.setState({
					ctrlScroll: true,
				});
				break;
		}
	}
	handleKeyUp(e: any) {
		switch (e.key) {
			case "Shift":
				this.setState({
					shiftScroll: false,
				});
				break;
			case "Control":
				this.setState({
					ctrlScroll: false,
				});
				break;
		}
	}
	componentDidMount() {
		window.addEventListener("wheel", this.handleScroll, { passive: false });
		window.addEventListener("touchstart", this.handleTouchStart, { passive: false });
		window.addEventListener("touchmove", this.handleTouchMove, { passive: false });
		window.addEventListener("touchend", this.handleTouchEnd, { passive: false });
		window.addEventListener("touchcancel", this.handleTouchEnd, { passive: false });
		window.addEventListener("keydown", this.handleKeyDown, { passive: false });
		window.addEventListener("keyup", this.handleKeyUp, { passive: false });
		this.boardRef.current?.addEventListener("selectSquare", this.selectSquare);
	}
	setSquare(x: number, y: number) {
		const { delay } = this.props;
		setTimeout(() => this.boardRef.current?.dispatchEvent(new CustomEvent("selectSquare", { detail: { x: x, y: y } })), delay);
	}
	selectSquare(e: any) {
		const { broadcast, gameState, winLength } = this.props;
		const { x, y } = e.detail;
		buttonAudio.play();
		document.getElementById(x + "_" + y)?.classList.add("space-pressed");
		broadcast(selectSquare(gameState, x, y), (gameState2: GameState) => postMove(gameState2, winLength, this.setSquare));
	}
	render() {
		const {
			iconConfig,
			canMove,
			winLength,
			gameState,
			gameState: { moveLimit, turn, map, isLimited, players },
		} = this.props;
		const {
			view,
			view: { offsetX, offsetY, spaceSize },
			isTouching,
			touchOffset,
			touchStart,
			xLow,
			yLow,
			xHigh,
			yHigh,
		} = this.state;
		const width = spaceSize * chunkSize * (xHigh - xLow + 1);
		const height = spaceSize * chunkSize * (yHigh - yLow + 1);
		const playerScores = getPlayerScores(gameState, winLength);
		const [win, winSquares, winner] = checkWin(gameState, winLength);
		return (
			<div id="screen">
				<div
					id="player-bar"
					style={{
						background: win
							? iconConfig.playerColors[flatten(isLimited ? playerScores.map((e, i) => ({ e, i })).sort((a, b) => b.e - a.e)[0].i : turn - 1, players.length)]
							: iconConfig.playerColors[turn],
					}}
				/>
				<div id="zoom-bar">
					<button id="zoom-in" onClick={() => this.handleZoom(3 / 2)}>
						<FontAwesomeIcon icon={faPlus} />
					</button>
					<button id="zoom-out" onClick={() => this.handleZoom(2 / 3)}>
						<FontAwesomeIcon icon={faMinus} />
					</button>
					<button
						id="zoom-reset"
						onClick={() =>
							this.setState({
								...this.state,
								view: {
									offsetX: 0,
									offsetY: 0,
									spaceSize: 50,
								},
							})
						}
					>
						<FontAwesomeIcon icon={faArrowsToDot} />
					</button>
				</div>
				{isLimited && <Limit moveLimit={moveLimit} />}
				{isLimited && <ScoreScreen playerScores={playerScores} iconConfig={iconConfig} />}
				<div id="board" ref={this.boardRef}>
					<div
						className="chunk-container"
						style={{
							position: "absolute",
							width: `${width}px`,
							height: `${height}px`,
							marginTop: `${-height / 2 + offsetY + (isTouching ? touchOffset.y - touchStart.y : 0)}px`,
							marginLeft: `${-width / 2 + offsetX + (isTouching ? touchOffset.x - touchStart.x : 0)}px`,
						}}
					>
						{Object.values(map).map((value) => (
							<Chunk
								map={map}
								iconConfig={iconConfig}
								key={value.x + "_" + value.y}
								posX={value.x - xLow}
								posY={value.y - yLow}
								chunkX={value.x}
								chunkY={value.y}
								chunkData={value.chunkData}
								selectSquare={this.selectSquare}
								canPlayerMove={canMove}
								view={view}
								placements={gameState.placements}
								winSquares={winSquares}
								winner={winner}
							/>
						))}
					</div>
				</div>
			</div>
		);
	}
}

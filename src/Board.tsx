import React from 'react';
import { Chunk, chunkSize } from './Chunk';
import { Fuzzy } from './ais/Fuzzy';
import { AI } from './AI';
import { Elk } from './ais/Elk';
import { ElkAtt } from './ais/ElkAtt';
import { ElkDef } from './ais/ElkDef';

export type ConfigType = {
	playerIcons: any[];
	playerColors: string[];
};

function flatten(x: number, d: number): number {
	while (x < 0)
		x += d;
	return x % d;
}

/* carter code */
function fib(n: number): number {
	if (n === 1 || n === 0)
		return n;
	else
		return fib(n - 2) + fib(n - 1);
}

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
	params: any;
	playerCount: number;
	winLength: number;
	limit: number;
	turnDelay: number;
	isLimited: boolean;
	config: ConfigType;
};

type BoardState = {
	map: { [key: string]: { x: number, y: number, chunkData: number[][] } };
	placements: { x: number, y: number, v: number }[];
	turn: number;
	AIs: (AI | undefined)[];
	win: boolean;
	view: {
		offsetX: number;
		offsetY: number;
		spaceSize: number;
	};
	xLow: number;
	xHigh: number;
	yLow: number;
	yHigh: number;
	playerScores: number[];
	moveLimit: number;
	isTouching: boolean;
	touchStart: { x: number, y: number };
	touchOffset: { x: number, y: number };
};

export class Board extends React.Component<BoardProps, BoardState> {
	boardRef: React.RefObject<HTMLDivElement>;
	constructor(props: BoardProps) {
		super(props);

		this.getValue = this.getValue.bind(this);
		this.addChunk = this.addChunk.bind(this);
		this.selectSquare = this.selectSquare.bind(this);
		this.postMove = this.postMove.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
		this.handleTouchStart = this.handleTouchStart.bind(this);
		this.handleTouchMove = this.handleTouchMove.bind(this);
		this.handleTouchEnd = this.handleTouchEnd.bind(this);
		this.sharePoint = this.sharePoint.bind(this);
		this.horizontalCount = this.horizontalCount.bind(this);
		this.verticalCount = this.verticalCount.bind(this);
		this.diagonalUp = this.diagonalUp.bind(this);
		this.diagonalDown = this.diagonalDown.bind(this);
		this.calculateLimitScore = this.calculateLimitScore.bind(this);
		this.handleZoom = this.handleZoom.bind(this);

		this.boardRef = React.createRef();

		let AIs: (AI | undefined)[] = [];
		for (let i = 0; i < props.playerCount; i++) {
			switch (props.params.get(`p${i + 1}`)) {
				case "fuzzy":
					AIs.push(new Fuzzy(this.getValue, props.winLength, i + 1, props.playerCount));
					break;
				case "elk":
					AIs.push(new Elk(this.getValue, props.winLength, i + 1, props.playerCount));
					break;
				case "elkatt":
					AIs.push(new ElkAtt(this.getValue, props.winLength, i + 1, props.playerCount));
					break;
				case "elkdef":
					AIs.push(new ElkDef(this.getValue, props.winLength, i + 1, props.playerCount));
					break;
				default:
					AIs.push(undefined);
					break;
			}
		}

		this.state = {
			map: {},
			placements: [],
			turn: 0,
			AIs: AIs,
			win: false,
			view: {
				offsetX: 0,
				offsetY: 0,
				spaceSize: 50
			},
			xLow: 0,
			xHigh: 0,
			yLow: 0,
			yHigh: 0,
			playerScores: Array(props.playerCount).fill(0),
			moveLimit: props.limit,
			isTouching: false,
			touchStart: { x: 0, y: 0 },
			touchOffset: { x: 0, y: 0 }
		}
	}
	sharePoint(a: { x: number, y: number }[], b: { x: number, y: number }[]) {
		for (let i = 0; i < a.length; i++) {
			for (let j = 0; j < b.length; j++) {
				if (a[i].x === b[j].x && a[i].y === b[j].y)
					return true;
			}
		}
		return false;
	}
	horizontalCount(x: number, y: number, v: number) {
		let ps = [];
		while (this.getValue(x, y) === v) {
			ps.push({ x, y });
			x++;
		}
		return { ps, type: 0 };
	}
	verticalCount(x: number, y: number, v: number) {
		let ps = [];
		while (this.getValue(x, y) === v) {
			ps.push({ x, y });
			y++;
		}
		return { ps, type: 1 };
	}
	diagonalUp(x: number, y: number, v: number) {
		let ps = [];
		while (this.getValue(x, y) === v) {
			ps.push({ x, y });
			y++;
			x++;
		}
		return { ps, type: 2 };
	}
	diagonalDown(x: number, y: number, v: number) {
		let ps = [];
		while (this.getValue(x, y) === v) {
			ps.push({ x, y });
			y--;
			x++;
		}
		return { ps, type: 3 };
	}
	handleZoom(v: number) {
		let { offsetX, offsetY, spaceSize } = this.state.view;
		if ((spaceSize < 15 && v < 1) || (spaceSize > 160 && v > 1)) return;
		this.setState({
			view: {
				offsetX: offsetX * v,
				offsetY: offsetY * v,
				spaceSize: spaceSize * v
			}
		});
	}
	calculateLimitScore() {
		const { playerCount, winLength } = this.props;
		const { placements } = this.state;
		let matches: { type: number, ps: { x: number, y: number }[], old?: boolean }[][] = [];
		for (let i = 0; i < playerCount; i++) {
			matches.push([]);
		}
		placements.forEach((placement: { x: number, y: number, v: number }) => {
			[
				this.horizontalCount(placement.x, placement.y, placement.v),
				this.verticalCount(placement.x, placement.y, placement.v),
				this.diagonalUp(placement.x, placement.y, placement.v),
				this.diagonalDown(placement.x, placement.y, placement.v)
			].forEach(e => {
				if (e.ps.length < winLength) {
					return;
				}
				let flag = false;
				let removes: number[] = [];
				matches[placement.v - 1].forEach((p: { type: number, ps: { x: number, y: number }[] }, i: number) => {
					if (p.type === e.type && this.sharePoint(p.ps, e.ps)) {
						if (p.ps.length < e.ps.length) {
							removes.push(i);
						} else {
							flag = true;
						}
					}
				});
				removes.forEach(i => matches[placement.v - 1][i].old = true);
				if (!flag) {
					matches[placement.v - 1].push(e);
				}
			});
		});
		let playerScores: number[] = [];
		matches.map(m => m.filter(e => e.old === undefined));
		matches.forEach(e => {
			let score = 0;
			e.forEach(p => {
				score += fib(p.ps.length - winLength + 2);
			});
			playerScores.push(score);
		});
		return playerScores;
	}
	handleScroll(e: any) {
		e.preventDefault();
		const { offsetX, offsetY, spaceSize } = this.state.view;
		const deltaX = e.deltaX * 0.25;
		const deltaY = e.deltaY * 0.25;
		this.setState({
			view: {
				offsetX: offsetX - deltaX,
				offsetY: offsetY - deltaY,
				spaceSize: spaceSize
			}
		})
	}
	handleTouchMove(e: any) {
		e.preventDefault();
		var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		var touch = evt.touches[0] || evt.changedTouches[0];
		this.setState({
			touchOffset: { x: touch.pageX, y: touch.pageY }
		});
	}
	handleTouchStart(e: any) {
		e.preventDefault();
		var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		var touch = evt.touches[0] || evt.changedTouches[0];
		this.setState({
			isTouching: true,
			touchStart: { x: touch.pageX, y: touch.pageY },
			touchOffset: { x: touch.pageX, y: touch.pageY }
		});
	}
	handleTouchEnd(e: any) {
		e.preventDefault();
		var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		var touch = evt.touches[0] || evt.changedTouches[0];
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
				touch.target.click();
			}
		});
	}
	componentDidMount() {
		window.addEventListener('wheel', this.handleScroll, { passive: false });
		window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
		window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
		window.addEventListener('touchend', this.handleTouchEnd, { passive: false });
		window.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
		this.boardRef.current?.addEventListener('selectSquare', this.selectSquare);
		let newState = { ...this.state };
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				newState = { ...newState, ...this.addChunk(i, j, newState) };
			}
		}
		this.setState(
			{ ...newState },
			() => {
				if (this.state.AIs[this.state.turn] !== undefined) {
					const pos = this.state.AIs[this.state.turn]?.doTurn(this.state.placements);
					setTimeout(
						() => this.boardRef.current?.dispatchEvent(
							new CustomEvent('selectSquare',
								{ detail: { x: pos?.x, y: pos?.y } })),
						this.props.turnDelay);
				}
			}
		);
	}
	getValue(x: number, y: number) {
		let { map } = this.state;
		let chunk = map[Math.floor(x / chunkSize) + '_' + Math.floor(y / chunkSize)];
		if (chunk === undefined) {
			return 0;
		}
		return chunk.chunkData[flatten(x, chunkSize)][flatten(y, chunkSize)];
	}
	checkWin(lastMove: { x: number, y: number }) {
		const { x, y } = lastMove;
		const { moveLimit } = this.state;
		const { winLength, isLimited } = this.props
		if (isLimited) {
			const playerScores = this.calculateLimitScore();
			if (moveLimit === 0) {
				return { win: true, playerScores };
			}
			return { win: false, playerScores };
		} else {
			let check = this.getValue(x, y);
			if (check === 0)
				return { win: false, playerScores: [] };
			for (let i = 0; i < winLength; i++) {
				let squares = [];
				for (let j = 0; j < winLength; j++) {
					let s = this.getValue(x - i + j, y);
					if (s === undefined)
						break;
					if (s !== check)
						break;
					squares.push((x - i + j) + "_" + y);
				}
				if (squares.length === winLength) {
					squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
					return { win: true, playerScores: [] };
				}
			}
			for (let i = 0; i < winLength; i++) {
				let squares = [];
				for (let j = 0; j < winLength; j++) {
					let s = this.getValue(x, y - i + j);
					if (s === undefined)
						break;
					if (s !== check)
						break;
					squares.push(x + "_" + (y - i + j));
				}
				if (squares.length === winLength) {
					squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
					return { win: true, playerScores: [] };
				}
			}
			for (let i = 0; i < winLength; i++) {
				let squares = [];
				for (let j = 0; j < winLength; j++) {
					let s = this.getValue(x - i + j, y - i + j);
					if (s === undefined)
						break;
					if (s !== check)
						break;
					squares.push((x - i + j) + "_" + (y - i + j));
				}
				if (squares.length === winLength) {
					squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
					return { win: true, playerScores: [] };
				}
			}
			for (let i = 0; i < winLength; i++) {
				let squares = [];
				for (let j = 0; j < winLength; j++) {
					let s = this.getValue(x - i + j, y + i - j);
					if (s === undefined)
						break;
					if (s !== check)
						break;
					squares.push((x - i + j) + "_" + (y + i - j));
				}
				if (squares.length === winLength) {
					squares.forEach((e) => document.getElementById(e)?.classList.add("win-square"));
					return { win: true, playerScores: [] };
				}
			}
		}
		return { win: false, playerScores: [] };
	}
	postMove(lastMove: { x: number, y: number, v: number }) {
		const { win, playerScores } = this.checkWin(lastMove);
		let newState = { ...this.state, playerScores };
		if (win) {
			this.setState({ ...newState, win: true });
		} else {
			const chunkX = Math.floor(lastMove.x / chunkSize);
			const chunkY = Math.floor(lastMove.y / chunkSize);
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					if (i === 0 && j === 0) continue;
					newState = { ...newState, ...this.addChunk(chunkX + i, chunkY + j, newState) };
				}
			}
			this.setState(newState, () => {
				if (this.state.AIs[this.state.turn] !== undefined) {
					const pos = this.state.AIs[this.state.turn]?.doTurn(this.state.placements);
					setTimeout(
						() => this.boardRef.current?.dispatchEvent(
							new CustomEvent('selectSquare',
								{ detail: { x: pos?.x, y: pos?.y } })),
						this.props.turnDelay);
				}
			});
		}
	}
	selectSquare(e: any) {
		const { x, y } = e.detail;
		let { map, turn, moveLimit } = this.state;
		let v = turn + 1;
		let chunk = map[Math.floor(x / chunkSize) + '_' + Math.floor(y / chunkSize)];
		chunk.chunkData[flatten(x, chunkSize)][flatten(y, chunkSize)] = v;
		this.setState({
			map: {
				...map,
				[Math.floor(x / chunkSize) + '_' + Math.floor(y / chunkSize)]: chunk
			},
			placements: [...this.state.placements, { x, y, v }],
			turn: (turn + 1) % this.props.playerCount,
			moveLimit: moveLimit - (turn === this.props.playerCount - 1 ? 1 : 0)
		}, () => {
			this.postMove({ x, y, v });
		});
	}
	addChunk(x: number, y: number, newState: BoardState) {
		let { map, xLow, yLow, xHigh, yHigh, view } = newState || this.state;
		let { offsetX, offsetY, spaceSize } = view;
		if (map[x + '_' + y] !== undefined) {
			return;
		}
		let chunkData: number[][] = [];
		for (let i = 0; i < chunkSize; i++) {
			chunkData[i] = [];
			for (let j = 0; j < chunkSize; j++) {
				chunkData[i][j] = 0;
			}
		}
		map[`${x}_${y}`] = {
			x: x,
			y: y,
			chunkData
		};
		if (x < xLow) {
			xLow = x;
			offsetX -= chunkSize * spaceSize / 2;
		}
		if (y < yLow) {
			yLow = y;
			offsetY -= chunkSize * spaceSize / 2;
		}
		if (x > xHigh) {
			xHigh = x;
			offsetX += chunkSize * spaceSize / 2;
		}
		if (y > yHigh) {
			yHigh = y;
			offsetY += chunkSize * spaceSize / 2;
		}
		return {
			map: map,
			xLow: xLow,
			yLow: yLow,
			xHigh: xHigh,
			yHigh: yHigh,
			view: {
				offsetX: offsetX,
				offsetY: offsetY,
				spaceSize: spaceSize
			}
		};
	}
	render() {
		const { config, isLimited, playerCount } = this.props;
		const { view, isTouching, touchOffset, touchStart, xLow, yLow, xHigh, yHigh, moveLimit, playerScores, win, turn, map, AIs } = this.state;
		let { offsetX, offsetY, spaceSize } = view;
		if (isTouching) {
			offsetX = offsetX + (touchOffset.x - touchStart.x);
			offsetY = offsetY + (touchOffset.y - touchStart.y);
		}
		const width = spaceSize * chunkSize * (xHigh - xLow + 1);
		const height = spaceSize * chunkSize * (yHigh - yLow + 1);
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
				<div className="board" ref={this.boardRef}>
					<div
						className="chunk-container"
						style={{
							position: "absolute",
							width: `${width}px`,
							height: `${height}px`,
							top: `50%`,
							marginTop: `${-height / 2 + offsetY}px`,
							left: `50%`,
							marginLeft: `${-width / 2 + offsetX}px`
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
								canPlayerMove={AIs[turn] === undefined}
								view={view}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}
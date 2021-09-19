import React from 'react';
import { Chunk, chunkSize } from './Chunk';
import { spaceSize } from './Space';
import { Fuzzy, Elk, ElkAtt, ElkDef } from './ai';
import { CONFIG } from './Utils';

export function flatten(x, d) {
	while (x < 0)
		x += d;
	return x % d;
}

// carter code
const fib = n => {
	if (n === 1 || n === 0)
		return n;
	else
		return fib(n - 2) + fib(n - 1);
}

class Limit extends React.Component {
	render() {
		return (
			<div
				id="limit-dialog"
			>Turns Left: {this.props.moveLimit}</div>
		);
	}
}

class ScoreScreen extends React.Component {
	render() {
		return (
			<div
				id="score-dialog"
			>
				<table>
					<tbody>
						{this.props.playerScores.map((score, i) => <tr key={i}><td style={{ width: "40px" }}><img alt={`player-${i + 1}-icon`} className="svg" src={CONFIG.player_icons[i]} /></td><td>{score}</td></tr>)}
					</tbody>
				</table>
			</div>
		);
	}
}

export class Board extends React.Component {
	constructor(props) {
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

		this.boardRef = React.createRef();

		let AIs = [];
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
			offsetX: 0,
			offsetY: 0,
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
	sharePoint(a, b) {
		for (let i = 0; i < a.length; i++) {
			for (let j = 0; j < b.length; j++) {
				if (a[i].x === b[j].x && a[i].y === b[j].y)
					return true;
			}
		}
		return false;
	}
	horizontalCount(x, y, v) {
		let ps = [];
		while (this.getValue(x, y) === v) {
			ps.push({ x, y });
			x++;
		}
		return { ps, type: 0 };
	}
	verticalCount(x, y, v) {
		let ps = [];
		while (this.getValue(x, y) === v) {
			ps.push({ x, y });
			y++;
		}
		return { ps, type: 1 };
	}
	diagonalUp(x, y, v) {
		let ps = [];
		while (this.getValue(x, y) === v) {
			ps.push({ x, y });
			y++;
			x++;
		}
		return { ps, type: 2 };
	}
	diagonalDown(x, y, v) {
		let ps = [];
		while (this.getValue(x, y) === v) {
			ps.push({ x, y });
			y--;
			x++;
		}
		return { ps, type: 3 };
	}
	calculateLimitScore() {
		const { playerCount, winLength } = this.props;
		const { placements } = this.state;
		let matches = [];
		for (let i = 0; i < playerCount; i++) {
			matches.push([]);
		}
		placements.forEach(placement => {
			[
				this.horizontalCount(placement.x, placement.y, placement.v),
				this.verticalCount(placement.x, placement.y, placement.v),
				this.diagonalUp(placement.x, placement.y, placement.v),
				this.diagonalDown(placement.x, placement.y, placement.v)
			].forEach(e => {
				if (e.ps.length < winLength) {
					return;
				}
				//if (placement.v === 1) {
				let flag = false;
				let removes = [];
				matches[placement.v - 1].forEach((p, i) => {
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
		let playerScores = [];
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
	handleScroll(e) {
		e.preventDefault();
		const { offsetX, offsetY } = this.state;
		this.setState({
			offsetX: offsetX - e.deltaX / 2,
			offsetY: offsetY - e.deltaY / 2
		})
	}
	handleTouchMove(e) {
		e.preventDefault();
		var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		var touch = evt.touches[0] || evt.changedTouches[0];
		this.setState({
			touchOffset: { x: touch.pageX, y: touch.pageY }
		});
	}
	handleTouchStart(e) {
		e.preventDefault();
		var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		var touch = evt.touches[0] || evt.changedTouches[0];
		this.setState({
			isTouching: true,
			touchStart: { x: touch.pageX, y: touch.pageY },
			touchOffset: { x: touch.pageX, y: touch.pageY }
		});
	}
	handleTouchEnd(e) {
		e.preventDefault();
		var evt = (typeof e.originalEvent === 'undefined') ? e : e.originalEvent;
		var touch = evt.touches[0] || evt.changedTouches[0];
		const { offsetX, offsetY, touchStart, touchOffset } = this.state;
		this.setState({
			isTouching: false,
			offsetX: offsetX + (touchOffset.x - touchStart.x),
			offsetY: offsetY + (touchOffset.y - touchStart.y)
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
		this.boardRef.current.addEventListener('selectSquare', this.selectSquare);
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
					const pos = this.state.AIs[this.state.turn].doTurn(this.state.placements);
					setTimeout(() => this.boardRef.current.dispatchEvent(new CustomEvent('selectSquare', { detail: { x: pos.x, y: pos.y } })));
				}
			}
		);
	}
	getValue(x, y) {
		let { map } = this.state;
		let chunk = map[Math.floor(x / chunkSize) + '_' + Math.floor(y / chunkSize)];
		if (chunk === undefined) {
			return 0;
		}
		return chunk.chunkData[flatten(x, chunkSize)][flatten(y, chunkSize)];
	}
	checkWin(lastMove) {
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
				return { win: false };
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
					squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
					return { win: true };
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
					squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
					return { win: true };
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
					squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
					return { win: true };
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
					squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
					return { win: true };
				}
			}
		}
		return { win: false };
	}
	postMove(lastMove) {
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
					const pos = this.state.AIs[this.state.turn].doTurn(this.state.placements);
					setTimeout(() => this.boardRef.current.dispatchEvent(new CustomEvent('selectSquare', { detail: { x: pos.x, y: pos.y } })));
				}
			});
		}
	}
	selectSquare(e) {
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
	addChunk(x, y, newState) {
		let { map, xLow, yLow, xHigh, yHigh, offsetX, offsetY } = newState || this.state;
		if (map[x + '_' + y] !== undefined) {
			return;
		}
		let chunkData = [];
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
			offsetX: offsetX,
			offsetY: offsetY
		};
	}
	render() {
		let { offsetX, offsetY, isTouching, touchOffset, touchStart, xLow, yLow, xHigh, yHigh } = this.state;
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
						background: (this.state.win ?
							CONFIG.player_colors[flatten((this.props.isLimited ?
								this.state.playerScores.map((e, i) => ({ e, i })).sort((a, b) => b.e - a.e)[0].i
								: this.state.turn - 1), this.props.playerCount)]
							: CONFIG.player_colors[this.state.turn])
					}}
				/>
				{this.props.isLimited && <Limit moveLimit={this.state.moveLimit} />}
				{this.props.isLimited && <ScoreScreen playerScores={this.state.playerScores} />}
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
						{Object.values(this.state.map).map(value =>
							<Chunk
								key={value.x + '_' + value.y}
								posX={value.x - xLow}
								posY={value.y - yLow}
								chunkX={value.x}
								chunkY={value.y}
								chunkData={value.chunkData}
								addChunk={this.addChunk}
								selectSquare={this.selectSquare}
								win={this.state.win}
							/>
						)}
					</div>
				</div>
			</div>
		);
	}
}
import { Fuzzy, ElkAtt, ElkDef, Elk } from './ai';
import { Chunk } from './Chunk';
import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { flatten, CONFIG } from './Utils';


const params = new URLSearchParams(window.location.search);
const winLength = params.get('win') ? parseInt(params.get('win')) : 5;
const player_count = params.get('count') ? parseInt(params.get('count')) : 2;

let AIs = [];
for (let i = 0; i < player_count; i++) {
	switch (params.get(`p${i + 1}`)) {
		case "fuzzy":
			AIs.push(new Fuzzy(getValue, winLength, i + 1, player_count));
			break;
		case "elk":
			AIs.push(new Elk(getValue, winLength, i + 1, player_count));
			break;
		case "elkatt":
			AIs.push(new ElkAtt(getValue, winLength, i + 1, player_count));
			break;
		case "elkdef":
			AIs.push(new ElkDef(getValue, winLength, i + 1, player_count));
			break;
		default:
			AIs.push(undefined);
			break;
	}
}

const LIMITED = params.get('limit') ? true : false;
let move_limit = params.get('limit') ? parseInt(params.get('limit')) : 0;

let GLOBAL_MAP = {};
let low_x = undefined;
let high_x = undefined;
let low_y = undefined;
let high_y = undefined;

let player_scores = [];

let placements = [];

function setValue(x, y, v, map) {
	let chunk = map[Math.floor(x / CONFIG.SIZE) + "_" + Math.floor(y / CONFIG.SIZE)];
	if (chunk === undefined)
		return undefined;
	chunk.data[flatten(x, CONFIG.SIZE) * CONFIG.SIZE + flatten(y, CONFIG.SIZE)] = v;
	placements.push({
		x: x,
		y: y,
		v: v
	});
	return v;
}

function getValue(x, y, map) {
	let chunk = map[Math.floor(x / CONFIG.SIZE) + "_" + Math.floor(y / CONFIG.SIZE)];
	if (chunk === undefined)
		return 0;
	return chunk.data[flatten(x, CONFIG.SIZE) * CONFIG.SIZE + flatten(y, CONFIG.SIZE)];
}

function horizontalCount(x, y, v, map) {
	let ps = [];
	while (getValue(x, y, map) === v) {
		ps.push({ x, y });
		x++;
	}
	return { ps, type: 0 };
}

function verticalCount(x, y, v, map) {
	let ps = [];
	while (getValue(x, y, map) === v) {
		ps.push({ x, y });
		y++;
	}
	return { ps, type: 1 };
}

function diagonalUp(x, y, v, map) {
	let ps = [];
	while (getValue(x, y, map) === v) {
		ps.push({ x, y });
		y++;
		x++;
	}
	return { ps, type: 2 };
}

function diagonalDown(x, y, v, map) {
	let ps = [];
	while (getValue(x, y, map) === v) {
		ps.push({ x, y });
		y--;
		x++;
	}
	return { ps, type: 3 };
}

function sharePoint(a, b) {
	for (let i = 0; i < a.length; i++) {
		for (let j = 0; j < b.length; j++) {
			if (a[i].x === b[j].x && a[i].y === b[j].y)
				return true;
		}
	}
	return false;
}

// carter code
const fib = n => {
	if (n === 1 || n === 0)
		return n;
	else
		return fib(n - 2) + fib(n - 1);
}

function calculateLimitScore(map) {
	let matches = [];
	for (let i = 0; i < player_count; i++) {
		matches.push([]);
	}
	placements.forEach(placement => {
		[
			horizontalCount(placement.x, placement.y, placement.v, map),
			verticalCount(placement.x, placement.y, placement.v, map),
			diagonalUp(placement.x, placement.y, placement.v, map),
			diagonalDown(placement.x, placement.y, placement.v, map)
		].forEach(e => {
			if (e.ps.length < winLength) {
				return;
			}
			//if (placement.v === 1) {
			let flag = false;
			let removes = [];
			matches[placement.v - 1].forEach((p, i) => {
				if (p.type === e.type && sharePoint(p.ps, e.ps)) {
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
	matches.map(m => m.filter(e => e.old === undefined));
	matches.forEach((e, i) => {
		let score = 0;
		e.forEach(p => {
			score += fib(p.ps.length - winLength + 2);
		});
		player_scores[i] = score;
	});
}

function checkWin(x, y, map) {
	if (LIMITED) {
		calculateLimitScore(map);
		if (move_limit === 0) {
			return true;
		}
	} else {
		let check = getValue(x, y, map);
		if (check === 0)
			return false;
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(x - i + j, y, map);
				if (s === undefined)
					break;
				if (s !== check)
					break;
				squares.push((x - i + j) + "_" + y);
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
				return true;
			}
		}
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(x, y - i + j, map);
				if (s === undefined)
					break;
				if (s !== check)
					break;
				squares.push(x + "_" + (y - i + j));
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
				return true;
			}
		}
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(x - i + j, y - i + j, map);
				if (s === undefined)
					break;
				if (s !== check)
					break;
				squares.push((x - i + j) + "_" + (y - i + j));
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
				return true;
			}
		}
		for (let i = 0; i < winLength; i++) {
			let squares = [];
			for (let j = 0; j < winLength; j++) {
				let s = getValue(x - i + j, y + i - j, map);
				if (s === undefined)
					break;
				if (s !== check)
					break;
				squares.push((x - i + j) + "_" + (y + i - j));
			}
			if (squares.length === winLength) {
				squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
				return true;
			}
		}
	}
	return false;
}

function addChunk(x, y, map) {
	let values = [];
	for (let i = 0; i < CONFIG.SIZE; i++) {
		for (let j = 0; j < CONFIG.SIZE; j++) {
			values[i * CONFIG.SIZE + j] = 0;
		}
	}
	map[x + "_" + y] = {
		x: x,
		y: y,
		data: values
	};
}

function addTop(map) {
	for (let x = low_x; x <= high_x; x++)
		addChunk(x, low_y - 1, map);
	if (board)
		board.forceUpdate();
	document.getElementById("grid").scrollBy(0, CONFIG.S_SIZE * CONFIG.SIZE);
}

function addBottom(map) {
	for (let x = low_x; x <= high_x; x++)
		addChunk(x, high_y + 1, map);
	if (board)
		board.forceUpdate();
}

function addLeft(map) {
	for (let y = low_y; y <= high_y; y++)
		addChunk(low_x - 1, y, map);
	if (board)
		board.forceUpdate();
	document.getElementById("grid").scrollBy(CONFIG.S_SIZE * CONFIG.SIZE, 0);
}

function addRight(map) {
	for (let y = low_y; y <= high_y; y++)
		addChunk(high_x + 1, y, map);
	if (board)
		board.forceUpdate();
}

function selectSquare(x, y, map, turn) {
	let element = document.getElementById(x + "_" + y);
	if (element === null) {
		while (x < low_x * CONFIG.SIZE)
			addLeft(map);
		while (y < low_y * CONFIG.SIZE)
			addTop(map);
		while (x >= high_x * CONFIG.SIZE)
			addRight(map);
		while (y >= high_y * CONFIG.SIZE)
			addBottom(map);
	}
	setValue(x, y, turn + 1, map);
}

class Grid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scrollX: 0,
			scrollY: 0
		};
		this.ref = React.createRef();
		this.scrollHandler = this.scrollHandler.bind(this);
	}
	scrollHandler() {
		if (this === undefined)
			return;
		const element = document.getElementById("grid");
		if (this.ref.current.scrollTop === 0) {
			addTop(this.props.map);
		}
		if ((high_y - low_y + 1) * CONFIG.S_SIZE * CONFIG.SIZE === element.clientHeight + this.ref.current.scrollTop) {
			addBottom(this.props.map);
		}
		if (this.ref.current.scrollLeft === 0) {
			addLeft(this.props.map);
		}
		if ((high_x - low_x + 1) * CONFIG.S_SIZE * CONFIG.SIZE === element.clientWidth + this.ref.current.scrollLeft) {
			addRight(this.props.map);
		}
		this.setState({
			scrollX: this.ref.current.scrollLeft,
			scrollY: this.ref.current.scrollTop
		});
	}
	render() {
		return (
			<div
				id="grid"
				ref={this.ref}
				onScroll={this.scrollHandler}
				style={{
					width: '100%',
					height: '100%',
					overflow: 'scroll',
					position: 'relative'
				}}>
				{this.props.chunks}
			</div>
		);
	}
}

class Limit extends React.Component {
	render() {
		return (
			<div
				id="limit-dialog"
				style={{
					display: (LIMITED ? "block" : "none")
				}}
			>Turns Left: {move_limit}</div>
		);
	}
}

class ScoreScreen extends React.Component {
	render() {
		return (
			<div
				id="score-dialog"
				style={{
					display: (LIMITED ? "block" : "none")
				}}
			>
				<table>
					{player_scores.map((score, i) => <tr><td style={{ width: "40px" }}><img className="svg" src={CONFIG.player_icons[i]} /></td><td>{score}</td></tr>)}
				</table>
			</div>
		);
	}
}

const max = 1000;

class Board extends React.Component {
	constructor(props) {
		super(props);
		let map = props.map;
		for (let i = -2; i <= 2; i++) {
			for (let j = -2; j <= 2; j++) {
				addChunk(i, j, map);
			}
		}
		this.state = {
			map: map,
			win: false
		}
		this.move = this.move.bind(this);
		this.postMove = this.postMove.bind(this);
		this.moves = 0;
		this.turn = 0;
	}
	move() {
		const last_move = AIs[this.turn].doTurn(placements, this.state.map);
		selectSquare(last_move.x, last_move.y, this.state.map, this.turn);
		this.postMove(last_move);
	}
	postMove(last_move) {
		this.turn = (this.turn + 1) % player_count;
		this.moves++;
		if (this.turn === player_count - 1) {
			if (LIMITED) {
				move_limit--;
			}
		}
		const win = checkWin(last_move.x, last_move.y, this.state.map);
		this.setState({ ...this.state, win: win });
		if (AIs[this.turn] && !win && this.moves < max) {
			this.move();
		}
	}
	componentDidMount() {
		if (AIs[0]) {
			this.move();
		}
	}
	render() {
		let nc = [];
		Object.values(this.state.map).map(c => {
			if (low_x === undefined || c.x < low_x)
				low_x = c.x;
			if (low_y === undefined || c.y < low_y)
				low_y = c.y;
			if (high_x === undefined || c.x > high_x)
				high_x = c.x;
			if (high_y === undefined || c.y > high_y)
				high_y = c.y;
			return c;
		});
		Object.values(this.state.map).forEach(c => {
			c.rx = c.x - low_x;
			c.ry = c.y - low_y;
			nc.push(
				<Chunk
					map={this.state.map}
					x={c.x}
					y={c.y}
					rx={c.rx}
					ry={c.ry}
					getValue={getValue}
					setValue={setValue}
					turn={this.turn}
					win={this.state.win}
					postMove={this.postMove}
				/>
			);
		});
		return (
			<div style={{
				margin: 0,
				padding: 0
			}}>
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						overflow: 'none',
						width: 'calc(100% - 10px)',
						height: 'calc(100% - 10px)',
						background: '#ccc',
						border: `5px solid ${CONFIG.player_colors[this.turn]}`
					}}
					ref={this.ref}
				>
					<Grid chunks={nc} map={this.state.map} />
				</div>
				<Limit />
				<ScoreScreen />
				<button
					id="refresh-button"
					onClick={() => {
						window.location.reload();
					}}
				>
					Reset Game
				</button>
			</div>
		);
	}
}

const board = ReactDOM.render(
	<Board map={GLOBAL_MAP} />,
	document.getElementById('root')
);

document.getElementById("grid").scrollBy(CONFIG.S_SIZE * CONFIG.SIZE, CONFIG.S_SIZE * CONFIG.SIZE);
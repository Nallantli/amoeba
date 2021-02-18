import { Basic, Fuzzy } from './ai';
import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

let map = {};
let turn = true;
let low_x = undefined;
let high_x = undefined;
let low_y = undefined;
let high_y = undefined;

const SIZE = 10;
const S_SIZE = 40;

let winLength = 5;

function flatten(x, d) {
	while (x < 0)
		x += d;
	return x % d;
}

function setValue(x, y, v) {
	let chunk = map[Math.floor(x / SIZE) + "_" + Math.floor(y / SIZE)];
	if (chunk === undefined)
		return undefined;
	chunk.data[flatten(x, SIZE) * SIZE + flatten(y, SIZE)] = v;
	return v;
}

function getValue(x, y) {
	let chunk = map[Math.floor(x / SIZE) + "_" + Math.floor(y / SIZE)];
	if (chunk === undefined)
		return 0;
	return chunk.data[flatten(x, SIZE) * SIZE + flatten(y, SIZE)];
}

function checkWin(x, y) {
	let check = getValue(x, y);
	if (check == 0)
		return;
	for (let i = 0; i < winLength; i++) {
		let squares = [];
		for (let j = 0; j < winLength; j++) {
			let s = getValue(x - i + j, y);
			if (s === undefined)
				break;
			if (s != check)
				break;
			squares.push((x - i + j) + "_" + y);
		}
		if (squares.length == winLength) {
			squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
			break;
		}
	}
	for (let i = 0; i < winLength; i++) {
		let squares = [];
		for (let j = 0; j < winLength; j++) {
			let s = getValue(x, y - i + j);
			if (s === undefined)
				break;
			if (s != check)
				break;
			squares.push(x + "_" + (y - i + j));
		}
		if (squares.length == winLength) {
			squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
			break;
		}
	}
	for (let i = 0; i < winLength; i++) {
		let squares = [];
		for (let j = 0; j < winLength; j++) {
			let s = getValue(x - i + j, y - i + j);
			if (s === undefined)
				break;
			if (s != check)
				break;
			squares.push((x - i + j) + "_" + (y - i + j));
		}
		if (squares.length == winLength) {
			squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
			break;
		}
	}
	for (let i = 0; i < winLength; i++) {
		let squares = [];
		for (let j = 0; j < winLength; j++) {
			let s = getValue(x - i + j, y + i - j);
			if (s === undefined)
				break;
			if (s != check)
				break;
			squares.push((x - i + j) + "_" + (y + i - j));
		}
		if (squares.length == winLength) {
			squares.forEach((e) => document.getElementById(e).classList.add("win-square"));
			break;
		}
	}
}

function addChunk(x, y) {
	let values = [];
	for (let i = 0; i < SIZE; i++) {
		for (let j = 0; j < SIZE; j++) {
			values[i * SIZE + j] = 0;
		}
	}
	map[x + "_" + y] = {
		x: x,
		y: y,
		data: values
	};
}

function addTop() {
	for (let x = low_x; x <= high_x; x++)
		addChunk(x, low_y - 1);
	board.renderChunks();
	document.getElementById("grid").scrollBy(0, S_SIZE * SIZE);
}

function addBottom() {
	for (let x = low_x; x <= high_x; x++)
		addChunk(x, high_y + 1);
	board.renderChunks();
}

function addLeft() {
	for (let y = low_y; y <= high_y; y++)
		addChunk(low_x - 1, y);
	board.renderChunks();
	document.getElementById("grid").scrollBy(S_SIZE * SIZE, 0);
}

function addRight() {
	for (let y = low_y; y <= high_y; y++)
		addChunk(high_x + 1, y);
	board.renderChunks();
}

function selectSquare(x, y) {
	let element = document.getElementById(x + "_" + y);
	if (element == null) {
		console.log(x, y, low_x * SIZE, low_y * SIZE, high_x * SIZE, high_y * SIZE);
		while (x < low_x * SIZE)
			addLeft();
		while (y < low_y * SIZE)
			addTop();
		while (x >= high_x * SIZE)
			addRight();
		while (y >= high_y * SIZE)
			addBottom();
		setValue(x, y, 2);
		turn = !turn;
		board.forceUpdate();
		return;
	}
	element.click();
}

class Square extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: getValue(this.props.x, this.props.y)
		}
	}
	render() {
		return (
			<button id={this.props.x + "_" + this.props.y} style={{
				top: flatten(this.props.y, SIZE) * S_SIZE,
				left: flatten(this.props.x, SIZE) * S_SIZE,
				width: S_SIZE,
				height: S_SIZE,
				fontSize: S_SIZE * 0.75,
				color: (this.state.value == 1 ? "blue" : "red")
			}} onClick={
				() => {
					if (this.state.value == 0) {
						this.setState({
							value: setValue(this.props.x, this.props.y, turn ? 1 : 2)
						});
						checkWin(this.props.x, this.props.y);
						turn = !turn;
						board.forceUpdate();
						if (AI !== undefined && !turn) {
							AI.doTurn({
								x: this.props.x,
								y: this.props.y
							});
						}
					}
				}
			}>{this.state.value == 1 ? "○" : this.state.value == 2 ? "❌" : ""}</button>
		)
	}
}

class Chunk extends React.Component {
	constructor(props) {
		super(props);
		let squares = [];
		for (let i = 0; i < SIZE; i++) {
			for (let j = 0; j < SIZE; j++) {
				squares[i * SIZE + j] = (<Square x={i + this.props.x * SIZE} y={j + this.props.y * SIZE} />);
			}
		}
		this.state = {
			squares: squares
		};
	}
	render() {
		return (
			<div style={{
				position: 'absolute',
				top: this.props.ry * SIZE * S_SIZE,
				left: this.props.rx * SIZE * S_SIZE,
				width: SIZE * S_SIZE,
				height: SIZE * S_SIZE
			}}>
				{this.state.squares}
			</div>
		);
	}
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
		if (this.ref.current.scrollTop == 0) {
			addTop();
		}
		if ((high_y - low_y + 1) * S_SIZE * SIZE == element.clientHeight + this.ref.current.scrollTop) {
			addBottom();
		}
		if (this.ref.current.scrollLeft == 0) {
			addLeft();
		}
		if ((high_x - low_x + 1) * S_SIZE * SIZE == element.clientWidth + this.ref.current.scrollLeft) {
			addRight();
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

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			grid: undefined
		};
		this.renderChunks = this.renderChunks.bind(this);
	}
	renderChunks() {
		let nc = [];
		Object.values(map).map(c => {
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
		Object.values(map).forEach(c => {
			c.rx = c.x - low_x;
			c.ry = c.y - low_y;
			nc.push(<Chunk x={c.x} y={c.y} rx={c.rx} ry={c.ry} />);
		});
		this.setState({
			grid: (<Grid chunks={nc} />)
		});
	}
	render() {
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
						border: (turn ? '5px solid blue' : '5px solid red')
					}}
					ref={this.ref}
				>
					{this.state.grid}
				</div>
			</div>
		);
	}
}

const board = ReactDOM.render(
	<Board />,
	document.getElementById('root')
);

const params = new URLSearchParams(window.location.search);

if (params.get('win') !== null) {
	winLength = parseInt(params.get('win'));
}

let AI = undefined;
switch (params.get('ai')) {
	case 'basic':
		AI = new Basic(getValue, selectSquare, winLength);
		break;
	case 'fuzzy':
		AI = new Fuzzy(getValue, selectSquare, winLength);
		break;
}

for (let i = -2; i <= 2; i++) {
	for (let j = -2; j <= 2; j++) {
		addChunk(i, j);
	}
}

board.renderChunks();
document.getElementById("grid").scrollBy(S_SIZE * SIZE, S_SIZE * SIZE);
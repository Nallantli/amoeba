import { faChevronLeft, faChevronRight, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ReactDOM from 'react-dom';

let map = {};

const SIZE = 8;
const S_SIZE = 40;

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
	for (let i = 0; i < 5; i++) {
		let squares = [];
		for (let j = 0; j < 5; j++) {
			let s = getValue(x - i + j, y);
			if (s === undefined)
				break;
			if (s != check)
				break;
			squares.push((x - i + j) + "_" + y);
		}
		if (squares.length == 5) {
			squares.forEach((e) => document.getElementById(e).style.background = "black");
			break;
		}
	}
	for (let i = 0; i < 5; i++) {
		let squares = [];
		for (let j = 0; j < 5; j++) {
			let s = getValue(x, y - i + j);
			if (s === undefined)
				break;
			if (s != check)
				break;
			squares.push(x + "_" + (y - i + j));
		}
		if (squares.length == 5) {
			squares.forEach((e) => document.getElementById(e).style.background = "black");
			break;
		}
	}
	for (let i = 0; i < 5; i++) {
		let squares = [];
		for (let j = 0; j < 5; j++) {
			let s = getValue(x - i + j, y - i + j);
			if (s === undefined)
				break;
			if (s != check)
				break;
			squares.push((x - i + j) + "_" + (y - i + j));
		}
		if (squares.length == 5) {
			squares.forEach((e) => document.getElementById(e).style.background = "black");
			break;
		}
	}
	for (let i = 0; i < 5; i++) {
		let squares = [];
		for (let j = 0; j < 5; j++) {
			let s = getValue(x - i + j, y + i - j);
			if (s === undefined)
				break;
			if (s != check)
				break;
			squares.push((x - i + j) + "_" + (y + i - j));
		}
		if (squares.length == 5) {
			squares.forEach((e) => document.getElementById(e).style.background = "black");
			break;
		}
	}
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
				position: 'absolute',
				top: flatten(this.props.y, SIZE) * S_SIZE,
				left: flatten(this.props.x, SIZE) * S_SIZE,
				width: S_SIZE,
				height: S_SIZE,
				fontSize: S_SIZE * 0.75,
				fontFamily: 'monospace',
				textAlign: 'center',
				color: (this.state.value == 1 ? "blue" : "red"),
				fontWeight: 'bolder',
				border: '1px solid #fff',
				background: '#ccc',
				borderRadius: 0,
				margin: 0,
				padding: 0
			}} onClick={
				() => {
					if (document.getElementById(this.props.x + "_" + this.props.y).style.background != 'black') {
						this.setState({
							value: setValue(this.props.x, this.props.y, (getValue(this.props.x, this.props.y) + 1) % 3)
						});
						checkWin(this.props.x, this.props.y);
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

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			chunks: [],
			width: 0,
			height: 0
		};
		this.addChunk = this.addChunk.bind(this);
	}
	addChunk(x, y) {
		let nc = [];
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
		let low_x = undefined;
		let high_x = undefined;
		let low_y = undefined;
		let high_y = undefined;
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
			chunks: nc,
			high_x: high_x,
			high_y: high_y,
			low_x: low_x,
			low_y: low_y
		});
	}
	render() {
		return (
			<div style={{
				margin: 0,
				padding: 0
			}}>
				<div style={{
					position: 'absolute',
					top: 50,
					left: 50,
					overflow: 'auto',
					width: 'calc(100% - 100px)',
					height: 'calc(100% - 100px)',
					background: '#ccc'
				}}>
					{this.state.chunks}
				</div>
				<FontAwesomeIcon icon={faChevronUp} style={{
					position: 'fixed',
					width: 'calc(100% - 100px)',
					height: 50,
					margin: 0,
					textAlign: 'center',
					top: 0,
					left: 50
				}} onClick={() => {
					for (let x = this.state.low_x; x <= this.state.high_x; x++)
						this.addChunk(x, this.state.low_y - 1);
				}} />
				<FontAwesomeIcon icon={faChevronDown} style={{
					position: 'fixed',
					width: 'calc(100% - 100px)',
					height: 50,
					margin: 0,
					padding: 0,
					bottom: 0,
					left: 50
				}} onClick={() => {
					for (let x = this.state.low_x; x <= this.state.high_x; x++)
						this.addChunk(x, this.state.high_y + 1);
				}} />
				<FontAwesomeIcon icon={faChevronLeft} style={{
					position: 'fixed',
					width: 50,
					height: 'calc(100% - 100px)',
					margin: 0,
					padding: 0,
					top: 50,
					left: 0
				}} onClick={() => {
					for (let y = this.state.low_y; y <= this.state.high_y; y++)
						this.addChunk(this.state.low_x - 1, y);
				}} />
				<FontAwesomeIcon icon={faChevronRight} style={{
					position: 'fixed',
					width: 50,
					height: 'calc(100% - 100px)',
					margin: 0,
					padding: 0,
					top: 50,
					right: 0
				}} onClick={() => {
					for (let y = this.state.low_y; y <= this.state.high_y; y++)
						this.addChunk(this.state.high_x + 1, y);
				}} />
			</div>
		);
	}
}

const board = ReactDOM.render(
	<Board />,
	document.getElementById('root')
);

board.addChunk(0, 0);
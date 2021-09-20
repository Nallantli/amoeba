import React from "react";

class MenuItem extends React.Component {
	constructor(props) {
		super(props);
		this.handleColorChange = this.handleColorChange.bind(this);
	}
	handleColorChange(e, id) {
		console.log({e, id});
	}
	render() {
		const { isPlayer, id, color, config } = this.props;
		const Icon = config.player_icons[id];
		return (
			<div className="menu-item">
				<div className="menu-item-name">
					Player {id + 1}
				</div>
				<div className="menu-item-icon">
					<Icon color={config.player_colors[id]} />
				</div>
				<div className="menu-item-color">
					<input type="text" value={config.player_colors[id]} onChange={(e) => this.handleColorChange(e, id)} />
				</div>
			</div>
		)
	}
}

export class Menu extends React.Component {
	constructor(props) {
		super(props);
		let players = [];
		for (let i = 0; i < props.playerCount; i++) {
			players.push({
				color: props.config.player_colors[i],
				isPlayer: true
			});
		}
		this.state = { players };
	}
	render() {
		return (
			<div className="menu">
				{this.state.players.map((player, index) => {
					return (
						<MenuItem
							id={index}
							color={player.color}
							isPlayer={player.isPlayer}
						/>
					)
				})}
			</div>
		)
	}
}
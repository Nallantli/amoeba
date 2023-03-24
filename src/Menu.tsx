import React from "react";
import { GameProps } from "./GameProps";
import { IconConfig } from "./IconConfig";

type PlayerItemProps = {
	AIName: string,
	index: number,
	iconConfig: IconConfig,
	removeItem: Function,
	changeAI: Function,
	canDelete: boolean
};

function PlayerItem(props: PlayerItemProps) {
	const { AIName, index, iconConfig, removeItem, changeAI, canDelete } = props;
	return (
		<div className="menu-playerItem">
			<div className="menu-playerItem-icon">
				{React.createElement(iconConfig.playerIcons[index], { color: iconConfig.playerColors[index] })}
			</div>
			<div className="menu-playerItem-body">
				<div className="menu-playerItem-AISelect">
					<span>Type:</span>
					<select id={`p${index + 1}`} onChange={(e) => changeAI(index, e.target.value)}>
						<option selected={AIName === 'player' ? true : false} value="player">No AI</option>
						<option selected={AIName === 'fuzzy' ? true : false} value="fuzzy">fuzzy</option>
						<option selected={AIName === 'elk' ? true : false} value="elk">elk</option>
						<option selected={AIName === 'elkatt' ? true : false} value="elkatt">elkatt</option>
						<option selected={AIName === 'elkdef' ? true : false} value="elkdef">elkdef</option>
					</select>
				</div>
			</div>
			{canDelete && <button className="menu-playerItem-remove" onClick={() => removeItem(index)}>X</button>}
		</div>)
}

export class Menu extends React.Component<GameProps, GameProps> {
	constructor(props: GameProps) {
		super(props);
		this.state = props;
	}
	render() {
		const { winLength, limit, delay, AINames, iconConfig } = this.state
		const removeItem = (index: number) => {
			let newAINames = [...this.state.AINames];
			newAINames.splice(index, 1);
			this.setState({
				...this.state,
				AINames: newAINames
			})
		};
		const playGame = () => {
			let url = `win=${winLength}&limit=${limit}&count=${AINames.length}&delay=${delay}`;
			for (let i = 0; i < AINames.length; i++) {
				if (AINames[i] !== 'player') {
					url += `&p${i + 1}=${AINames[i]}`;
				}
			}
			window.location.assign(`https://nallantli.github.io/amoeba/?game=1&${url}`);
		};
		const changeAI = (index: number, value: string) => {
			let newAINames = [...this.state.AINames];
			newAINames[index] = value;
			this.setState({
				...this.state,
				AINames: newAINames
			})
		}
		const canDelete = (AINames.length > 1);
		return (
			<div id="menu">
				<div id="menu-winLength">
					<span>Length to Win:</span>
					<input id="input-winLength" type="text" defaultValue={winLength} onChange={(e) => {
						this.setState({
							...this.state,
							winLength: parseInt(e.target.value, 10)
						})
					}}></input>
				</div>
				<div id="menu-limit">
					<span>Maximum Amount of Rounds:</span>
					<input id="input-limit" type="text" defaultValue={limit} onChange={(e) => {
						this.setState({
							...this.state,
							limit: parseInt(e.target.value, 10)
						})
					}}></input>
				</div>
				<div id="menu-delay">
					<span>Millisecond Delay Between Moves:</span>
					<input id="input-delay" type="text" defaultValue={delay} onChange={(e) => {
						this.setState({
							...this.state,
							delay: parseInt(e.target.value, 10)
						})
					}}></input>
				</div>
				<div id="menu-players">
					{AINames.map((AIName, index) => PlayerItem({
						AIName,
						index,
						iconConfig,
						removeItem,
						changeAI,
						canDelete
					}))}
				</div>
				{AINames.length < 4 && <button id="menu-addPlayer" onClick={() => {
					this.setState({
						...this.state,
						AINames: [
							...AINames,
							"player"
						]
					})
				}}>Add Player</button>}
				<button id="play-game" onClick={playGame}>
					Play!
				</button>
			</div>
		)
	}
}
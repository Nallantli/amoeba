import React from "react";
import { GameProps } from "./GameProps";
import { IconConfig } from "./IconConfig";

type PlayerItemProps = {
	AIName: string,
	index: number,
	iconConfig: IconConfig,
	removeItem: Function,
	changeAI: Function,
	canDelete: boolean,
	AIMenuOptions: string[]
};

function PlayerItem(props: PlayerItemProps) {
	const { AIName, index, iconConfig, removeItem, changeAI, canDelete, AIMenuOptions } = props;
	return (
		<div className="menu-playerItem">
			<div className="menu-playerItem-icon">
				{React.createElement(iconConfig.playerIcons[index], { color: iconConfig.playerColors[index] })}
			</div>
			<div className="menu-playerItem-body">
				<div className="menu-playerItem-AISelect">
					<span>Type:</span>
					<select id={`p${index + 1}`} onChange={(e) => changeAI(index, e.target.value)}>
						<option selected={AIName === "player" ? true : false} value="player">No AI</option>
						{AIMenuOptions.map(selectOption => <option selected={AIName === selectOption ? true : false} value={selectOption}>{selectOption}</option>)}
					</select>
				</div>
			</div>
			{canDelete && <button className="menu-playerItem-remove" onClick={() => removeItem(index)}>X</button>}
		</div>)
}

interface MenuState extends GameProps {
	tab: string;
};

interface MenuProps extends GameProps {
};

export class Menu extends React.Component<MenuProps, MenuState> {
	constructor(props: MenuProps) {
		super(props);
		this.state = {
			...props,
			tab: 'regular'
		};
	}
	render() {
		const { AISelectOptions } = this.props;
		const { winLength, limit, delay, AINames, iconConfig, tab } = this.state;
		const removeItem = (index: number) => {
			let newAINames = [...this.state.AINames];
			newAINames.splice(index, 1);
			this.setState({
				...this.state,
				AINames: newAINames
			})
		};
		const playGame = () => {
			let url = `win=${winLength}&count=${AINames.length}&delay=${delay}`;
			if (tab === "limit") {
				url += `&limit=${limit}`;
			}
			for (let i = 0; i < AINames.length; i++) {
				if (AINames[i] !== 'player') {
					url += `&p${i + 1}=${AINames[i]}`;
				}
			}
			const baseURL = window.location.href.split('?')[0];
			window.location.assign(`${baseURL}?game=1&${url}`);
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
		const AIMenuOptions = Object.keys(AISelectOptions);
		return (
			<div id="menu">
				<div id="tabs">
					<button className={`tablinks-${tab === "regular" ? "active" : "inactive"}`} onClick={() => this.setState({ ...this.state, tab: "regular" })}>Regular Mode</button>
					<button className={`tablinks-${tab === "limit" ? "active" : "inactive"}`} onClick={() => this.setState({ ...this.state, tab: "limit" })}>Limit Mode</button>
				</div>
				<div id={`menu-options-${tab === "regular" ? "active" : "inactive"}`}>
				</div>
				<div id={`menu-options-${tab === "limit" ? "active" : "inactive"}`}>
					<div id="menu-limit">
						<span>Maximum Amount of Rounds:</span>
						<input id="input-limit" type="text" defaultValue={limit} onChange={(e) => {
							this.setState({
								...this.state,
								limit: parseInt(e.target.value, 10)
							})
						}}></input>
					</div>
				</div>
				<div id="menu-options">
					<div id="menu-winLength">
						<span>Length to Win or (Limit Mode) Gain Score:</span>
						<input id="input-winLength" type="text" defaultValue={winLength} onChange={(e) => {
							this.setState({
								...this.state,
								winLength: parseInt(e.target.value, 10)
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
				</div>
				<div id="menu-players">
					{AINames.map((AIName, index) => PlayerItem({
						AIName,
						index,
						iconConfig,
						removeItem,
						changeAI,
						canDelete,
						AIMenuOptions
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
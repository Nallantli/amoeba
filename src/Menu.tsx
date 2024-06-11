import { Box, Button, IconButton, MenuItem, Select, SvgIcon, Tab, Tabs, TextField } from "@mui/material";
import React, { useState } from "react";
import { GameProps } from "./GameProps";
import { IconConfig } from "./IconConfig";
import "./Base.css";
import { serverUrl } from "./utils";
import { GameState } from "./GameState";

function setUpSocket(socket: WebSocket, updateState: (gameState: GameState) => void) {
	socket.addEventListener("message", (event) => {
		const data = JSON.parse(event.data);
		switch (data.action) {
			case "JOIN_FAILURE": {
				const { message } = data;
				// TODO
				socket.close();
				break;
			}
			case "START": {
				// TODO
				break;
			}
			case "WIN": {
				// TODO
				socket.close();
				break;
			}
			case "STATE_UPDATE": {
				const { gameState } = data;
				updateState(gameState);
				break;
			}
		}
	});
}

type PlayerItemProps = {
	AIName: string;
	index: number;
	iconConfig: IconConfig;
	removeItem: Function;
	changeAI: Function;
	canDelete: boolean;
	AIMenuOptions: string[];
};

function PlayerItem(props: PlayerItemProps) {
	const { AIName, index, iconConfig, removeItem, changeAI, canDelete, AIMenuOptions } = props;
	return (
		<div style={{ padding: "5px", border: "1px solid white" }}>
			<SvgIcon>
				{React.createElement(iconConfig.playerIcons[index], {
					color: iconConfig.playerColors[index],
				})}
			</SvgIcon>
			<Select variant="filled" id={`p${index + 1}`} value={AIName} onChange={(e) => changeAI(index, e.target.value)}>
				<MenuItem value="player">No AI</MenuItem>
				{AIMenuOptions.map((selectOption) => (
					<MenuItem value={selectOption}>{selectOption}</MenuItem>
				))}
			</Select>
			{canDelete && <Button onClick={() => removeItem(index)}>Remove</Button>}
		</div>
	);
}

interface MenuProps {
	gameProps: GameProps;
	iconConfig: IconConfig;
	updateGameProps: (gameProps: GameProps) => void;
	startGame: () => void;
}

export function Menu({
	gameProps,
	iconConfig,
	gameProps: { AISelectOptions, AINames, winLength, delay, limit, socket },
	updateGameProps,
	startGame,
}: MenuProps) {
	const [tabValue, setTabValue] = useState(0);
	const [multiplayerTab, setMultiplayerTab] = useState(0);
	const removeItem = (index: number) => {
		let newAINames = [...AINames];
		newAINames.splice(index, 1);
		updateGameProps({
			...gameProps,
			AINames: newAINames,
		});
	};
	const changeAI = (index: number, value: string) => {
		let newAINames = [...AINames];
		newAINames[index] = value;
		updateGameProps({
			...gameProps,
			AINames: newAINames,
		});
	};
	const canDelete = AINames.length > 1;
	const AIMenuOptions = Object.keys(AISelectOptions);
	return (
		<div style={{ background: "#222", padding: "15px", borderRadius: "10px", maxWidth: "600px", margin: "auto", marginTop: "30px" }}>
			<Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
				<Tab label="Regular Mode" />
				<Tab label="Limit Mode" />
			</Tabs>
			{tabValue === 1 && (
				<Box>
					<TextField
						label="Maximum Amount of Rounds"
						variant="filled"
						value={limit}
						onChange={(e) => updateGameProps({ ...gameProps, limit: parseInt(e.target.value, 10) || 0 })}
					/>
				</Box>
			)}
			<Box>
				<TextField
					label="Length to Win or (Limit Mode) Gain Score:"
					variant="filled"
					value={winLength}
					onChange={(e) =>
						updateGameProps({
							...gameProps,
							winLength: parseInt(e.target.value, 10) || 0,
						})
					}
				/>
				<TextField
					label="Millisecond Delay Between Moves:"
					variant="filled"
					value={delay}
					onChange={(e) =>
						updateGameProps({
							...gameProps,
							delay: parseInt(e.target.value, 10) || 0,
						})
					}
				/>
			</Box>
			<Tabs
				value={socket === undefined ? 0 : 1}
				onChange={(_, value) => {
					if (value === 1) {
						const socket = new WebSocket(serverUrl);
						socket.addEventListener("open", () => {
							socket.send(
								JSON.stringify([
									{
										action: "CREATE_GAME",
										options: { limit },
									},
								])
							);
						});
						updateGameProps({
							...gameProps,
							socket,
						});
					} else {
						socket?.close();
						updateGameProps({
							...gameProps,
							socket: undefined,
						});
					}
				}}
			>
				<Tab label="Singleplayer" />
				<Tab label="Multiplayer (Beta)" />
			</Tabs>
			{socket === undefined && (
				<Box>
					<div style={{ border: "3px solid white" }}>
						{AINames.map((AIName, index) =>
							PlayerItem({
								AIName,
								index,
								iconConfig,
								removeItem,
								changeAI,
								canDelete,
								AIMenuOptions,
							})
						)}
					</div>
					{AINames.length < 4 && (
						<Button
							onClick={() => {
								updateGameProps({
									...gameProps,
									AINames: [...AINames, "player"],
								});
							}}
						>
							Add Player
						</Button>
					)}
				</Box>
			)}
			<Button variant="contained" onClick={startGame}>
				Play!
			</Button>
		</div>
	);
}

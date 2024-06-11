import { Box, Button, Checkbox, FormControlLabel, MenuItem, Select, SvgIcon, Tab, Tabs, TextField } from "@mui/material";
import React, { useState } from "react";
import { AppState, MultiplayerState } from "./AppState";
import "./Base.css";
import { GameProps } from "./GameProps";
import { IconConfig } from "./IconConfig";
import { serverUrl } from "./utils";

function setUpSocket(socket: WebSocket, setAppState: (appState: AppState) => void) {
	socket.addEventListener("message", (event) => {
		const data = JSON.parse(event.data);
		console.log(data);
		switch (data.action) {
			case "JOIN_FAILURE": {
				// const { message } = data;
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
				const { gameState, id, playerIndex, players } = data;
				setAppState({
					gameState,
					multiplayerState: {
						id,
						playerIndex,
						players,
					},
				});
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
	multiplayerState?: MultiplayerState;
	iconConfig: IconConfig;
	updateGameProps: (gameProps: GameProps) => void;
	startGame: () => void;
	setAppState: (appState: AppState) => void;
}

export function Menu({
	gameProps,
	multiplayerState,
	iconConfig,
	gameProps: { AISelectOptions, AINames, winLength, delay, limit, socket },
	updateGameProps,
	startGame,
	setAppState,
}: MenuProps) {
	const [tabValue, setTabValue] = useState(0);
	const [roomCode, setRoomCode] = useState("");
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
			<Tabs
				value={tabValue}
				onChange={(_, value) => {
					if (socket && (value === 2 || tabValue === 2)) {
						socket?.close();
						updateGameProps({
							...gameProps,
							socket: undefined,
						});
					}
					setTabValue(value);
				}}
			>
				<Tab label="Regular Mode" />
				<Tab label="Limit Mode" />
				<Tab label="Join Multiplayer Game (Beta)" />
			</Tabs>
			{tabValue !== 2 ? (
				<>
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
								setUpSocket(socket, setAppState);
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
					{socket === undefined ? (
						<>
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
						</>
					) : (
						<Box style={{ color: "white" }}>
							<div>
								Room Code: <span style={{ fontWeight: "bold" }}>{multiplayerState?.id}</span>
							</div>
							<FormControlLabel
								control={
									<Checkbox
										checked={multiplayerState?.players[multiplayerState.playerIndex].isReady}
										onChange={() => {
											if (multiplayerState?.players[multiplayerState.playerIndex].isReady) {
												socket.send(
													JSON.stringify([
														{
															action: "READY_DOWN",
															id: multiplayerState?.id,
														},
													])
												);
											} else {
												socket.send(
													JSON.stringify([
														{
															action: "READY_UP",
															id: multiplayerState?.id,
														},
													])
												);
											}
										}}
									/>
								}
								label="Ready"
							/>
						</Box>
					)}
					<Button variant="contained" onClick={startGame}>
						Play!
					</Button>
				</>
			) : (
				<>
					{!socket ? (
						<Box>
							<TextField label="Room Code" variant="filled" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
							<Button
								variant="contained"
								onClick={() => {
									const socket = new WebSocket(serverUrl);
									socket.addEventListener("open", () => {
										socket.send(
											JSON.stringify([
												{
													action: "JOIN_GAME",
													id: roomCode,
												},
											])
										);
									});
									setUpSocket(socket, setAppState);
									updateGameProps({
										...gameProps,
										socket,
									});
								}}
							>
								Join Room
							</Button>
						</Box>
					) : (
						<Box style={{ color: "white" }}>
							<div style={{ color: "white" }}>
								Room Code: <span style={{ fontWeight: "bold" }}>{multiplayerState?.id}</span>
							</div>
							<FormControlLabel
								control={
									<Checkbox
										checked={multiplayerState?.players[multiplayerState.playerIndex]?.isReady}
										onChange={() => {
											if (multiplayerState?.players[multiplayerState.playerIndex]?.isReady) {
												socket.send(
													JSON.stringify([
														{
															action: "READY_DOWN",
															id: multiplayerState?.id,
														},
													])
												);
											} else {
												socket.send(
													JSON.stringify([
														{
															action: "READY_UP",
															id: multiplayerState?.id,
														},
													])
												);
											}
										}}
									/>
								}
								label="Ready"
							/>
						</Box>
					)}
				</>
			)}
		</div>
	);
}

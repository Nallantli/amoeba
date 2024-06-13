import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Checkbox, FormControlLabel, MenuItem, Select, SvgIcon, Tab, Tabs, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { AppState, MultiplayerState } from "./AppState";
import "./Base.css";
import { GameProps } from "./GameProps";
import { IconConfig } from "./IconConfig";
import { serverUrl } from "./utils";

function setUpSocket(socket: WebSocket, setAppState: (appState: AppState) => void, closeSocket: () => void, startClientGame: () => void) {
	socket.addEventListener("message", (event) => {
		const data = JSON.parse(event.data);
		console.log(data);
		switch (data.action) {
			case "JOIN_FAILURE": {
				// const { message } = data;
				// TODO
				closeSocket();
				break;
			}
			case "START": {
				// TODO
				startClientGame();
				break;
			}
			case "WIN": {
				// TODO
				closeSocket();
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
		<div style={{ padding: "5px", border: "1px solid white", display: "flex", alignItems: "center" }}>
			<SvgIcon sx={{ margin: 1 }}>
				{React.createElement(iconConfig.playerIcons[index], {
					color: iconConfig.playerColors[index],
				})}
			</SvgIcon>
			<Select sx={{ margin: 1 }} variant="filled" id={`p${index + 1}`} value={AIName} onChange={(e) => changeAI(index, e.target.value)}>
				<MenuItem value="player">No AI</MenuItem>
				{AIMenuOptions.map((selectOption) => (
					<MenuItem value={selectOption}>{selectOption}</MenuItem>
				))}
			</Select>
			{canDelete && (
				<Button sx={{ margin: 1 }} onClick={() => removeItem(index)}>
					Remove
				</Button>
			)}
		</div>
	);
}

interface MultiplayerDialogProps {
	iconConfig: IconConfig;
	multiplayerState?: MultiplayerState;
	socket: WebSocket;
}

function MultiplayerDialog({ iconConfig, multiplayerState, socket }: MultiplayerDialogProps) {
	const isHost = multiplayerState?.players[multiplayerState.playerIndex].isHost;
	return (
		<div>
			{multiplayerState?.players.map(({ isReady }, index) => (
				<Box
					style={{
						display: "flex",
						alignItems: "center",
						background: multiplayerState.playerIndex === index ? "#203645" : "rgb(54, 54, 54)",
						borderRadius: "5px",
						margin: "10px",
						padding: "5px",
						position: "relative",
					}}
				>
					<SvgIcon sx={{ margin: 1 }}>
						{React.createElement(iconConfig.playerIcons[index], {
							color: iconConfig.playerColors[index],
						})}
					</SvgIcon>
					<Typography sx={{ margin: 1 }} style={{ fontWeight: multiplayerState.playerIndex === index ? "bold" : "normal" }}>
						{isReady ? "READY" : "NOT READY"}
					</Typography>
					{isHost && (
						<div style={{ display: "flex", flexDirection: "column", right: "5px", position: "absolute" }}>
							<Button
								disabled={index === 0}
								style={{ fontSize: "20px", height: "20px" }}
								onClick={() =>
									socket.send(
										JSON.stringify([
											{
												action: "MOVE_DOWN",
												id: multiplayerState?.id,
												pos: index,
											},
										])
									)
								}
							>
								<FontAwesomeIcon icon={faCaretUp} />
							</Button>
							<Button
								disabled={index === multiplayerState.players.length - 1}
								style={{ fontSize: "20px", height: "20px" }}
								onClick={() =>
									socket.send(
										JSON.stringify([
											{
												action: "MOVE_UP",
												id: multiplayerState?.id,
												pos: index,
											},
										])
									)
								}
							>
								<FontAwesomeIcon icon={faCaretDown} />
							</Button>
						</div>
					)}
				</Box>
			))}
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
	closeSocket: () => void;
	startClientGame: () => void;
}

export function Menu({
	gameProps,
	multiplayerState,
	iconConfig,
	gameProps: { AISelectOptions, AINames, winLength, delay, limit, socket },
	updateGameProps,
	startGame,
	setAppState,
	closeSocket,
	startClientGame,
}: MenuProps) {
	const [tabValue, setTabValue] = useState(socket && !multiplayerState?.players[multiplayerState.playerIndex].isHost ? 2 : 0);
	const [roomCode, setRoomCode] = useState(multiplayerState?.id || "");
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
		<div style={{ background: "#222", padding: "15px", borderRadius: "10px", maxWidth: "600px" }}>
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
					if (tabValue === 1 && value !== 1) {
						updateGameProps({
							...gameProps,
							limit: 0,
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
								sx={{ margin: 1 }}
								label="Maximum Amount of Rounds"
								variant="filled"
								value={limit}
								onChange={(e) => updateGameProps({ ...gameProps, limit: parseInt(e.target.value, 10) || 0 })}
							/>
						</Box>
					)}
					<Box>
						<TextField
							sx={{ margin: 1 }}
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
							sx={{ margin: 1 }}
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
								setUpSocket(socket, setAppState, closeSocket, startClientGame);
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
						<Tab label="Host Multiplayer (Beta)" />
					</Tabs>
					{socket === undefined ? (
						<>
							<Box sx={{ margin: 1 }}>
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
										sx={{ margin: 1 }}
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
							<Typography sx={{ margin: 1 }}>
								Room Code: <span style={{ fontWeight: "bold" }}>{multiplayerState?.id}</span>
							</Typography>
							<MultiplayerDialog iconConfig={iconConfig} multiplayerState={multiplayerState} socket={socket} />
							<FormControlLabel
								control={
									<Checkbox
										sx={{ margin: 1 }}
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
					<Button
						sx={{ margin: 1 }}
						variant="contained"
						onClick={startGame}
						disabled={!socket ? false : multiplayerState?.players && multiplayerState?.players.filter(({ isReady }) => !isReady).length > 0}
					>
						Start New Game
					</Button>
				</>
			) : (
				<>
					{!socket ? (
						<Box>
							<TextField sx={{ margin: 1 }} label="Room Code" variant="filled" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
							<Button
								sx={{ margin: 1 }}
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
									setUpSocket(socket, setAppState, closeSocket, startClientGame);
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
							<Typography sx={{ margin: 1 }} style={{ color: "white" }}>
								Room Code: <span style={{ fontWeight: "bold" }}>{multiplayerState?.id}</span>
							</Typography>
							<MultiplayerDialog iconConfig={iconConfig} multiplayerState={multiplayerState} socket={socket} />
							<FormControlLabel
								control={
									<Checkbox
										sx={{ margin: 1 }}
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

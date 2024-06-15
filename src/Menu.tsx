import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	FormControlLabel,
	MenuItem,
	Select,
	SvgIcon,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import { MultiplayerState } from "./MultiplayerState";
import "./Base.css";
import { GameProps, LocalGameProps } from "./GameProps";
import { GameState } from "./GameState";
import { IconConfig } from "./IconConfig";
import { serverUrl } from "./utils";

function setUpSocket(
	socket: WebSocket,
	setGameState: (gameState: GameState) => void,
	setMultiplayerState: (multiplayerState: MultiplayerState) => void,
	setGameProps: (gameProps: GameProps) => void,
	closeSocket: () => void,
	startClientGame: () => void,
	clientSocketClosed: () => void,
	checkMPWin: (gameState: GameState, multiplayerState: MultiplayerState) => [boolean, number?]
) {
	socket.addEventListener("message", (event) => {
		const data = JSON.parse(event.data);
		switch (data.action) {
			case "JOIN_FAILURE": {
				// const { message } = data;
				// TODO
				closeSocket();
				break;
			}
			case "START": {
				const { gameProps } = data;
				setGameProps(gameProps);
				startClientGame();
				break;
			}
			case "CLOSE": {
				clientSocketClosed();
				closeSocket();
				break;
			}
			// @ts-ignore
			case "STATE_UPDATE_MOVE": {
				const { gameState, id, playerIndex, players } = data;
				const [win, winner] = checkMPWin(gameState, {
					id,
					playerIndex,
					players,
				});
				if (win && players[playerIndex].isHost) {
					socket.send(
						JSON.stringify([
							{
								action: "END_GAME",
								id,
								winner,
							},
						])
					);
				} else {
					setGameState(gameState);
					setMultiplayerState({
						id,
						playerIndex,
						players,
					});
				}
				break;
			}
			case "STATE_UPDATE": {
				const { gameState, id, playerIndex, players } = data;
				if (players.length < 2 && gameState.status === 1) {
					socket.send(
						JSON.stringify([
							{
								action: "END_GAME",
								id,
								winner: 0,
							},
						])
					);
				} else {
					setGameState(gameState);
					setMultiplayerState({
						id,
						playerIndex,
						players,
					});
				}
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
	status: number;
}

function MultiplayerDialog({ iconConfig, multiplayerState, socket, status }: MultiplayerDialogProps) {
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
								disabled={index === 0 || status === 1}
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
								disabled={index === multiplayerState.players.length - 1 || status === 1}
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

function canStartGame(socket?: WebSocket, multiplayerState?: MultiplayerState, gameState?: GameState) {
	if (socket === undefined) {
		return true;
	}
	if (gameState?.status === 1) {
		return false;
	}
	if (multiplayerState?.players && multiplayerState?.players.filter(({ isReady }) => !isReady).length > 0) {
		return false;
	}
	if (multiplayerState?.players && multiplayerState?.players.length < 2) {
		return false;
	}
	return true;
}

interface MenuProps {
	gameState?: GameState;
	multiplayerState?: MultiplayerState;
	gameProps: GameProps;
	setGameProps: (gameProps: GameProps) => void;
	iconConfig: IconConfig;
	localGameProps: LocalGameProps;
	setLocalGameProps: (localGameProps: LocalGameProps) => void;
	startGame: () => void;
	setMultiplayerState: (multiplayerState: MultiplayerState) => void;
	setGameState: (gameState: GameState) => void;
	closeSocket: () => void;
	startClientGame: () => void;
	clientSocketClosed: () => void;
	checkMPWin: (gameState: GameState, multiplayerState: MultiplayerState) => [boolean, number?];
}

export function Menu({
	gameState,
	iconConfig,
	gameProps,
	gameProps: { winLength, delay, limit },
	multiplayerState,
	localGameProps,
	localGameProps: { socket, AINames, AISelectOptions },
	setLocalGameProps,
	setGameProps,
	setGameState,
	setMultiplayerState,
	startGame,
	closeSocket,
	startClientGame,
	clientSocketClosed,
	checkMPWin,
}: MenuProps) {
	const [tabValue, setTabValue] = useState(socket && !multiplayerState?.players[multiplayerState.playerIndex].isHost ? 2 : 0);
	const [roomCode, setRoomCode] = useState(multiplayerState?.id || "");

	const [disconnectSocketDialog, setDisconnectSocketDialog] = useState(false);
	const [proceedTabValue, setProceedTabValue] = useState(-1);

	const removeItem = (index: number) => {
		let newAINames = [...AINames];
		newAINames.splice(index, 1);
		setLocalGameProps({
			...localGameProps,
			AINames: newAINames,
		});
	};
	const changeAI = (index: number, value: string) => {
		let newAINames = [...AINames];
		newAINames[index] = value;
		setLocalGameProps({
			...localGameProps,
			AINames: newAINames,
		});
	};
	const canDelete = AINames.length > 1;
	const AIMenuOptions = Object.keys(AISelectOptions);
	return (
		<>
			<Tabs
				value={tabValue}
				onChange={(_, value) => {
					if (socket && ((value !== 2 && tabValue === 2) || (value === 2 && tabValue !== 2))) {
						setDisconnectSocketDialog(true);
						setProceedTabValue(value);
						return;
					}
					if (tabValue === 1 && value !== 1) {
						setGameProps({
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
								onChange={(e) => setGameProps({ ...gameProps, limit: parseInt(e.target.value, 10) || 0 })}
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
								setGameProps({
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
								setGameProps({
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
								setUpSocket(socket, setGameState, setMultiplayerState, setGameProps, closeSocket, startClientGame, clientSocketClosed, checkMPWin);
								setLocalGameProps({
									...localGameProps,
									socket,
								});
							} else {
								if (socket) {
									setDisconnectSocketDialog(true);
									setProceedTabValue(-1);
								}
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
											setLocalGameProps({
												...localGameProps,
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
							<MultiplayerDialog iconConfig={iconConfig} multiplayerState={multiplayerState} socket={socket} status={gameState?.status || 0} />
							<FormControlLabel
								control={
									<Checkbox
										sx={{ margin: 1 }}
										disabled={gameState?.status === 1}
										checked={multiplayerState?.players[multiplayerState.playerIndex].isReady || false}
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
					<Button sx={{ margin: 1 }} variant="contained" onClick={startGame} disabled={!canStartGame(socket, multiplayerState, gameState)}>
						Start New Game
					</Button>
				</>
			) : (
				<>
					{!socket ? (
						<>
							<Box>
								<TextField
									sx={{ margin: 1 }}
									label="Room Code"
									variant="filled"
									value={roomCode}
									inputProps={{ style: { textTransform: "uppercase" } }}
									onChange={(e) => setRoomCode(e.target.value)}
								/>
							</Box>
							<Box>
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
														id: roomCode.toUpperCase(),
													},
												])
											);
										});
										setUpSocket(socket, setGameState, setMultiplayerState, setGameProps, closeSocket, startClientGame, clientSocketClosed, checkMPWin);
										setLocalGameProps({
											...localGameProps,
											socket,
										});
									}}
								>
									Join Room
								</Button>
							</Box>
						</>
					) : (
						<Box style={{ color: "white" }}>
							<Typography sx={{ margin: 1 }} style={{ color: "white" }}>
								Room Code: <span style={{ fontWeight: "bold" }}>{multiplayerState?.id}</span>
							</Typography>
							<MultiplayerDialog iconConfig={iconConfig} multiplayerState={multiplayerState} socket={socket} status={gameState?.status || 0} />
							<FormControlLabel
								control={
									<Checkbox
										sx={{ margin: 1 }}
										disabled={gameState?.status === 1}
										checked={multiplayerState?.players[multiplayerState.playerIndex]?.isReady || false}
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
			<Dialog open={disconnectSocketDialog} onClose={() => setDisconnectSocketDialog(false)}>
				<DialogContent>
					<DialogContentText>Are you sure you want to disconnect from the current multiplayer game?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDisconnectSocketDialog(false)}>Cancel</Button>
					<Button
						onClick={() => {
							closeSocket();
							setDisconnectSocketDialog(false);
							if (proceedTabValue >= 0) {
								setTabValue(proceedTabValue);
							}
						}}
						autoFocus
					>
						Proceed
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

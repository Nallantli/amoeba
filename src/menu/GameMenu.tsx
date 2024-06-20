import {
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	FormControlLabel,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { GameProps, LocalGameProps } from "../GameProps";
import { GameState } from "../GameState";
import { IconConfig } from "../IconConfig";
import { MultiplayerState } from "../MultiplayerState";
import { setUpSocket } from "../utils";
import { MultiplayerDialog } from "./MultiplayerDialog";
import { PlayerItem } from "./PlayerItem";
import { serverUrl } from "../Constants";

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

export function GameMenu({
	gameState,
	iconConfig,
	gameProps,
	gameProps: { winLength, delay, limit, playerName },
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
	const [multiplayerNameDialog, setMultiplayerNameDialog] = useState(0);
	const [proceedTabValue, setProceedTabValue] = useState(-1);

	useEffect(() => {
		if (playerName && playerName != "") {
		}
	}, [playerName]);

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
								setMultiplayerNameDialog(1);
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
									{AINames.map((AIName, index) => (
										<PlayerItem
											AIName={AIName}
											index={index}
											iconConfig={iconConfig}
											removeItem={removeItem}
											changeAI={changeAI}
											canDelete={canDelete}
											AIMenuOptions={AIMenuOptions}
										/>
									))}
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
								<Button sx={{ margin: 1 }} variant="contained" onClick={() => setMultiplayerNameDialog(2)}>
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
			<Dialog open={multiplayerNameDialog > 0}>
				<DialogContent>
					<TextField
						autoFocus
						variant="filled"
						value={playerName}
						onChange={(e) => setGameProps({ ...gameProps, playerName: e.target.value })}
						label="Enter a name for multiplayer"
					></TextField>
				</DialogContent>
				<DialogActions sx={{ justifyContent: "center" }}>
					<Button
						variant="contained"
						onClick={() => {
							switch (multiplayerNameDialog) {
								case 1: {
									const socket = new WebSocket(serverUrl);
									socket.addEventListener("open", () => {
										socket.send(
											JSON.stringify([
												{
													action: "CREATE_GAME",
													options: { limit, playerName },
												},
											])
										);
									});
									setUpSocket(
										socket,
										setGameState,
										setMultiplayerState,
										setGameProps,
										closeSocket,
										startClientGame,
										clientSocketClosed,
										checkMPWin
									);
									setLocalGameProps({
										...localGameProps,
										socket,
									});
									break;
								}
								case 2: {
									const socket = new WebSocket(serverUrl);
									socket.addEventListener("open", () => {
										socket.send(
											JSON.stringify([
												{
													action: "JOIN_GAME",
													id: roomCode.toUpperCase(),
													playerName,
												},
											])
										);
									});
									setUpSocket(
										socket,
										setGameState,
										setMultiplayerState,
										setGameProps,
										closeSocket,
										startClientGame,
										clientSocketClosed,
										checkMPWin
									);
									setLocalGameProps({
										...localGameProps,
										socket,
									});
									break;
								}
							}
							setMultiplayerNameDialog(0);
						}}
					>
						Accept
					</Button>
					<Button variant="outlined" onClick={() => setMultiplayerNameDialog(0)}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
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

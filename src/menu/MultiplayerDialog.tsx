import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, SvgIcon, Typography } from "@mui/material";
import React from "react";
import { IconConfig } from "../IconConfig";
import { MultiplayerState } from "../MultiplayerState";

interface MultiplayerDialogProps {
	iconConfig: IconConfig;
	multiplayerState?: MultiplayerState;
	socket: WebSocket;
	status: number;
}

export function MultiplayerDialog({ iconConfig, multiplayerState, socket, status }: MultiplayerDialogProps) {
	const isHost = multiplayerState?.players[multiplayerState.playerIndex].isHost;
	return (
		<div>
			{multiplayerState?.players.map(({ isReady, name }, index) => (
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
					<Typography sx={{ margin: 1 }} style={{ fontWeight: multiplayerState.playerIndex === index ? "bold" : "normal", fontStyle: "italic" }}>
						{name}
					</Typography>
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
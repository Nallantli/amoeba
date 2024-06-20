import { AppBar, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, Modal, Toolbar, Typography } from "@mui/material";
import React from "react";
import Crossfire from "react-canvas-confetti/dist/presets/crossfire";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import { buttonAudio, loseSoundAudio, startAudio, winSoundAudio } from "../utils/Constants";
import { checkWin, generateInitialGameState } from "../utils/Helpers";
import ThemeSelector from "../utils/ThemeSelector";
import { AttAndDef } from "../ais/AttAndDef";
import { Elk } from "../ais/Elk";
import { ElkAtt } from "../ais/ElkAtt";
import { ElkDef } from "../ais/ElkDef";
import { ElkSurf } from "../ais/ElkSurf";
import { ElkTimid } from "../ais/ElkTimid";
import { Fuzzy } from "../ais/Fuzzy";
import { CircleIcon } from "../icons/CircleIcon";
import { CrossIcon } from "../icons/CrossIcon";
import { DiamondIcon } from "../icons/DiamondIcon";
import { SquareIcon } from "../icons/SquareIcon";
import { GameController } from "../game/GameController";
import { GameMenu } from "../menu/GameMenu";
import { GameSettings, LocalGameSettings } from "../state/GameSettings";
import { GameState } from "../state/GameState";
import { MultiplayerState } from "../state/MultiplayerState";
import "./Base.css";
import { MultiplayerPanel } from "./MultiplayerPanel";

const AISelectOptions: { [key: string]: any } = {
	fuzzy: Fuzzy,
	elk: Elk,
	elkatt: ElkAtt,
	elkdef: ElkDef,
	elksurf: ElkSurf,
	elktimid: ElkTimid,
	attanddef: AttAndDef,
};

const params = new URLSearchParams(window.location.search);

const iconConfig = {
	playerColors: ["#5588ff", "#ff3344", "#33ff44", "#ffcc33"],
	playerIcons: [CircleIcon, CrossIcon, DiamondIcon, SquareIcon],
};

interface AppState {
	gameOpen: boolean;
	socketClosedOpen: boolean;
	gameSettings: GameSettings;
	localGameSettings: LocalGameSettings;
	gameState?: GameState;
	multiplayerState?: MultiplayerState;
	confettiConductor: TConductorInstance | undefined;
	fadeIn: boolean;
	winnerBar?: [number, string];
}

export class App extends React.Component<{}, AppState> {
	constructor(props: {}) {
		super(props);

		this.state = {
			gameOpen: false,
			socketClosedOpen: false,
			gameSettings: {
				winLength: 5,
				limit: 0,
				delay: 0,
			},
			localGameSettings: {
				AINames: ["player", "player"],
				AISelectOptions: AISelectOptions,
			},
			confettiConductor: undefined,
			fadeIn: false,
		};

		this.closeSocket = this.closeSocket.bind(this);
		this.startClientGame = this.startClientGame.bind(this);
		this.clientSocketClosed = this.clientSocketClosed.bind(this);
		this.checkMPWin = this.checkMPWin.bind(this);
		this.startGame = this.startGame.bind(this);
	}

	closeSocket() {
		this.setState(({ localGameSettings, localGameSettings: { socket } }) => {
			socket?.close();
			return {
				winnerBar: undefined,
				multiplayerState: undefined,
				localGameSettings: {
					...localGameSettings,
					socket: undefined,
				},
			};
		});
	}

	startClientGame() {
		startAudio.play();
		this.setState({
			winnerBar: undefined,
			gameOpen: true,
		});
	}

	clientSocketClosed() {
		this.setState({
			socketClosedOpen: true,
		});
	}

	checkMPWin(newGameState: GameState, newMultiplayerState: MultiplayerState): [boolean, number?] {
		const {
			gameSettings: { winLength },
			multiplayerState,
			confettiConductor,
		} = this.state;
		if (newGameState) {
			const [win, _, winner] = checkWin(newGameState, winLength);
			if (win) {
				if (winner === newMultiplayerState?.playerIndex) {
					winSoundAudio.play();
					confettiConductor?.shoot();
				} else {
					loseSoundAudio.play();
				}
				this.setState({
					winnerBar: winner !== undefined ? [winner, multiplayerState?.players[winner]?.name || ""] : undefined,
				});
				setTimeout(
					() =>
						this.setState({
							gameOpen: false,
							fadeIn: true,
						}),
					1000
				);
				return [true, winner];
			} else {
				buttonAudio.play();
			}
		}
		return [false, undefined];
	}

	startGame() {
		const {
			localGameSettings,
			multiplayerState,
			gameSettings,
			localGameSettings: { socket },
		} = this.state;
		const initialGameState = generateInitialGameState(localGameSettings, gameSettings, multiplayerState);
		if (socket && multiplayerState?.players[multiplayerState?.playerIndex]?.isHost) {
			socket?.send(
				JSON.stringify([
					{
						action: "START_GAME",
						id: multiplayerState.id,
						gameState: initialGameState,
						gameSettings,
					},
				])
			);
		} else {
			startAudio.play();
			this.setState({
				winnerBar: undefined,
				gameOpen: true,
			});
			this.setState({
				gameOpen: true,
				gameState: initialGameState,
				multiplayerState: undefined,
			});
			if (initialGameState.players[0] !== null) {
				initialGameState.players[0]
					.doTurn(initialGameState)
					.then(({ x, y }) =>
						setTimeout(
							() => document.getElementById("board")?.dispatchEvent(new CustomEvent("selectSquare", { detail: { x: x, y: y } })),
							gameSettings.delay
						)
					);
			}
		}
	}

	render() {
		const {
			gameOpen,
			socketClosedOpen,
			gameState,
			multiplayerState,
			gameSettings,
			localGameSettings,
			localGameSettings: { socket },
			fadeIn,
			winnerBar,
		} = this.state;

		console.log(winnerBar);

		return (
			<ThemeSelector theme={params.get("theme") || "default"}>
				{gameState && (
					<GameController
						socket={socket}
						gameSettings={gameSettings}
						gameState={gameState}
						multiplayerState={multiplayerState}
						setGameState={(newGameState: GameState) => this.setState({ gameState: newGameState })}
						iconConfig={iconConfig}
					/>
				)}
				{multiplayerState && socket && <MultiplayerPanel iconConfig={iconConfig} multiplayerState={multiplayerState} />}
				<Modal
					className={fadeIn ? "fade-in" : undefined}
					open={!gameOpen}
					onClose={() =>
						this.setState({
							gameOpen: true,
							fadeIn: false,
						})
					}
					style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
				>
					<Box sx={{ background: "#222", borderRadius: "5px", maxWidth: "600px", overflow: "hidden" }}>
						{winnerBar !== undefined && (
							<AppBar position="static" sx={{ background: iconConfig.playerColors[winnerBar[0]] }}>
								<Toolbar>
									<Typography variant="h6" component={"div"} sx={{ flexGrow: 1 }}>
										{winnerBar[1]} wins!
									</Typography>
								</Toolbar>
							</AppBar>
						)}
						<Box sx={{ padding: "15px" }}>
							<GameMenu
								gameState={gameState}
								setGameState={(newGameState: GameState) => this.setState({ gameState: newGameState })}
								multiplayerState={multiplayerState}
								setMultiplayerState={(newMultiplayerState: MultiplayerState) => this.setState({ multiplayerState: newMultiplayerState })}
								gameSettings={gameSettings}
								setGameSettings={(newGameProps: GameSettings) => this.setState({ gameSettings: newGameProps })}
								localGameSettings={localGameSettings}
								iconConfig={iconConfig}
								startGame={this.startGame}
								setLocalGameSettings={(newLocalGameProps: LocalGameSettings) => this.setState({ localGameSettings: newLocalGameProps })}
								closeSocket={this.closeSocket}
								startClientGame={this.startClientGame}
								clientSocketClosed={this.clientSocketClosed}
								checkMPWin={this.checkMPWin}
							/>
						</Box>
					</Box>
				</Modal>
				<Crossfire
					onInit={({ conductor }: { conductor: TConductorInstance }) => {
						this.setState({
							confettiConductor: conductor,
						});
					}}
					style={{ width: "100vw", height: "100vh", zIndex: 99, position: "absolute", pointerEvents: "none" }}
				/>
				<button
					id="reset-button"
					onClick={() =>
						this.setState({
							gameOpen: false,
						})
					}
				>
					Open Menu
				</button>
				<Dialog
					open={socketClosedOpen}
					onClose={() => {
						this.setState({
							socketClosedOpen: false,
							gameOpen: false,
						});
					}}
				>
					<DialogContent>
						<DialogContentText>Host has disconnected.</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							autoFocus
							onClick={() => {
								this.setState({
									socketClosedOpen: false,
									gameOpen: false,
								});
							}}
						>
							Ok
						</Button>
					</DialogActions>
				</Dialog>
			</ThemeSelector>
		);
	}
}

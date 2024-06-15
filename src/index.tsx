import {
	AppBar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	Modal,
	ThemeProvider,
	Toolbar,
	Typography,
	createTheme,
} from "@mui/material";
import React from "react";
import Crossfire from "react-canvas-confetti/dist/presets/crossfire";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import ReactDOM from "react-dom";
import { GameController } from "./GameController";
import { GameProps, LocalGameProps } from "./GameProps";
import { GameState, checkWin } from "./GameState";
import { MPPanel } from "./MPPanel";
import { Menu } from "./Menu";
import { MultiplayerState } from "./MultiplayerState";
import ThemeSelector from "./ThemeSelector";
import { AttAndDef } from "./ais/AttAndDef";
import { Elk } from "./ais/Elk";
import { ElkAtt } from "./ais/ElkAtt";
import { ElkDef } from "./ais/ElkDef";
import { ElkSurf } from "./ais/ElkSurf";
import { ElkTimid } from "./ais/ElkTimid";
import { Fuzzy } from "./ais/Fuzzy";
import { CircleIcon } from "./assets/CircleIcon";
import { CrossIcon } from "./assets/CrossIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { SquareIcon } from "./assets/SquareIcon";
import reportWebVitals from "./reportWebVitals";
import { buttonAudio, generateInitialGameState, loseSoundAudio, startAudio, winSoundAudio } from "./utils";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
});

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

class App extends React.Component<
	{},
	{
		gameOpen: boolean;
		socketClosedOpen: boolean;
		gameProps: GameProps;
		localGameProps: LocalGameProps;
		gameState?: GameState;
		multiplayerState?: MultiplayerState;
		confettiConductor: TConductorInstance | undefined;
		fadeIn: boolean;
		winnerBar?: number;
	}
> {
	constructor(props: {}) {
		super(props);

		this.state = {
			gameOpen: false,
			socketClosedOpen: false,
			gameProps: {
				winLength: 5,
				limit: 0,
				delay: 0,
			},
			localGameProps: {
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
		this.setState(({ localGameProps, localGameProps: { socket } }) => {
			socket?.close();
			return {
				localGameProps: {
					...localGameProps,
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
			gameProps: { winLength },
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
					winnerBar: winner,
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
			localGameProps,
			multiplayerState,
			gameProps,
			localGameProps: { socket },
		} = this.state;
		const initialGameState = generateInitialGameState(localGameProps, gameProps, multiplayerState);
		if (socket && multiplayerState?.players[multiplayerState?.playerIndex]?.isHost) {
			socket?.send(
				JSON.stringify([
					{
						action: "START_GAME",
						id: multiplayerState.id,
						gameState: initialGameState,
						gameProps,
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
						setTimeout(() => document.getElementById("board")?.dispatchEvent(new CustomEvent("selectSquare", { detail: { x: x, y: y } })), gameProps.delay)
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
			gameProps,
			localGameProps,
			localGameProps: { socket },
			fadeIn,
			winnerBar,
		} = this.state;

		return (
			<ThemeProvider theme={darkTheme}>
				{gameState && (
					<ThemeSelector theme={params.get("theme") || "default"}>
						<GameController
							socket={socket}
							gameProps={gameProps}
							gameState={gameState}
							multiplayerState={multiplayerState}
							setGameState={(newGameState: GameState) => this.setState({ gameState: newGameState })}
							iconConfig={iconConfig}
						/>
					</ThemeSelector>
				)}
				{multiplayerState && socket && <MPPanel iconConfig={iconConfig} multiplayerState={multiplayerState} />}
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
							<AppBar position="static" sx={{ background: iconConfig.playerColors[winnerBar] }}>
								<Toolbar>
									<Typography variant="h6" component={"div"} sx={{ flexGrow: 1 }}>
										Player {winnerBar + 1} wins!
									</Typography>
								</Toolbar>
							</AppBar>
						)}
						<Box sx={{ padding: "15px" }}>
							<Menu
								gameState={gameState}
								setGameState={(newGameState: GameState) => this.setState({ gameState: newGameState })}
								multiplayerState={multiplayerState}
								setMultiplayerState={(newMultiplayerState: MultiplayerState) => this.setState({ multiplayerState: newMultiplayerState })}
								gameProps={gameProps}
								setGameProps={(newGameProps: GameProps) => this.setState({ gameProps: newGameProps })}
								localGameProps={localGameProps}
								iconConfig={iconConfig}
								startGame={this.startGame}
								setLocalGameProps={(newLocalGameProps: LocalGameProps) => this.setState({ localGameProps: newLocalGameProps })}
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
			</ThemeProvider>
		);
	}
}

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

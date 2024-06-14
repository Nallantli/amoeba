import { Modal, ThemeProvider, createTheme } from "@mui/material";
import React, { useState } from "react";
import Crossfire from "react-canvas-confetti/dist/presets/crossfire";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import ReactDOM from "react-dom";
import { AppState } from "./AppState";
import { GameController } from "./GameController";
import { GameProps } from "./GameProps";
import { GameState, checkWin } from "./GameState";
import { Menu } from "./Menu";
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
import { buttonAudio, calculateWinner, generateInitialGameState, loseSoundAudio, startAudio, winSoundAudio } from "./utils";

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

function App() {
	const [gameOpen, setGameOpen] = useState(false);

	const [gameProps, setGameProps] = useState<GameProps>({
		winLength: 5,
		limit: 0,
		delay: 0,
		AINames: ["player", "player"],
		AISelectOptions: AISelectOptions,
	});

	const [appState, setAppState] = useState<AppState>({});

	let confettiConductor: TConductorInstance | undefined;

	const onInitHandler = ({ conductor }: { conductor: TConductorInstance }) => {
		confettiConductor = conductor;
	};

	const closeSocket = () => {
		gameProps.socket?.close();
		setGameProps({
			...gameProps,
			socket: undefined,
		});
	};

	const startClientGame = () => {
		startAudio.play();
		setGameOpen(true);
	};

	const checkMPWin = (appState: AppState) => {
		const { gameState, multiplayerState } = appState;
		if (gameState) {
			const [win] = checkWin(gameState, gameProps.winLength);
			if (win) {
				if (calculateWinner(gameState, gameProps.winLength) === multiplayerState?.playerIndex) {
					winSoundAudio.play();
					confettiConductor?.shoot();
				} else {
					loseSoundAudio.play();
				}
			} else {
				buttonAudio.play();
			}
		}
	};

	const startGame = () => {
		const gameState = generateInitialGameState(gameProps, appState);
		if (gameProps.socket && appState.multiplayerState?.players[appState.multiplayerState?.playerIndex]?.isHost) {
			gameProps.socket?.send(
				JSON.stringify([
					{
						action: "START_GAME",
						id: appState.multiplayerState.id,
						gameState,
					},
				])
			);
		} else {
			startAudio.play();
			setGameOpen(true);
			setAppState({
				...appState,
				gameState: gameState,
				multiplayerState: undefined,
			});
			if (gameState.players[0] !== null) {
				gameState.players[0]
					.doTurn(gameState)
					.then(({ x, y }) =>
						setTimeout(() => document.getElementById("board")?.dispatchEvent(new CustomEvent("selectSquare", { detail: { x: x, y: y } })), gameProps.delay)
					);
			}
		}
	};

	return (
		<ThemeProvider theme={darkTheme}>
			{appState.gameState && (
				<ThemeSelector theme={params.get("theme") || "default"}>
					<GameController
						gameProps={gameProps}
						gameState={appState.gameState}
						appState={appState}
						setGameState={(gameState: GameState) => setAppState({ ...appState, gameState })}
						iconConfig={iconConfig}
					/>
				</ThemeSelector>
			)}
			<Modal open={!gameOpen} onClose={() => setGameOpen(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
				<Menu
					gameProps={gameProps}
					multiplayerState={appState.multiplayerState}
					updateGameProps={setGameProps}
					iconConfig={iconConfig}
					startGame={startGame}
					setAppState={setAppState}
					closeSocket={closeSocket}
					startClientGame={startClientGame}
					checkMPWin={checkMPWin}
				/>
			</Modal>
			<Crossfire onInit={onInitHandler} style={{ width: "100vw", height: "100vh", zIndex: 99, position: "absolute", pointerEvents: "none" }} />
			<button id="reset-button" onClick={() => setGameOpen(false)}>
				Open Menu
			</button>
		</ThemeProvider>
	);
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

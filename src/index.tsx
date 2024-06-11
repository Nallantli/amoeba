import { ThemeProvider, createTheme } from "@mui/material";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { GameController } from "./GameController";
import { GameProps } from "./GameProps";
import { Menu } from "./Menu";
import ThemeSelector from "./ThemeSelector";
import { AttAndDef } from "./ais/AttAndDef";
import { Elk } from "./ais/Elk";
import { ElkAtt } from "./ais/ElkAtt";
import { ElkDef } from "./ais/ElkDef";
import { ElkSurf } from "./ais/ElkSurf";
import { ElkTimid } from "./ais/ElkTimid";
import { Fuzzy } from "./ais/Fuzzy";
import { TicTacToeGPT } from "./ais/TicTacToeGPT";
import { CircleIcon } from "./assets/CircleIcon";
import { CrossIcon } from "./assets/CrossIcon";
import { DiamondIcon } from "./assets/DiamondIcon";
import { SquareIcon } from "./assets/SquareIcon";
import reportWebVitals from "./reportWebVitals";
import { GameState } from "./GameState";
import { generateInitialGameState } from "./utils";

const darkTheme = createTheme({
	palette: {
		mode: "dark",
	},
	spacing: 8,
});

const AISelectOptions: { [key: string]: any } = {
	fuzzy: Fuzzy,
	elk: Elk,
	elkatt: ElkAtt,
	elkdef: ElkDef,
	elksurf: ElkSurf,
	elktimid: ElkTimid,
	attanddef: AttAndDef,
	"tictactoe-gpt": TicTacToeGPT,
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

	const startGame = () => {
		setGameOpen(true);
	};

	return (
		<ThemeProvider theme={darkTheme}>
			{gameOpen ? (
				<ThemeSelector theme={params.get("theme") || "default"}>
					<GameController gameProps={gameProps} iconConfig={iconConfig} />
				</ThemeSelector>
			) : (
				<Menu gameProps={gameProps} updateGameProps={setGameProps} iconConfig={iconConfig} startGame={startGame} />
			)}
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

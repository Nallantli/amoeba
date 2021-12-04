import { Board } from './Board';
import { CircleIcon } from './assets/CircleIcon';
import { CrossIcon } from './assets/CrossIcon';
import { DiamondIcon } from './assets/DiamondIcon';
import { SquareIcon } from './assets/SquareIcon';
import { GameState } from './GameState';

function App(props: {
	params: any,
	gameState: GameState,
	broadcast: (gameState: GameState) => GameState,
	doLocalTurn: (gameState: GameState, boardRef: any, turnDelay: number) => void,
	canMove: (gameState: GameState) => boolean
}) {
	const { params, gameState, broadcast, doLocalTurn, canMove } = props;
	const delay = params.get('delay') ? parseInt(params.get('delay') as string, 10) : 0;

	return (<Board
		config={{
			playerColors: [
				'#5588ff',
				'#ff3344',
				"#33ff44",
				'#ffcc33'
			],
			playerIcons: [
				CircleIcon,
				CrossIcon,
				DiamondIcon,
				SquareIcon
			],
			turnDelay: delay
		}}
		gameState={gameState}
		broadcast={broadcast}
		doLocalTurn={doLocalTurn}
		canMove={canMove}
	/>);
}

export default App;

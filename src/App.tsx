import { Board } from './Board';
import { CircleIcon } from './assets/CircleIcon';
import { CrossIcon } from './assets/CrossIcon';
import { DiamondIcon } from './assets/DiamondIcon';
import { SquareIcon } from './assets/SquareIcon';

function App(props: any) {
	const { params, gameState } = props;
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
		params={params}
	/>);
}

export default App;

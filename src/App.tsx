import { Board } from './Board';
import { Menu } from './Menu';
import { CircleIcon } from './assets/CircleIcon';
import { CrossIcon } from './assets/CrossIcon';
import { DiamondIcon } from './assets/DiamondIcon';
import { SquareIcon } from './assets/SquareIcon';

function App(props: any) {
	const { params } = props;
	const winLength = params.get('win') ? parseInt(params.get('win') as string, 10) : 5;
	const playerCount = params.get('count') ? parseInt(params.get('count') as string, 10) : 2;
	const limit = params.get('limit') ? parseInt(params.get('limit') as string, 10) : 0;
	const delay = params.get('delay') ? parseInt(params.get('delay') as string, 10) : 0;

	switch (window.location.pathname) {
		default:
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
					]
				}}
				params={params}
				winLength={winLength}
				playerCount={playerCount}
				limit={limit}
				isLimited={limit > 0}
				turnDelay={delay}
			/>);
		case '/menu':
			return (<Menu
				params={params}
				winLength={winLength}
				playerCount={playerCount}
				limit={limit}
				isLimited={limit > 0}
				turnDelay={delay}
			/>);
	}
}

export default App;

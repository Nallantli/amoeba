import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import reportWebVitals from './reportWebVitals';
import ThemeSelector from './ThemeSelector';
import { CircleIcon } from './assets/CircleIcon';
import { CrossIcon } from './assets/CrossIcon';
import { DiamondIcon } from './assets/DiamondIcon';
import { SquareIcon } from './assets/SquareIcon';
import { Menu } from './Menu';
import App from './App';

const params = new URLSearchParams(window.location.search);

const openGame = params.get('game');

let winLength = params.get('win') ? parseInt(params.get('win') as string, 10) : 5;
let playerCount = params.get('count') ? parseInt(params.get('count') as string, 10) : 2;
let limit = params.get('limit') ? parseInt(params.get('limit') as string, 10) : 0;
let delay = params.get('delay') ? parseInt(params.get('delay') as string, 10) : 200;
let AINames = []
for (let i = 0; i < playerCount; i++) {
	AINames.push(params.get(`p${i + 1}`) || 'player');
}

let iconConfig = {
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
};

ReactDOM.render(
	<React.StrictMode>
		<ThemeSelector theme={params.get('theme') || 'default'}>
			{openGame ? <App
				winLength={winLength}
				limit={limit}
				delay={delay}
				AINames={AINames}
				iconConfig={iconConfig}
			/> : <Menu
				winLength={winLength}
				limit={limit}
				delay={delay}
				AINames={AINames}
				iconConfig={iconConfig}
			/>}
		</ThemeSelector>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

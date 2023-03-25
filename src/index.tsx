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
import { Fuzzy } from './ais/Fuzzy';
import { Elk } from './ais/Elk';
import { ElkAtt } from './ais/ElkAtt';
import { ElkDef } from './ais/ElkDef';
import { ElkSurf } from './ais/ElkSurf';
import { ElkTimid } from './ais/ElkTimid';
import { AttAndDef } from './ais/AttAndDef';

const AISelectOptions: { [key: string]: any } = {
	"fuzzy": Fuzzy,
	"elk": Elk,
	"elkatt": ElkAtt,
	"elkdef": ElkDef,
	"elksurf": ElkSurf,
	"elktimid": ElkTimid,
	"attanddef": AttAndDef
};

const params = new URLSearchParams(window.location.search);

const openGame = params.get('game');

const winLength = params.get('win') ? parseInt(params.get('win') as string, 10) : 5;
const playerCount = params.get('count') ? parseInt(params.get('count') as string, 10) : 2;
const limit = params.get('limit') ? parseInt(params.get('limit') as string, 10) : 0;
const delay = params.get('delay') ? parseInt(params.get('delay') as string, 10) : 0;
let AINames = []
for (let i = 0; i < playerCount; i++) {
	AINames.push(params.get(`p${i + 1}`) || 'player');
}

const iconConfig = {
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
				AISelectOptions={AISelectOptions}
			/> : <Menu
				winLength={winLength}
				limit={limit}
				delay={delay}
				AINames={AINames}
				iconConfig={iconConfig}
				AISelectOptions={AISelectOptions}
			/>}
		</ThemeSelector>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

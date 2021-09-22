import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemeSelector from './ThemeSelector';

const params = new URLSearchParams(window.location.search);

ReactDOM.render(
	<React.StrictMode>
		<ThemeSelector theme={params.get('theme') || 'default'}>
			<App params={params} />
		</ThemeSelector>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

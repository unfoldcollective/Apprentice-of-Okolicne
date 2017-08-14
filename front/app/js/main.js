import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

//Components
import App from './components/App.jsx';

//Mount app
const root = document.querySelector('#root');

ReactDOM.render(<App />, root);

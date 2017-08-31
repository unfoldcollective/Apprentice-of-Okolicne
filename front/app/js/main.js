import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

const body = document.querySelector('body');

if (PRODUCTION) {
  body.addEventListener(
    'MSHoldVisual',
    function(e) {
      e.preventDefault();
    },
    false
  );

  body.addEventListener(
    'contextmenu',
    function(e) {
      e.preventDefault();
    },
    false
  );
}

//Components
import App from './components/App.jsx';

//Mount app
const root = document.querySelector('#root');

ReactDOM.render(<App />, root);

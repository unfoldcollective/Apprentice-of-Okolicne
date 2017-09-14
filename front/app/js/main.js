import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

if (PRODUCTION) {
  const body = document.querySelector('body');

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

  body.style.cursor = 'none';

  body.addEventListener('touchstart', e => {
    if (e.touches > 2) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, false);
}

//Components
import App from './components/App.jsx';

//Mount app
const root = document.querySelector('#root');

ReactDOM.render(<App />, root);

import React from 'react';
import Button from '../../Button/Button.jsx';

const Key = ({ char, action }) =>
  <Button action={action}>
    {char}
  </Button>;

const Keyboard = ({ pushAction, popAction }) => {
  const chars = [
    '1234567890'.split(''),
    'QWERTZUIOP'.split(''),
    'ASDFGHJKL'.split(''),
    'YXCVBNM'.split('')
  ];

  const rows = chars.map((row, i) =>
    <div key={`row_${i}`}>
      {row.map((c, i) =>
        <Key key={`char_${i}`} char={c} action={pushAction.bind(null, c)} />
      )}
    </div>
  );

  return (
    <div>
      <div>
        {rows}
      </div>
      <div>
        <Key char="@" action={pushAction.bind(null, '@')} />
        <Key char="SPACE" action={pushAction.bind(null, ' ')} />
        <Key char="Delete" action={popAction} />
      </div>
    </div>
  );
};

export default Keyboard;

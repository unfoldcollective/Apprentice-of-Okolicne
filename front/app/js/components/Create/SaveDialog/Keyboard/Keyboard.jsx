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
        <Button key={`char_${i}`} char={c} action={pushAction.bind(null, c)}>{c}</Button>
      )}
    </div>
  );

  return (
    <div>
      <div>
        {rows}
      </div>
      <div>
        <Button action={pushAction.bind(null, '.')}>.</Button>
        <Button action={pushAction.bind(null, '@')}>@</Button>
        <Button action={pushAction.bind(null, ' ')}>SPACE</Button>

        <Button char="Delete" action={popAction}>DEL</Button>
      </div>
    </div>
  );
};

export default Keyboard;

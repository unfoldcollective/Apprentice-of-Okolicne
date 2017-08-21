import React from 'react';
import Button from '../../Button/Button.jsx';
import styles from './Keyboard.css';

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
        <Button className={styles.key} key={`char_${i}`} char={c} action={pushAction.bind(null, c)}>{c}</Button>
      )}
    </div>
  );

  return (
    <div>
      <div>
        {rows}
      </div>
      <div>
        <Button className={styles.key} action={pushAction.bind(null, '.')}>.</Button>
        <Button className={styles.key} action={pushAction.bind(null, '@')}>@</Button>
        <Button className={styles.space} action={pushAction.bind(null, ' ')}>SPACE</Button>

        <Button className={styles.widekey} char="Delete" action={popAction}>
          DEL
        </Button>
      </div>
    </div>
  );
};

export default Keyboard;

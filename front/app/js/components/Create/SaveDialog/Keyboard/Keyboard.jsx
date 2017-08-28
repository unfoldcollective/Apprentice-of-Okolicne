import React from 'react';
import Button from '../../Button/Button.jsx';
import styles from './Keyboard.css';
import cn from 'classnames';

export default class Keyboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      caps: true,
      chars: [
        '1234567890'.split(''),
        'QWERTZUIOP'.split(''),
        'ASDFGHJKL'.split(''),
        'YXCVBNM'.split('')
      ]
    };
  }

  render() {
    const rows = this.state.chars.map((row, i) =>
      <div key={`row_${i}`}>
        {row.map((c, i) => {
          c = this.state.caps ? c : c.toLowerCase();
          return (
            <Button
              className={styles.key}
              key={`char_${i}`}
              char={c}
              action={this.props.pushAction.bind(null, c)}
            >
              {c}
            </Button>
          );
        })}
      </div>
    );

    return (
      <div>
        <div>
          {rows}
        </div>
        <div>
          <Button
            className={cn(styles.widekey, styles.caps, {
              [styles.negative]: this.state.caps
            })}
            action={e => this.setState({ caps: !this.state.caps })}
          >
            CAPS
          </Button>
          <Button
            className={styles.key}
            action={this.props.pushAction.bind(null, '.')}
          >
            .
          </Button>
          <Button
            className={styles.space}
            action={this.props.pushAction.bind(null, ' ')}
          >

          </Button>

          <Button
            className={styles.key}
            action={this.props.pushAction.bind(null, '@')}
          >
            @
          </Button>
          <Button
            className={cn(styles.widekey, styles.delete)}
            char="Delete"
            action={this.props.popAction}
          />
        </div>
      </div>
    );
  }
}

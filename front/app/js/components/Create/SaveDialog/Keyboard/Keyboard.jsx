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

  componentWillReceiveProps(nextProps) {
    if(nextProps.forceLower) {
      this.setState({
        caps: false
      });
    }
  }

  render() {
    const rows = this.state.chars.map((row, j) =>
      <div key={`row_${j}`}>
        {row.map((c, i) => {
          c = this.state.caps ? c : c.toLowerCase();
          return (
            <Button
              className={cn(styles.key, {
                [styles.number]: j === 0
              })}
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
            className={cn(styles.widekey, {
              [styles.caps]: !this.state.caps,
              [styles.capsActive]: this.state.caps
            })}
            action={e => this.setState({ caps: !this.state.caps })}
          />
          <Button
            className={styles.key}
            action={this.props.pushAction.bind(null, '_')}
          >
            _
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
          />

          <Button
            className={styles.key}
            action={this.props.pushAction.bind(null, '@')}
          >
            @
          </Button>
          <Button
            className={styles.key}
            action={this.props.pushAction.bind(null, '-')}
          >
            -
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

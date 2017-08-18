import React from 'react';
import cn from 'classnames';

import Button from '../Button/Button.jsx';
import Keyboard from './Keyboard/Keyboard.jsx';

import styles from './SaveDialog.css';

export default class SaveDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      editing: 'title'
    };
  }

  pushAction(char) {
    const t = 'title';
    this.props.appendCharacterToTitle(t, char);
  }

  popAction() {
    const t = 'title';
    this.props.popCharacterFromTitle(t);
  }

  render() {
    return (
      <section className="SaveDialog">
        <header>
          <h2>
            Save your creation or{' '}
            <Button action={this.props.closeDialog}>Close</Button>
          </h2>
        </header>
        Title:
        <div
          className={cn(styles.input, {
            [styles.focused]: this.state.editing === 'title'
          })}
          onClick={e => this.setState({ editing: 'title' })}
        >
          {this.props.title}
        </div>
        Your email:
        <div
          className={cn(styles.input, {
            [styles.focused]: this.state.editing === 'email'
          })}
          onClick={e => this.setState({ editing: 'email' })}
        >
          {this.props.email}
        </div>
        <Keyboard
          pushAction={this.pushAction.bind(this)}
          popAction={this.popAction.bind(this)}
        />
        <Button action={this.props.save}>Save</Button>
      </section>
    );
  }
}

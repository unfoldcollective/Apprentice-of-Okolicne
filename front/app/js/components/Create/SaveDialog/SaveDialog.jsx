import React from 'react';
import Keyboard from './Keyboard/Keyboard.jsx';
import SideInfo from './SideInfo.jsx';
import cn from 'classnames';

import styles from './SaveDialog.css';

const emailRe = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

import { CSSTransitionGroup } from 'react-transition-group';

const DialogHeader = ({ title, subtitle, step }) =>
  <CSSTransitionGroup
    transitionName={{
      enter: styles.headerEnter,
      enterActive: styles.headerEnterActive,
      leave: styles.headerLeave,
      leaveActive: styles.headerLeaveActive
    }}
    transitionEnterTimeout={300}
    transitionLeaveTimeout={200}
  >
    <header className={styles.header} key={`header_${step}`}>
      <h3 className={styles.title}>
        {title}
      </h3>
      {subtitle
        ? <p>
            {subtitle}
          </p>
        : <p />}
    </header>
  </CSSTransitionGroup>;

const DialogInput = ({ value, hasError }) =>
  <div
    className={cn(styles.input, {
      [styles.inputError]: hasError
    })}
  >
    {value}
  </div>;

export default class SaveDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      hasError: false
    };
  }

  pushAction(char) {
    if (this.state.hasError) this.setState({ hasError: false });
    const { prop } = this.getFields();
    this.props.appendCharacterToTitle(prop, char);
  }

  popAction() {
    if (this.state.hasError) this.setState({ hasError: false });
    const { prop } = this.getFields();
    this.props.popCharacterFromTitle(prop);
  }

  getFields() {
    switch (this.state.step) {
      case 1:
        return {
          prop: 'name',
          title: 'Your name',
          subtitle: 'Required',
          value: this.props.name
        };
      case 2:
        return {
          prop: 'town',
          title: 'Your home town',
          subtitle: 'Required',
          value: this.props.town
        };
      case 3:
        return {
          prop: 'email',
          title: 'Your email',
          subtitle: 'Optional but must be valid if present',
          value: this.props.email
        };
    }
  }

  setError() {
    this.setState({
      hasError: true
    });
  }

  nextStep() {
    const { value } = this.getFields();

    if (!value.length) {
      this.setError();
      return;
    }

    if (this.state.step === 3) {
      if (value.length && !value.match(emailRe)) {
        this.setError();
        return;
      }
      this.props.save();
    } else {
      this.setState({ step: this.state.step + 1 });
    }
  }

  render() {
    const { title, value, subtitle } = this.getFields();

    return (
      <div className={styles.dialog}>
        <div className={styles.formBox}>
          <section className={styles.form}>
            <div className={styles.headerBox}>
              <DialogHeader {...{ title, subtitle, step: this.state.step }} />
            </div>

            <DialogInput hasError={this.state.hasError} value={value} />
            <Keyboard
              pushAction={this.pushAction.bind(this)}
              popAction={this.popAction.bind(this)}
            />
          </section>
        </div>
        <SideInfo
          closeDialog={this.props.closeDialog}
          nextStep={this.nextStep.bind(this)}
          saveStep={this.state.step === 3}
        />
      </div>
    );
  }
}

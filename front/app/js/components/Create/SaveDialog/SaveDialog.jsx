import React from 'react';
import Keyboard from './Keyboard/Keyboard.jsx';
import SideInfo from './SideInfo.jsx';
import cn from 'classnames';

import T from 'i18n-react';

import styles from './SaveDialog.css';

const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

import { CSSTransitionGroup } from 'react-transition-group';

const DialogHeader = ({ title, subtitle, step }) => (
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
      <h3 className={styles.title}>{title}</h3>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : <p />}
    </header>
  </CSSTransitionGroup>
);

const DialogInput = ({ value, hasError }) => (
  <div
    className={cn(styles.input, {
      [styles.inputError]: hasError
    })}
  >
    {value}
  </div>
);

export default class SaveDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      hasError: false,
      saving: false
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
          title: T.translate('save.form.name'),
          subtitle: T.translate('save.form.required'),
          value: this.props.name
        };
      case 2:
        return {
          prop: 'email',
          title: T.translate('save.form.email'),
          subtitle: T.translate('save.form.optional'),
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

    if (this.state.step !== 2 && !value.length) {
      this.setError();
      return;
    }

    if (this.state.step === 2) {
      if (value.length && !value.match(emailRe)) {
        this.setError();
        return;
      }

      this.setState({
        saving: true
      });

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
              forceLower={value.length === 1}
              pushAction={this.pushAction.bind(this)}
              popAction={this.popAction.bind(this)}
            />
          </section>
        </div>
        <SideInfo
          setExitMode={this.props.setExitMode}
          processing={this.props.processing}
          closeDialog={this.props.closeDialog}
          nextStep={this.nextStep.bind(this)}
          saveStep={this.state.step === 2}
          saving={this.state.saving}
        />
      </div>
    );
  }
}

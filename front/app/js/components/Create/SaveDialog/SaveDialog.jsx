import React from 'react';
import Keyboard from './Keyboard/Keyboard.jsx';
import SideInfo from './SideInfo.jsx';

import styles from './SaveDialog.css';

export default class SaveDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1
    };
  }

  pushAction(char) {
    const { prop } = this.getFields();
    this.props.appendCharacterToTitle(prop, char);
  }

  popAction() {
    const { prop } = this.getFields();
    this.props.popCharacterFromTitle(prop);
  }

  getFields() {
    switch (this.state.step) {
      case 1:
        return {
          prop: 'title',
          title: 'Your name',
          value: this.props.title
        };
      case 2:
        return {
          prop: 'email',
          title: 'Your email',
          value: this.props.email
        };
      case 3:
        return {
          prop: 'town',
          title: 'Your home town',
          value: this.props.town
        };
    }
  }

  nextStep() {
    if (this.state.step === 3) {
      this.props.save();
    } else {
      this.setState({ step: this.state.step + 1 });
    }
  }

  render() {
    const { title, value } = this.getFields();

    return (
      <div className={styles.dialog}>
        <section className={styles.form}>
          <div className={styles.fieldset}>
            <h3 className={styles.title}>
              {title}
            </h3>
            <div className={styles.input}>
              {value}
            </div>
            <Keyboard
              pushAction={this.pushAction.bind(this)}
              popAction={this.popAction.bind(this)}
            />
          </div>
        </section>
        <SideInfo
          closeDialog={this.props.closeDialog}
          nextStep={this.nextStep.bind(this)}
          saveStep={this.state.step === 3}
        />
      </div>
    );
  }
}

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
          title: 'Title of your creation',
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
          title: 'Your town of origin',
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
      <div>
        <section className={styles.dialog}>
          <div>
            <h3>
              {title}
            </h3>
            <div>
              {value}
            </div>
          </div>
          <Keyboard
            pushAction={this.pushAction.bind(this)}
            popAction={this.popAction.bind(this)}
          />
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

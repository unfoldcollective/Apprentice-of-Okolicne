import React from 'react';
import superagent from 'superagent';
import { CSSTransitionGroup } from 'react-transition-group';
import { withRouter } from 'react-router';

import Canvas from './Canvas/Canvas.jsx';
import Palette from './Palette/Palette.jsx';
import Overlay from '../Overlay/Overlay.jsx';
import SaveDialog from './SaveDialog/SaveDialog.jsx';

import styles from './Create.css';

import { patterns, exteriors, figures } from '../../../data/parts.json';

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      isDragging: false,
      feedbackOk: false,
      feedbackContinue: false,
      finishedFeedback: false,
      saving: false,
      name: [],
      town: [],
      email: [],
      objects: {
        pattern: null,
        exterior: null,
        figures: []
      }
    };
  }

  getPaletteData(step) {
    let data;
    let add;
    let helpVideo = 'dragdrop.mp4';
    let cl = 'pext';

    switch (step) {
      case 1:
        data = patterns;
        add = this.setPattern.bind(this);
        break;
      case 2:
        data = exteriors;
        add = this.setExterior.bind(this);
        break;
      case 3:
        cl = 'figures';
        data = figures;
        helpVideo = 'figurecontrol.mp4';
        add = this.addFigure.bind(this);
        break;
    }

    return { data, add, cl, helpVideo };
  }

  canContinue(step) {
    if (step === 1 && this.state.objects.pattern && this.state.finishedFeedback)
      return true;
    if (step === 2 && this.state.objects.exterior) return true;
    if (step === 3 && this.state.objects.figures.length > 0) return true;
    return false;
  }

  setPattern({ src }) {
    this.setState({
      objects: {
        ...this.state.objects,
        pattern: src
      }
    });

    if (!this.state.finishedFeedback) {
      setTimeout(
        () =>
          this.setState({
            feedbackOk: true
          }),
        500
      );

      setTimeout(
        () => this.setState({ feedbackOk: false, feedbackContinue: true }),
        1300
      );

      setTimeout(
        () =>
          this.setState({ feedbackContinue: false, finishedFeedback: true }),
        3500
      );
    }
  }

  setExterior({ src }) {
    this.setState({
      objects: {
        ...this.state.objects,
        exterior: src
      }
    });
  }

  addFigure(d) {
    this.setState({
      objects: {
        ...this.state.objects,
        figures: [...this.state.objects.figures, d]
      }
    });
  }

  updateFigure(index, payload) {
    const objects = this.state.objects;

    objects.figures[index] = {
      ...objects.figures[index],
      ...payload
    };

    this.setState({
      objects
    });
  }

  removeFigure(index) {
    const objects = this.state.objects;
    objects.figures.splice(index, 1);

    this.setState({
      objects: objects
    });
  }

  flipFigure(index) {
    const objects = this.state.objects;
    const figure = objects.figures[index];
    figure.flipped = !figure.flipped;

    this.setState({
      objects: objects
    });
  }

  nextStep(e) {
    if (this.state.step === 3) {
      this.setState({
        saving: true
      });

      return;
    }
    const newStep = this.state.step + 1;

    this.setState({
      step: newStep,
      lastStepSeen: Math.max(newStep, this.state.lastStepSeen)
    });
  }

  closeDialog() {
    this.setState({
      saving: false
    });
  }

  setDragStatus(status = false) {
    this.setState({
      ...this.state,
      isDragging: status
    });
  }

  appendCharacterToTitle(title, char) {
    const t = this.state[title];
    if (t.lengh > 24) return;

    t.push(char);

    this.setState({
      [title]: t
    });
  }

  popCharacterFromTitle(title) {
    const t = this.state[title];
    if (t.length > 254) return;
    t.pop();

    this.setState({
      [title]: t
    });
  }

  async save() {
    const payload = {
      name: this.state.name,
      town: this.state.town,
      email: this.state.email,
      objects: this.state.objects
    };

    await superagent.post('/api').send(payload);

    this.props.history.push('/gallery');
  }

  render() {
    const { data, add, cl, helpVideo } = this.getPaletteData(this.state.step);

    return (
      <div className={styles.create}>
        <CSSTransitionGroup
          transitionName={{
            enter: styles.okEnter,
            enterActive: styles.okEnterActive,
            leave: styles.okLeave,
            leaveActive: styles.okLeaveActive
          }}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={200}
        >
          {this.state.feedbackOk
            ? <img src="/media/elements/El-OKhand.png" className={styles.ok} />
            : null}
        </CSSTransitionGroup>

        <CSSTransitionGroup
          transitionName={{
            enter: styles.pointEnter,
            enterActive: styles.pointEnterActive,
            leave: styles.pointLeave,
            leaveActive: styles.pointLeaveActive
          }}
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={200}
        >
          {this.state.feedbackContinue
            ? <img
                src="/media/elements/El-InderHand.png"
                className={styles.point}
              />
            : null}
        </CSSTransitionGroup>

        <Canvas
          objects={this.state.objects}
          add={add}
          updateFigure={this.updateFigure.bind(this)}
          removeFigure={this.removeFigure.bind(this)}
          flipFigure={this.flipFigure.bind(this)}
          isDragging={this.state.isDragging}
        />
        {!this.state.saving
          ? <Palette
              cl={cl}
              d={data}
              helpVideo={helpVideo}
              step={this.state.step}
              setDragStatus={this.setDragStatus.bind(this)}
              continue={this.canContinue(this.state.step)}
              nextStep={this.nextStep.bind(this)}
            />
          : null}

        {this.state.saving
          ? <Overlay>
              <SaveDialog
                name={this.state.name.join('')}
                email={this.state.email.join('')}
                town={this.state.town.join('')}
                appendCharacterToTitle={this.appendCharacterToTitle.bind(this)}
                popCharacterFromTitle={this.popCharacterFromTitle.bind(this)}
                closeDialog={this.closeDialog.bind(this)}
                save={this.save.bind(this)}
              />
            </Overlay>
          : null}
      </div>
    );
  }
}

export default withRouter(Create);

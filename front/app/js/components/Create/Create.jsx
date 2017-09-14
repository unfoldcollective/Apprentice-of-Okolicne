import React from 'react';
import superagent from 'superagent';
import { CSSTransitionGroup } from 'react-transition-group';
import { withRouter } from 'react-router';
import T from 'i18n-react';
import { uniq } from 'lodash';

import Canvas from './Canvas/Canvas.jsx';
import Palette from './Palette/Palette.jsx';
import Overlay from '../Overlay/Overlay.jsx';
import SaveDialog from './SaveDialog/SaveDialog.jsx';
import Button from './Button/Button.jsx';

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
      exitMode: false,
      fact: null,
      saving: false,
      processing: false,
      name: [],
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
    if (step === 1 && this.state.objects.pattern)
      // if (step === 1 && this.state.objects.pattern && this.state.finishedFeedback)
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
        200
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
    const objects = this.state.objects;

    const maxZ = this.getMaxZ(objects);

    d.z = maxZ + 10;

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

  reorderFigure(index) {
    const objects = this.state.objects;

    const maxZ = this.getMaxZ(objects);

    objects.figures[index].z = maxZ + 10;

    this.setState({
      objects: objects
    });
  }

  getMaxZ(objects) {
    if (!objects.figures.length) return 10;

    const maxZ = Math.max(...objects.figures.map(f => f.z || 0));

    return maxZ;
  }

  nextStep(e) {
    if (this.state.step === 3) {
      // this.createInstaText();

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

  setFunfact(fact) {
    if (this.factTimeout) clearTimeout(this.factTimeout);

    this.setState({
      fact
    });

    this.factTimeout = setTimeout(
      () => this.setState({ fact: null }),
      fact.split(' ').length * 1000 / 1.5
    );
  }

  setExitMode() {
    this.setState({
      exitMode: true
    });
  }

  createInstaText() {
    const { pattern, exterior } = this.state.objects;

    const patternDescriptor = patterns.filter(p => p.image === pattern)[0];
    const exteriorDescriptor = exteriors.filter(e => e.image === exterior)[0];
    const figuresDescriptor = this.state.objects.figures.map(
      c => figures.filter(f => f.image === c.src)[0]
    );

    const hashtags = uniq([
      ...(patternDescriptor ? patternDescriptor.hashtags : []),
      ...(exteriorDescriptor ? exteriorDescriptor.hashtags : []),
      ...figuresDescriptor.map(f => f.hashtags)
    ]);

    const emojis = uniq([
      ...(patternDescriptor ? patternDescriptor.emojis : []),
      ...(exteriorDescriptor ? exteriorDescriptor.emojis : []),
      ...figuresDescriptor.map(f => f.emojis)
    ]);

    console.log(figuresDescriptor.map(f => f.hashtags));
  }

  async save() {
    this.setState({
      processing: true
    });

    const payload = {
      name: this.state.name,
      email: this.state.email,
      objects: this.state.objects
    };

    await superagent.post('/api').send(payload);

    window.location.href = '/gallery';
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
          {this.state.feedbackOk && this.state.step === 1 ? (
            <img src="/media/elements/El-OKhand.png" className={styles.ok} />
          ) : null}
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
          {this.state.feedbackContinue && this.state.step === 1 ? (
            <img
              src="/media/elements/El-InderHand.png"
              className={styles.point}
            />
          ) : null}
        </CSSTransitionGroup>

        <CSSTransitionGroup
          transitionName={{
            enter: styles.funEnter,
            enterActive: styles.funEnterActive,
            leave: styles.funLeave,
            leaveActive: styles.funLeaveActive
          }}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={200}
        >
          {this.state.fact ? (
            <div className={styles.funFact}>{this.state.fact}</div>
          ) : null}
        </CSSTransitionGroup>

        <Canvas
          objects={this.state.objects}
          add={add}
          lang={this.props.lang}
          setFunfact={this.setFunfact.bind(this)}
          updateFigure={this.updateFigure.bind(this)}
          reorderFigure={this.reorderFigure.bind(this)}
          removeFigure={this.removeFigure.bind(this)}
          flipFigure={this.flipFigure.bind(this)}
          isDragging={this.state.isDragging}
        />
        {!this.state.saving ? (
          <Palette
            cl={cl}
            d={data}
            helpVideo={helpVideo}
            setExitMode={this.setExitMode.bind(this)}
            step={this.state.step}
            setDragStatus={this.setDragStatus.bind(this)}
            continue={this.canContinue(this.state.step)}
            nextStep={this.nextStep.bind(this)}
          />
        ) : null}

        {this.state.saving ? (
          <Overlay>
            <SaveDialog
              processing={this.state.processing}
              name={this.state.name.join('')}
              setExitMode={this.setExitMode.bind(this)}
              email={this.state.email.join('')}
              appendCharacterToTitle={this.appendCharacterToTitle.bind(this)}
              popCharacterFromTitle={this.popCharacterFromTitle.bind(this)}
              closeDialog={this.closeDialog.bind(this)}
              save={this.save.bind(this)}
            />
          </Overlay>
        ) : null}

        {this.state.exitMode ? (
          <div className={styles.exit}>
            <div className={styles.warning}>
              <h2 className={styles.warningTitle}>
                {T.translate('create.warningTitle')}
              </h2>
              <p className={styles.warningDesc}>
                {T.translate('create.warningDesc')}
              </p>
              <ul className={styles.warningList}>
                <li>
                  <Button
                    action={() => this.props.history.push('/')}
                    className={styles.warningButton}
                  >
                    {T.translate('create.warningYes')}
                  </Button>
                </li>
                <li>
                  <Button
                    action={() => this.setState({ exitMode: false })}
                    className={styles.warningButton}
                  >
                    {T.translate('create.warningNo')}
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Create);

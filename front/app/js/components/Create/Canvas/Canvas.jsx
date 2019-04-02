import React from 'react';
import Movable from '../Movable/Movable.jsx';

import styles from './Canvas.css';
import cn from 'classnames';
import interact from 'interactjs';
import { sample } from 'lodash';

import { patterns, exteriors, figures } from '../../../../data/parts.json';

const imageData = [...patterns, ...exteriors, ...figures];

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moving: false,
      overTrash: false
    };
  }

  getFunFact(fileName) {
    const facts = imageData.filter(f => f.image === fileName)[0].funFacts;

    if (facts && facts.length) {
      const chosen = sample(facts);

      this.props.setFunfact(chosen[this.props.lang]);
    }
  }

  componentDidMount() {
    //Create drop-zones

    //Full Canvas
    interact(this.canvas).dropzone({
      ondrop: e => {
        if (!this.props.isDragging) return;

        //TODO: find a better way to know the real image size.
        const image = e.relatedTarget.querySelector('img');

        const canvasSize = this.canvas.getBoundingClientRect();
        const dimensions = e.relatedTarget.getBoundingClientRect();
        this.canvasSize = canvasSize;

        const i = new Image();
        i.src = image.src;

        this.getFunFact(e.relatedTarget.dataset.src);

        i.onload = () => {
          this.props.add({
            src: e.relatedTarget.dataset.src,
            x: dimensions.left - i.width / 2 - canvasSize.width / 2,
            y: dimensions.top - i.height / 2 - canvasSize.height / 2,
            scale: 0.5,
            flipped: false,
            rotate: 0
          });
        };
      }
    });

    //Trash
    interact(this.trash).dropzone({
      ondragenter: e => {
        this.setState({
          overTrash: true
        });
      },
      ondragleave: e => {
        this.setState({
          overTrash: false
        });
      },
      ondrop: e => {
        const index = e.relatedTarget.dataset.index;

        if (index) {
          setTimeout(() => this.props.removeFigure(index));
        }
      }
    });
  }

  setMovingStatus(moving) {
    this.setState({
      moving
    });
  }

  getFigures() {
    const figures = this.props.objects.figures.map((f, i) => {
      return (
        <Movable
          key={`movable_${i}`}
          {...f}
          i={i}
          canvasSize={this.canvasSize}
          updateFigure={this.props.updateFigure.bind(null, i)}
          reorderFigure={this.props.reorderFigure.bind(null, i)}
          flipFigure={this.props.flipFigure.bind(null, i)}
          setMovingStatus={this.setMovingStatus.bind(this)}
        />
      );
    });

    return <div className={styles.figureCanvas}>{figures}</div>;
  }

  render() {
    return (
      <div
        ref={el => (this.canvas = el)}
        className={cn(styles.canvas, {
          [styles.over]: this.props.isDragging
        })}
      >
        {this.props.objects.pattern ? (
          <div
            className={styles.pattern}
            style={{
              backgroundImage: `url(/media/images/${
                this.props.objects.pattern
              })`
            }}
          />
        ) : null}

        {this.props.objects.exterior ? (
          <div
            className={styles.exterior}
            style={{
              backgroundImage: `url(/media/images/${
                this.props.objects.exterior
              })`
            }}
          />
        ) : null}

        {this.getFigures()}

        <div
          ref={el => (this.trash = el)}
          className={cn(styles.trash, {
            [styles.trashOver]: this.state.overTrash
          })}
          hidden={!this.state.moving}
        >
          <img src="/media/elements/I-Remove-Small.svg" />
        </div>
      </div>
    );
  }
}

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
      moving: false
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

    return (
      <div className={styles.figureCanvas}>
        {figures}
      </div>
    );
  }

  render() {
    return (
      <div
        ref={el => (this.canvas = el)}
        className={cn(styles.canvas, {
          [styles.over]: this.props.isDragging
        })}
      >
        {this.props.objects.pattern
          ? <div
              className={styles.pattern}
              style={{
                backgroundImage: `url(/media/images/${this.props.objects
                  .pattern})`
              }}
            />
          : null}

        {this.props.objects.exterior
          ? <div
              className={styles.exterior}
              style={{
                backgroundImage: `url(/media/images/${this.props.objects
                  .exterior})`
              }}
            />
          : null}

        {this.getFigures()}

        <div
          ref={el => (this.trash = el)}
          className={styles.trash}
          hidden={!this.state.moving}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              className={styles.icon}
              d="M9 13v6c0 .552-.448 1-1 1s-1-.448-1-1v-6c0-.552.448-1 1-1s1 .448 1 1zm7-1c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1s1-.448 1-1v-6c0-.552-.448-1-1-1zm-4 0c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1s1-.448 1-1v-6c0-.552-.448-1-1-1zm4.333-8.623c-.882-.184-1.373-1.409-1.189-2.291l-5.203-1.086c-.184.883-1.123 1.81-2.004 1.625l-5.528-1.099-.409 1.958 19.591 4.099.409-1.958-5.667-1.248zm4.667 4.623v16h-18v-16h18zm-2 14v-12h-14v12h14z"
            />
          </svg>
        </div>
      </div>
    );
  }
}

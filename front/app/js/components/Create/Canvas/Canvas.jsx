import React from 'react';
import Image from '../Image/Image.jsx';
import Movable from '../Movable/Movable.jsx';

import styles from './Canvas.css';
import cn from 'classnames';
import interact from 'interactjs';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      moving: false
    };
  }

  componentDidMount() {
    //Create drop-zones

    //Full Canvas
    interact(this.canvas).dropzone({
      ondrop: e => {
        if (!this.props.isDragging) return;

        const dragDimensions = e.relatedTarget.getBoundingClientRect();

        this.props.add({
          src: e.relatedTarget.dataset.src,
          x: dragDimensions.left,
          y: dragDimensions.top,
          scale: 0.5,
          rotate: 0
        });
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
          updateFigure={this.props.updateFigure.bind(null, i)}
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
          ? <Image
              className={styles.exterior}
              src={this.props.objects.exterior}
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

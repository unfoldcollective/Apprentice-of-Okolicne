import React from 'react';
import Image from '../Image/Image.jsx';
import Movable from '../Movable/Movable.jsx';

import styles from './Canvas.css';
import cn from 'classnames';
import interact from 'interactjs';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    interact(this.canvas).dropzone({
      ondrop: e => {
        if(!this.props.isDragging) return;

        const dragDimensions = e.relatedTarget.getBoundingClientRect();

        this.props.add({
          src: e.relatedTarget.dataset.src,
          x: dragDimensions.left,
          y: dragDimensions.top,
          scale: 1,
          rotate: 0
        });
      }
    });
  }



  getFigures() {
    const figures = this.props.objects.figures.map((f, i) =>
      <Movable key={`movable_${i}`} {...f} updateFigure={this.props.updateFigure.bind(null, i)} />
    );

    return (
      <div className={styles.figureCanvas}>
        {figures}
      </div>
    );
  }

  render() {
    return (
      <div
        ref={el => {
          this.canvas = el;
        }}
        className={cn(styles.canvas, {
          [styles.over]: this.props.isDragging
        })}
      >
        {this.props.objects.pattern
          ? <div
              className={styles.pattern}
              style={{
                backgroundImage: `url(/media/images/${this.props.objects.pattern})`
              }}
            ></div>
          : null}

        {this.props.objects.exterior
          ? <Image
              className={styles.exterior}
              src={this.props.objects.exterior}
            />
          : null}

        {this.getFigures()}
      </div>
    );
  }
}

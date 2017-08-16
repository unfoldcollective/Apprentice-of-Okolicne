import React from 'react';
import interact from 'interactjs';

import styles from './Movable.css';

export default class Movable extends React.Component {
  componentDidMount() {
    let scale = this.props.scale;
    let rotate = this.props.rotate;

    const removeTransform = () => {
      this.movable.style.webkitTransform = this.movable.style.transform = '';

      this.movable.setAttribute('data-x', 0);
      this.movable.setAttribute('data-y', 0);
    };

    const gestureHandler = e => {
      dragHandler(e);

      if (!e.da && !e.ds) return;
      rotate = rotate + e.da;
      scale = scale * (1 + e.ds);

      this.image.style.webkitTransform = this.image.style.transform = `rotate(${rotate}deg) scale(${scale})`;
    };

    const dragHandler = e => {
      const x = (parseFloat(this.movable.getAttribute('data-x')) || 0) + e.dx;
      const y = (parseFloat(this.movable.getAttribute('data-y')) || 0) + e.dy;

      this.movable.style.webkitTransform = this.movable.style.transform = `translate(${x}px, ${y}px)`;

      this.movable.setAttribute('data-x', x);
      this.movable.setAttribute('data-y', y);
    };

    const startHandler = e => {
      this.props.setMovingStatus(true);
    };

    const endHandler = e => {
      const dimensions = this.movable.getBoundingClientRect();
      removeTransform();

      this.props.updateFigure({
        x: dimensions.left,
        y: dimensions.top,
        rotate,
        scale
      });

      this.props.setMovingStatus(false);
    };

    interact(this.movable)
      .gesturable({
        onstart: startHandler,
        onmove: gestureHandler,
        onend: endHandler
      })
      .draggable({
        onstart: startHandler,
        onmove: dragHandler,
        onend: endHandler
      });

  }

  componentWillUnmount() {
    interact(this.movable).draggable(false).gesturable(false);
  }

  render() {
    const transform = `rotate(${this.props.rotate}deg) scale(${this.props
      .scale})`;

    return (
      <div
        style={{
          top: this.props.y,
          left: this.props.x,
          zIndex: this.props.zIndex
        }}
        className={styles.figure}
        data-index={this.props.i}
        ref={el => {
          this.movable = el;
        }}
      >
        <img
          ref={el => {
            this.image = el;
          }}
          style={{ transform }}
          src={`/media/images/${this.props.src}`}
          className={styles.figure}
        />
      </div>
    );
  }
}

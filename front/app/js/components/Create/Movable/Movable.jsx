import React from 'react';
import interact from 'interactjs';

import styles from './Movable.css';

export default class Movable extends React.Component {
  componentDidMount() {
    //this.movable
    //this.image
    let scale = this.props.scale;
    let rotate = this.props.rotate;

    const removeTransform = () => {
      this.movable.style.webkitTransform = this.movable.style.transform = '';

      this.movable.setAttribute('data-x', 0);
      this.movable.setAttribute('data-y', 0);
    };

    const gestureHandler = e => {
      if (!e.da && !e.ds) return;
      rotate = rotate + e.da;
      scale = scale * (1 + e.ds);

      this.image.style.webkitTransform = this.image.style.transform = `rotate(${rotate}deg) scale(${scale})`;

      dragHandler(e);
    };

    const dragHandler = e => {
      const x = (parseFloat(this.movable.getAttribute('data-x')) || 0) + e.dx;
      const y = (parseFloat(this.movable.getAttribute('data-y')) || 0) + e.dy;

      // translate the element
      this.movable.style.webkitTransform = this.movable.style.transform = `translate(${x}px, ${y}px)`;

      // update the posiion attributes
      this.movable.setAttribute('data-x', x);
      this.movable.setAttribute('data-y', y);
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
    };

    interact(this.movable)
      .gesturable({
        onmove: gestureHandler,
        onend: endHandler
      })
      .draggable({
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
          border: '1px solid orange'
        }}
        className={styles.figure}
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

import React from 'react';
import interact from 'interactjs';

import styles from './Movable.css';

export default class Movable extends React.Component {
  componentDidMount() {
    let rotate = this.props.rotate;
    let x = 0;
    let y = 0;
    let scale = this.props.scale;

    function setTransform(target, x, y, rotate, scale) {
      target.style.webkitTransform = target.style.transform = `rotate(${rotate}deg) scale(${scale}) translate(${x}px, ${y}px)`;
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    function removeTransform(target) {
      target.style.webkitTransform = target.style.transform = `rotate(${rotate}deg) scale(${scale})`;
    }
    function moveHandler(e) {
      const target = e.target;

      rotate = rotate + (e.da || 0);
      // scale = scale * (1 + (e.ds || 0));

      x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx / scale;
      y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy / scale;

      setTransform(target, x, y, rotate, scale);
    }

    const endHandler = e => {
      const target = e.target;
      const dimensions = target.getBoundingClientRect();

      x = 0;
      y = 0;

      removeTransform(target);
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);

      this.props.updateFigure({
        x: dimensions.left,
        y: dimensions.top,
        rotate,
        scale
      });
    };

    interact(this.movable)
      .draggable({
        inertia: true,
        onmove: moveHandler,
        onend: endHandler
      })
      .gesturable({
        onmove: moveHandler,
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
          transform,
          border: '1px solid orange'
        }}
        className={styles.figure}
        ref={el => {
          this.movable = el;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

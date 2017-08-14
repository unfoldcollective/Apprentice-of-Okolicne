import React from 'react';
import interact from 'interactjs';

import styles from './Movable.css';

export default class Movable extends React.Component {
  componentDidMount() {
    let rotation = this.props.rotation;
    let x = this.props.x;
    let y = this.props.y;
    let scale = 1;

    function setTransform(x, y, rotation, scale) {
      return `rotate(${rotation}deg) scale(${scale}) translate(${x}px, ${y}px)`;
    }

    function moveHandler(e) {
      const target = e.target;

      if (e.da) rotation = rotation + e.da;
      if (e.ds) scale = scale * (1 + e.ds);

      if (e.dx) x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx;
      if (e.dy) y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy;

      target.style.webkitTransform = target.style.transform = setTransform(
        x,
        y,
        rotation,
        scale
      );

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    }

    const endHandler = e => {
      const dimensions = e.target.getBoundingClientRect();
      this.props.updateFigure({
        x: dimensions.left,
        y: dimensions.top,
        rotation,
        width: dimensions.width + 'px',
        height: dimensions.height + 'px'
      });
    };

    interact(this.movable)
      .gesturable({
        onmove: moveHandler,
        onend: endHandler
      })
      .draggable({
        onmove: moveHandler,
        onend: endHandler
      });
  }

  render() {
    return (
      <div
        style={{
          top: this.props.y,
          left: this.props.x,
          width: this.props.width,
          height: this.props.height,
          transform: [{ rotate: `${this.props.rotate}deg` }]
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

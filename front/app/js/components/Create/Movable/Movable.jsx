import React from 'react';
import interact from 'interactjs';
import cn from 'classnames';
import { debounce } from 'lodash';

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

      this.image.style.webkitTransform = this.image.style.transform = `rotate(${rotate}deg) scale(${this
        .props.flipped
        ? -scale
        : scale}, ${scale})`;
    };

    const dragHandler = e => {
      const x = (parseFloat(this.movable.getAttribute('data-x')) || 0) + e.dx;
      const y = (parseFloat(this.movable.getAttribute('data-y')) || 0) + e.dy;

      this.movable.style.webkitTransform = this.movable.style.transform = `translate3d(${x}px, ${y}px, 0)`;

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
        x: dimensions.left - this.props.canvasSize.width / 2,
        y: dimensions.top - this.props.canvasSize.height / 2,
        rotate,
        scale
      });

      this.props.setMovingStatus(false);
    };

    interact(this.movable)
      .gesturable({
        onstart: startHandler,
        onmove: debounce(gestureHandler, 8),
        onend: endHandler
      })
      .draggable({
        onstart: startHandler,
        onmove: debounce(dragHandler, 8),
        onend: endHandler
      })
      .on('tap', e => {
        this.props.reorderFigure();
        e.stopPropagation();
      })
      .on('doubletap', e => {
        this.props.flipFigure();
        e.stopPropagation();
      });
  }

  componentWillUnmount() {
    interact(this.movable)
      .draggable(false)
      .gesturable(false);
  }

  render() {
    const scaleH = this.props.flipped ? -this.props.scale : this.props.scale;
    const imageTransform = `rotate(${this.props
      .rotate}deg) scale(${scaleH}, ${this.props.scale})`;

    const imageStyle = {
      transform: imageTransform
    };

    return (
      <div
        style={{
          top: `calc(50% + ${this.props.y}px)`,
          left: `calc(50% + ${this.props.x}px)`,
          zIndex: this.props.z
        }}
        className={styles.figure}
        data-index={this.props.i}
        ref={el => {
          this.movable = el;
        }}
      >
        <img
          style={imageStyle}
          ref={el => {
            this.image = el;
          }}
          src={`/media/images/${this.props.src}`}
          className={cn(styles.figure, {
            [styles.flipped]: this.props.flipped
          })}
        />
      </div>
    );
  }
}

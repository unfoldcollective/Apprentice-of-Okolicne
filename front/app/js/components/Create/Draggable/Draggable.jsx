import React from 'react';
import interact from 'interactjs';
import { debounce } from 'lodash';

import styles from './Draggable.css';

const MOVEMENT_DEBOUNCE = 1;

export default class Draggable extends React.Component {
  componentDidMount() {
    let dragElement;

    interact(this.draggable)
      .draggable({
        manualStart: true,
        onstart: e => {
          e.preventDefault();
          e.stopPropagation();

          this.props.setDragStatus(true);
          this.dragging = true;
        },
        onmove: debounce(e => {
          const target = e.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy;

          target.style.webkitTransform = target.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.1)`;

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }, MOVEMENT_DEBOUNCE),
        onend: e => {
          setTimeout(() => {
            this.props.setDragStatus(false);
            dragElement.parentNode.removeChild(dragElement);
          });
          this.dragging = false;
          //;
        }
      })
      .on('move', e => {
        if (this.dragging) return;

        const interaction = e.interaction;

        if (interaction.pointerIsDown && !interaction.interacting()) {
          const original = e.currentTarget;
          dragElement = original.cloneNode(true);

          const dimensions = original.getBoundingClientRect();

          dragElement.classList.add(styles.drag);

          for (const prop of ['top', 'left', 'width', 'height']) {
            dragElement.style[prop] = dimensions[prop] + 'px';
          }

          dragElement.dataset.src = this.props.src;

          document.body.appendChild(dragElement);

          interaction.start({ name: 'drag' }, e.interactable, dragElement);
        }
      });
  }

  render() {
    return (
      <div
        className={styles.dragTarget}
        ref={el => {
          this.draggable = el;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

import React from 'react';
import interact from 'interactjs';

import styles from './Draggable.css';

export default class Draggable extends React.Component {
  componentDidMount() {
    let dragElement;

    interact(this.draggable)
      .draggable({
        manualStart: true,
        onstart: e => {
          this.props.setDragStatus(true);
        },
        onmove: e => {
          const target = e.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + e.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + e.dy;

          target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        },
        onend: e => {
          this.props.setDragStatus(false);
          dragElement.parentNode.removeChild(dragElement);
        }
      })
      .on('move', e => {
        e.preventDefault();
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
        ref={el => {
          this.draggable = el;
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

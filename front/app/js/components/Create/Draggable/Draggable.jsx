import React from 'react';

export default class Draggable extends React.Component {
    componentDidMount() {
        function handleDragStart(e) {
            e.dataTransfer.setData('text/plain', this.props.src);
        }

        this.draggable.addEventListener('dragstart', handleDragStart.bind(this), false);
    }

    render() {
        return (
            <div
                draggable="true"
                ref={el => {
                    this.draggable = el;
                }}
                className="draggable"
            >
                {this.props.children}
            </div>
        );
    }
}

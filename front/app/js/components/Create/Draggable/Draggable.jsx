import React from 'react';

export default class Draggable extends React.Component {
    render() {
        return (
            <div className="draggable">
                {this.props.children}
            </div>
        );
    }
}

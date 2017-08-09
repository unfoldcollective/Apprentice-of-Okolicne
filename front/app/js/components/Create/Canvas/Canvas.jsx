import React from 'react';
import Image from '../Image/Image.jsx';

import styles from './Canvas.css';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        function handleDrop(e) {
            e.stopPropagation();
            const src = e.dataTransfer.getData('text/plain');
            this.props.add(src);
        }

        function handleDragOver(e) {
            e.preventDefault();
        }

        this.canvas.addEventListener('drop', handleDrop.bind(this), false);
        this.canvas.addEventListener('dragover', handleDragOver, false);
    }

    render() {
        return (
            <div
                ref={el => {
                    this.canvas = el;
                }}
                className={styles.canvas}
            >
                {this.props.objects.pattern
                    ? <Image
                          className={styles.pattern}
                          src={this.props.objects.pattern}
                      />
                    : null}

                {this.props.objects.exterior
                    ? <Image
                          className={styles.exterior}
                          src={this.props.objects.exterior}
                      />
                    : null}
            </div>
        );
    }
}

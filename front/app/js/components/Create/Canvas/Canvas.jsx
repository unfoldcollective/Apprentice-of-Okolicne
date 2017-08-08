import React from 'react';
import styles from './Canvas.css';

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className={styles.canvas}>canvas</div>;
    }
}
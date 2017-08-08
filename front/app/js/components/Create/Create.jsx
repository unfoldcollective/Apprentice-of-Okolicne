import React from 'react';
import styles from './Create.css';

import Canvas from './Canvas/Canvas.jsx';
import Palette from './Palette/Palette.jsx';


const Create = () =>
    <div className={styles.create}>
        <Canvas />
        <Palette />
    </div>;

export default Create;
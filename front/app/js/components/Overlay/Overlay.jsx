import React from 'react';
import styles from './Overlay.css';

const Overlay = ({ children }) =>
  <div className={styles.overlay}>
        {children}
  </div>;

export default Overlay;

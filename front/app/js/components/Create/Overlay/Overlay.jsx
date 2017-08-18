import React from 'react';
import styles from './Overlay.css';

const Overlay = ({ children }) =>
  <div className={styles.overlay}>
    <div className={styles.banner}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  </div>;

export default Overlay;
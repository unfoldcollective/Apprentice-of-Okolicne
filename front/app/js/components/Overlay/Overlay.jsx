import React from 'react';
import styles from './Overlay.css';
import cn from 'classnames';

const Overlay = ({ children, shade }) =>
  <div
    className={cn(styles.overlay, {
      [styles.shade]: shade
    })}
  >
    {children}
  </div>;

export default Overlay;

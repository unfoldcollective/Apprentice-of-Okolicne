import React from 'react';
import cn from 'classnames';

import styles from './MiniCanvas.css';
import Button from '../../Create/Button/Button.jsx';

const Figure = ({ x, y, src, flipped, rotate, scale }) => {
  const scaleH = flipped ? -scale : scale;
  const imageTransform = `rotate(${rotate}deg) scale(${scaleH}, ${scale})`;

  const imageStyle = {
    transform: imageTransform
  };

  return (
    <div
      className={styles.figure}
      style={{
        top: y + '%',
        left: x + '%'
      }}
    >
      <img
        style={imageStyle}
        src={`/media/images/${src}`}
        className={cn(styles.figure, {
          [styles.flipped]: flipped
        })}
      />
    </div>
  );
};

const MiniCanvas = ({ creation, cancelSelection }) => {
  const figures = creation.objects.figures.map((f, i) => {
    return <Figure key={`movable_${i}`} {...f} />;
  });

  return (
    <div className={styles.MiniCanvas}>
      <div className={styles.canvas}>
        {creation.objects.pattern
          ? <div
              className={styles.pattern}
              style={{
                backgroundImage: `url(/media/images/${creation.objects
                  .pattern})`
              }}
            />
          : null}

        {creation.objects.exterior
          ? <img
              className={styles.exterior}
              src={`/media/images/${creation.objects.exterior}`}
            />
          : null}

        {figures}
      </div>
      <div className={styles.side}>
        <header>
          {creation.title.length
            ? <h2 className={styles.title}>
                {creation.title}
              </h2>
            : null}
        </header>

        <p className={styles.text}>
          Used artworks {creation.objects.figures.length}
        </p>

        <footer className={styles.footer}>
          <Button className={styles.button} action={cancelSelection}>
            <img
              className={styles.buttonImage}
              src="/media/elements/B-backF.svg"
            />
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default MiniCanvas;

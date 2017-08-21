import React from 'react';

import styles from './MiniCanvas.css';

const Figure = ({x, y, src, flipped, rotate, scale}) => {
  return <div />
};

const MiniCanvas = ({ creation, cancelSelection }) => {
  const figures = creation.objects.figures.map((f, i) => {
    return <Figure key={`movable_${i}`} {...f} />;
  });

  return (
    <div>
      <div>
        {creation.pattern
          ? <div
              className={styles.pattern}
              style={{
                backgroundImage: `url(/media/images/${creation.pattern})`
              }}
            />
          : null}

        {creation.exterior
          ? <img className={styles.exterior} src={creation.exterior} />
          : null}

        {figures}
      </div>
      <div>
        <header>
          <h2>{creation.title}</h2>
          <p>Used artworks {creation.objects.figures.length}</p>
          <button onClick={cancelSelection}>Close</button>
        </header>
      </div>
    </div>
  );
};

export default MiniCanvas;

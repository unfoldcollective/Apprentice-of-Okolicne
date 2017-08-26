import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import superagent from 'superagent';

import styles from './MiniCanvas.css';

const Figure = ({ x, y, src, flipped, rotate, scale }) => {
  const scaleH = flipped ? -scale : scale;
  const imageTransform = `rotate(${rotate}deg) scale(${scaleH}, ${scale})`;

  const imageStyle = {
    transform: imageTransform,
    '-webkit-transform': imageTransform
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

export default class MiniCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      creation: null
    };

    this.getCreation();
  }

  async getCreation() {
    const creation = await superagent.get(
      `/api/id/${this.props.match.params.id}`
    );

    this.setState({
      creation: creation.body.data
    });
  }

  getFigures() {
    if (!this.state.creation) return;

    const figures = this.state.creation.objects.figures.map((f, i) => {
      return <Figure key={`movable_${i}`} {...f} />;
    });

    return figures;
  }

  render() {
    if (!this.state.creation) return <div />;

    return (
      <div className={styles.MiniCanvas}>
        <div className={styles.canvas}>
          {this.state.creation.objects.pattern
            ? <div
                className={styles.pattern}
                style={{
                  backgroundImage: `url(/media/images/${this.state.creation
                    .objects.pattern})`
                }}
              />
            : null}

          {this.state.creation.objects.exterior
            ? <img
                className={styles.exterior}
                src={`/media/images/${this.state.creation.objects.exterior}`}
              />
            : null}

          {this.getFigures()}
        </div>
        <div className={styles.side}>
          <header>
            <h2 className={styles.title}>
              {this.state.creation.name[0]}. from{' '}
              {this.state.creation.town.join('')}
            </h2>
          </header>

          <p className={styles.text}>
            Used artworks {this.state.creation.objects.figures.length}
          </p>

          <footer className={styles.footer}>
            <Link className={styles.button} to="/gallery">
              <img
                className={styles.buttonImage}
                src="/media/elements/B-backF.svg"
              />
            </Link>
          </footer>
        </div>
      </div>
    );
  }
}

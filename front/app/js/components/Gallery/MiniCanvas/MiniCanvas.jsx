import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import superagent from 'superagent';
import T from 'i18n-react';
import { uniqBy } from 'lodash';

import styles from './MiniCanvas.css';

import { patterns, exteriors, figures } from '../../../../data/parts.json';

const Figure = ({ x, y, src, flipped, rotate, scale, z }) => {
  const scaleH = flipped ? -scale : scale;
  const imageTransform = `rotate(${rotate}deg) scale(${scaleH}, ${scale})`;

  const imageStyle = {
    transform: imageTransform,
    WebkitTransform: imageTransform
  };

  return (
    <div
      className={styles.figure}
      style={{
        top: `calc(50% + ${y}px)`,
        left: `calc(50% + ${x}px)`,
        zIndex: z
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

  getCreationDescriptors() {
    const { pattern, exterior } = this.state.creation.objects;

    const patternDescriptor = patterns.filter(p => p.image === pattern)[0];
    const exteriorDescriptor = exteriors.filter(e => e.image === exterior)[0];
    const figuresDescriptor = this.state.creation.objects.figures.map(
      c => figures.filter(f => f.image === c.src)[0]
    );

    const descriptorList = uniqBy(
      [patternDescriptor, exteriorDescriptor, ...figuresDescriptor],
      e => e.meta.imgSrcTitle
    ).map((d, i) =>
      <li key={`descriptor_${i}`}>
        <p>
          {d.meta.imgSrcTitle} <span>{d.meta.imgSrcInstitution}</span>
        </p>
      </li>
    );

    return (
      <ul className={styles.artWorkList}>
        {descriptorList}
      </ul>
    );
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
            ? <div
                className={styles.exterior}
                style={{
                  backgroundImage: `url(/media/images/${this.state.creation
                    .objects.exterior})`
                }}
              />
            : null}

          {this.getFigures()}
        </div>
        <div className={styles.side}>
          <header>
            <h2 className={styles.title}>
              {this.state.creation.name[0].toUpperCase()}
            </h2>
          </header>

          <div className={styles.text}>
            <p className={styles.artWorkTitle}>{T.translate('gallery.listTitle', {
              n: this.state.creation.objects.figures.length + 2
            })}</p>
            {this.getCreationDescriptors()}
          </div>

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

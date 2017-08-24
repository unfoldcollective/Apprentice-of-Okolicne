import React from 'react';
import { Link } from 'react-router-dom';
import superagent from 'superagent';

import Overlay from '../Overlay/Overlay.jsx';
import MiniCanvas from './MiniCanvas/MiniCanvas.jsx';

import styles from './Gallery.css';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selected: null
    };

    superagent.get('/api').then(d => {
      this.setState({ data: d.body.data });
    });
  }

  getCreations() {
    const creations = this.state.data.map((c, i) =>
      <li
        className={styles.item}
        key={`creation_${i}`}
        onClick={e => this.setState({ selected: i })}
      >
        <h3 className={styles.itemTitle}>
          {c.title.length ? c.title.join('') : 'No title'}
        </h3>
      </li>
    );

    return (
      <ul className={styles.list}>
        {creations}
      </ul>
    );
  }

  cancelSelection() {
    this.setState({ selected: null });
  }

  render() {
    return (
      <div>
        <h2 className={styles.title}>Galéria</h2>
        {this.getCreations()}

        {this.state.selected !== null
          ? <Overlay shade={true}>
              <MiniCanvas
                creation={this.state.data[this.state.selected]}
                cancelSelection={this.cancelSelection.bind(this)}
              />
            </Overlay>
          : null}
        <Link className={styles.home} to="/">
          <img
            className={styles.buttonImage}
            src="/media/elements/B-homeF.svg"
          />
        </Link>
      </div>
    );
  }
}

export default Gallery;

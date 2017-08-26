import React from 'react';
import { Link, Route } from 'react-router-dom';
import superagent from 'superagent';

import MiniCanvas from './MiniCanvas/MiniCanvas.jsx';

import styles from './Gallery.css';

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
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
        <Link to={`${this.props.match.url}/${c._id}`}>
          <h3 className={styles.itemTitle}>
            {c.name[0]}. from {c.town.join('')}
          </h3>
          <img src={`/captures/th_${c._id}.jpg`} />
        </Link>
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
      <div style={{ height: '100%' }}>
        <Route
          exact
          path={this.props.match.url}
          render={() => {
            return (
              <div>
                <h2 className={styles.title}>Galéria</h2>
                {this.getCreations()}
              </div>
            );
          }}
        />

        <Route path={`${this.props.match.url}/:id`} component={MiniCanvas} />

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

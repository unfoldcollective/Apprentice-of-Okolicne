import React from 'react';
import { Link, Route } from 'react-router-dom';
import superagent from 'superagent';
import { withRouter } from 'react-router-dom';

import MiniCanvas from './MiniCanvas/MiniCanvas.jsx';

import styles from './Gallery.css';

const HomeButton = ({ percentage }) => {
  const value = 251.327 * percentage;

  return (
    <Link className={styles.home} to="/">
      <svg
        className={styles.progress}
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        <circle
          className={styles.control}
          cx="50"
          cy="50"
          r="40"
          strokeWidth="10"
        />
        <circle
          className={styles.value}
          cx="50"
          cy="50"
          r="40"
          strokeWidth="10"
          strokeDasharray="251.327"
          strokeDashoffset={value}
        />
      </svg>
      <img className={styles.buttonImage} src="/media/elements/B-homeF.svg" />
    </Link>
  );
};

class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      percentTimeout: 1
    };

    this.maxSeconds = 30;
    this.inactivity = 0;

    superagent.get('/api').then(d => {
      this.setState({ data: d.body.data });
    });
  }

  handleActivity() {
    this.inactivity = 0;
  }

  componentDidMount() {
    window.addEventListener('click', this.handleActivity.bind(this));

    this.interval = setInterval(() => {
      if (this.inactivity === this.maxSeconds) this.props.history.push('/');
      this.inactivity += 1;

      this.setState({
        percentTimeout: this.inactivity / this.maxSeconds
      });
    }, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleActivity);
    clearInterval(this.interval);
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

        <HomeButton percentage={this.state.percentTimeout} />

        <Route path={`${this.props.match.url}/:id`} component={MiniCanvas} />
      </div>
    );
  }
}

export default withRouter(Gallery);

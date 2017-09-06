import React from 'react';
import { Link, Route } from 'react-router-dom';
import superagent from 'superagent';
import { withRouter } from 'react-router-dom';
import T from 'i18n-react';

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
      percentTimeout: 1,
      itemCount: 0,
      loading: false,
      noMore: false
    };

    this.maxSeconds = 20;
    this.inactivity = 0;

    superagent.get('/api').then(d => {
      this.setState({
        data: d.body.data,
        itemCount: d.body.data.length
      });
    });
  }

  handleActivity() {
    this.inactivity = 0;
  }

  async getMore() {
    const newData = await superagent.get(`/api?offset=${this.state.itemCount}`);

    if (newData.body.data.length < 20) {
      this.setState({
        noMore: true
      });
    }

    const data = [...this.state.data.slice(), ...newData.body.data];

    this.setState({
      data,
      itemCount: data.length,
      loading: false
    });
  }

  handleScroll() {
    if (this.state.noMore) return;

    const parent = this.list.parentNode;
    const parentHeight = parent.getBoundingClientRect().height;
    const listHeight = this.list.scrollHeight;
    const listScroll = this.list.scrollTop;

    if (!this.state.loading && listScroll + parentHeight > listHeight) {
      this.setState({
        loading: true
      });

      this.getMore();
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.handleActivity.bind(this));
    this.list.addEventListener('scroll', this.handleScroll.bind(this));

    this.interval = setInterval(() => {
      if (this.inactivity === this.maxSeconds) {
        clearInterval(this.interval);
        this.props.history.push('/');
        return;
      }

      this.inactivity += 1;

      this.setState({
        percentTimeout: this.inactivity / this.maxSeconds
      });
    }, 5000);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleActivity);
    this.list.removeEventListener('scroll', this.handleScroll);

    clearInterval(this.interval);
  }

  getCreations() {
    const creations = this.state.data.map((c, i) => (
      <li
        className={styles.item}
        key={`creation_${i}`}
        onClick={e => this.setState({ selected: i })}
      >
        <Link to={`${this.props.match.url}/${c._id}`}>
          <h3 className={styles.itemTitle}>{c.name[0]}</h3>
          <img src={`/captures/th_${c._id}.jpg`} />
        </Link>
      </li>
    ));

    return (
      <ul className={styles.list} ref={el => (this.list = el)}>
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
        <Route
          path={this.props.match.url}
          render={() => {
            return (
              <div className={styles.gallery}>
                <h2 className={styles.title}>{T.translate('gallery.title')}</h2>
                {this.getCreations()}

                <HomeButton percentage={this.state.percentTimeout} />
              </div>
            );
          }}
        />

        <Route path={`${this.props.match.url}/:id`} component={MiniCanvas} />
      </div>
    );
  }
}

export default withRouter(Gallery);

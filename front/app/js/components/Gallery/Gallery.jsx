import React from 'react';
import { Link } from 'react-router-dom';
import superagent from 'superagent';

import Overlay from '../Overlay/Overlay.jsx';
import MiniCanvas from './MiniCanvas/MiniCanvas.jsx';

import './Gallery.css';

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
      <li key={`creation_${i}`} onClick={e => this.setState({ selected: i })}>
        <h2>
          {c.title.length ? c.title.join('') : 'No title'}
        </h2>
      </li>
    );

    return (
      <ul>
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
        <h2>Gallery!</h2>
        {this.getCreations()}

        {this.state.selected !== null
          ? <Overlay>
              <MiniCanvas
                creation={this.state.data[this.state.selected]}
                cancelSelection={this.cancelSelection.bind(this)}
              />
            </Overlay>
          : null}
        <Link className="home" to="/">
          Back to home
        </Link>
      </div>
    );
  }
}

export default Gallery;

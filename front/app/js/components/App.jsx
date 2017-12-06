import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import T from 'i18n-react';

import Home from './Home/Home.jsx';
import Create from './Create/Create.jsx';
import Gallery from './Gallery/Gallery.jsx';

import styles from './App.css';
import strings from '../../data/i18n.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lang: 'sk'
    };

    T.setTexts(strings[this.state.lang]);
  }
  setLanguage(lang) {
    this.setState({
      lang
    });
    T.setTexts(strings[lang]);
    this.forceUpdate();
  }
  render() {
    const HomeWithLang = props => (
      <Home
        lang={this.state.lang}
        setLanguage={this.setLanguage.bind(this)}
        {...props}
      />
    );

    const CreateWithLang = props => (
      <Create lang={this.state.lang} {...props} />
    );

    const GalleryWithLang = props => (
      <Gallery lang={this.state.lang} {...props} />
    );

    return (
      <Router>
        <section className={styles.app}>
          <Route exact path="/" component={HomeWithLang} />
          <Route path="/create" component={CreateWithLang} />
          <Route path="/gallery" component={GalleryWithLang} />
        </section>
      </Router>
    );
  }
}

export default App;

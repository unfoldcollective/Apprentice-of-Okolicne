import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Home from './Home/Home.jsx';
import Create from './Create/Create.jsx';
import Gallery from './Gallery/Gallery.jsx';

import style from './App.css';

const App = () =>
    <Router>
        <section className={style.app}>
            <Route exact path="/" component={Home} />
            <Route path="/create" component={Create} />
            <Route path="/gallery" component={Gallery} />
        </section>
    </Router>;

export default App;

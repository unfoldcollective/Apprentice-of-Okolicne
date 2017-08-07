import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const Home = () =>
    <div>
        <h2>Home</h2>
    </div>;

const About = () =>
    <div>
        <h2>About</h2>
    </div>;

const App = () =>
    <Router>
        <div>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
        </div>
    </Router>;

export default App;
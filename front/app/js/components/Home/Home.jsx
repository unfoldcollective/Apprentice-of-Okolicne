import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Home.css';

const Home = () =>
  <div>
    <video
      className={styles.videoBG}
      src="/media/videos/home.mp4"
      autoPlay
      loop
    />
    <header className={styles.home}>
      <h1 className={styles.title}>
        Učeň z <br />Okoličného
      </h1>
      <h2 className={styles.subtitle}>
        Majster hľadá nového učňa, navštív jeho dielňu
      </h2>
      <nav>
        <ul className={styles.buttonList}>
          <li>
            <Link className={styles.mainButton} to="/create">
              <span className={styles.mainSpan}>
                Vstúpiť <br /> do dielne<br />
                <img className={styles.iconImg} src="/media/elements/B-enterF.svg"/>
              </span>
            </Link>
          </li>
          <li>
            <Link className={styles.smallButton} to="/gallery">
              Galéria
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  </div>;

export default Home;

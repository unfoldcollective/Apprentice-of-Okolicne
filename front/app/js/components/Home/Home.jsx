import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Home.css';

import T from 'i18n-react';

const Home = ({setLanguage}) =>
  <div>
  <div className={styles.i18n}>
    <button className={styles.i18nButton} onClick={setLanguage.bind(null, 'sk')}>SK</button>
    <button className={styles.i18nButton} onClick={setLanguage.bind(null, 'en')}>EN</button>
  </div>

    <video
      className={styles.videoBG}
      src="/media/videos/home.mp4"
      autoPlay
      loop
    />
    <header className={styles.home}>
      <h1 className={styles.title}>
        {T.translate('home.title')}
      </h1>
      <h2 className={styles.subtitle}>
        {T.translate('home.subtitle')}
      </h2>
      <nav>
        <ul className={styles.buttonList}>
          <li>
            <Link className={styles.mainButton} to="/create">
              <span className={styles.mainSpan}>
                {T.translate('home.createLink')}
                <br />
                <img
                  className={styles.iconImg}
                  src="/media/elements/B-enterF.svg"
                />
              </span>
            </Link>
          </li>
          <li>
            <Link className={styles.smallButton} to="/gallery">
              {T.translate('home.galleryLink')}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  </div>;

export default Home;

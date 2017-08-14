import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Home.css';

const Home = () =>
  <header className={styles.home}>
    <h1 className={styles.title}>Master of Okolicne</h1>
    <p className={styles.highlight}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi
      repudiandae, distinctio doloremque repellat quo blanditiis, sequi
      laudantium quis repellendus eveniet magnam quasi tempora in exercitationem
      itaque alias minima quibusdam dolore.
    </p>
    <nav>
      <ul className={styles.navigation}>
        <li>
          <Link className={styles.button} to="/create">
            Create your own
          </Link>
          <Link className={styles.button} to="/gallery">
            Gallery
          </Link>
        </li>
      </ul>
    </nav>
  </header>;

export default Home;

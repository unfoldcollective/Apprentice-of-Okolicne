import React from 'react';
import Button from '../Button/Button.jsx';
import styles from './SaveDialog.css';

const SideInfo = ({ closeDialog, nextStep, saveStep }) =>
  <section className={styles.side}>
    <header>
      <h2 className={styles.sideTitle}>Save your creation</h2>
    </header>
    <p className={styles.text}>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </p>
    <footer className={styles.footer}>
      <Button className={styles.button} action={nextStep}>
        <img className={styles.buttonImage} src="/media/elements/B-nextF.svg" />
      </Button>
    </footer>
  </section>;

export default SideInfo;

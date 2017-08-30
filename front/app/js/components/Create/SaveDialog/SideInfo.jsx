import React from 'react';
import Button from '../Button/Button.jsx';
import styles from './SaveDialog.css';
import T from 'i18n-react';

const SideInfo = ({ closeDialog, nextStep, saveStep }) =>
  <section className={styles.side}>
    <header>
      <h2 className={styles.sideTitle}>{T.translate('save.title')}</h2>
    </header>
    <p className={styles.text}>
      {T.translate('save.help')}
    </p>
    <footer className={styles.footer}>
      <Button className={styles.button} action={nextStep}>
        <img className={styles.buttonImage} src="/media/elements/B-nextF.svg" />
      </Button>
    </footer>
  </section>;

export default SideInfo;

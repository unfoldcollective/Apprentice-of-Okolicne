import React from 'react';
import Button from '../Button/Button.jsx';

const SideInfo = ({ closeDialog, nextStep, saveStep }) =>
  <section className="SideInfo">
    <header>
      <h2>Save your creation</h2>
    </header>
    <footer>
      <Button action={nextStep}>Next</Button>
      <Button action={closeDialog}>Close</Button>
    </footer>
  </section>;

export default SideInfo;

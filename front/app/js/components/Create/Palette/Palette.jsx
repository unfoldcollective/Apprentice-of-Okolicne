import React from 'react';

import Draggable from '../Draggable/Draggable.jsx';
import Image from '../Image/Image.jsx';
import Button from '../Button/Button.jsx';

import styles from './Palette.css';

export default class Palette extends React.Component {
  constructor(props) {
    super(props);
  }

  getPaletteItems() {
    const items = this.props.d.map((d, i) => {
      return (
        <li className={styles.dragholder} key={`palette_${i}`}>
          <Draggable src={d.image} setDragStatus={this.props.setDragStatus}>
            <Image className={styles.item} src={d.image} text={d.text} />
          </Draggable>
        </li>
      );
    });

    return (
      <ul className={styles.list}>
        {items}
      </ul>
    );
  }

  render() {
    return (
      <section className={styles.palette}>
        <header>
          <h2 className={styles.title}>
            {this.props.title}
          </h2>
        </header>
        {this.getPaletteItems()}
        <div>
          <Button className={this.props.continue ? styles.button : styles.buttonDisabled} disabled={!this.props.continue} action={this.props.nextStep}>
            Continue
          </Button>
        </div>
      </section>
    );
  }
}

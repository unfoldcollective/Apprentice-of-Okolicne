import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import Draggable from '../Draggable/Draggable.jsx';
import Image from '../Image/Image.jsx';
import Button from '../Button/Button.jsx';

import styles from './Palette.css';

export default class Palette extends React.Component {
  getPaletteItems() {
    const items = this.props.d.map((d, i) => {
      return (
        <li
          className={cn(
            styles.dragholder,
            this.props.cl === 'pext' ? styles.itemPext : styles.item
          )}
          key={`palette_${i}`}
        >
          <Draggable src={d.image} setDragStatus={this.props.setDragStatus}>
            <Image
              className={
                this.props.cl === 'pext'
                  ? styles.itemImagePext
                  : styles.itemImage
              }
              src={d.image}
              text={d.text}
            />
          </Draggable>
        </li>
      );
    });

    return (
      <ul className={this.props.cl === 'pext' ? styles.listPext : styles.list}>
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

        <div className={styles.buttonList}>
          <div className={styles.mainButtons}>
            <Button className={styles.button}>
              <img
                className={styles.buttonImage}
                src="/media/elements/B-helpF.svg"
              />
            </Button>

            <Button
              className={
                this.props.continue ? styles.button : styles.buttonDisabled
              }
              disabled={!this.props.continue}
              action={this.props.nextStep}
            >
              <img
                className={styles.buttonImage}
                src="/media/elements/B-completeF.svg"
              />
            </Button>
          </div>
          <div className={styles.back}>
            <Link className={styles.blockButton} to="/">
              <img
                className={styles.buttonImage}
                src="/media/elements/B-homeF.svg"
              />
            </Link>
          </div>
        </div>
      </section>
    );
  }
}

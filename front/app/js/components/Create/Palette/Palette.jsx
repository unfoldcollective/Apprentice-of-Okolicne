import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

import Draggable from '../Draggable/Draggable.jsx';
import Image from '../Image/Image.jsx';
import Button from '../Button/Button.jsx';

import styles from './Palette.css';

export default class Palette extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      helpActive: false
    };
  }

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
              key={`${this.props.step}_palette_image_${i}`}
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

  componentDidMount() {
    this.helpVideo.addEventListener('ended', this.hideHelp.bind(this));

    if (this.props.step === 1) {
      // this.showHelp();
    }
  }

  componentWillUnmount() {
    this.helpVideo.removeEventListener('ended', this.hideHelp);
  }

  hideHelp() {
    this.setState({ helpActive: false });
  }

  showHelp() {
    this.helpVideo.currentTime = 0;
    this.helpVideo.play();
    this.setState({ helpActive: true });
  }

  render() {
    return (
      <section className={styles.palette}>
        {this.state.helpActive ? <div className={styles.overlay} /> : null}
        {this.getPaletteItems()}

        <div className={styles.buttonList}>
          <div className={styles.mainButtons}>
            <video
              ref={el => (this.helpVideo = el)}
              className={cn(styles.helpVideo, {
                [styles.helpVideoActive]: this.state.helpActive
              })}
              src={`/media/videos/${this.props.helpVideo}`}
            />

            <Button action={this.showHelp.bind(this)} className={styles.button}>
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

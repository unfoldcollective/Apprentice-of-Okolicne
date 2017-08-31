import React from 'react';
import styles from './Image.css';
import cn from 'classnames';

class Image extends React.Component {
  componentDidMount() {
    this.img.onload = () => {
      this.img.style.opacity = 1;
    };
  }

  render() {
    return (
      <img
        ref={el => (this.img = el)}
        className={cn(
          styles.img,
          this.props.className ? this.props.className : null
        )}
        src={`/media/images/${this.props.src}`}
      />
    );
  }
}

export default Image;

import React from 'react';

const Image = ({ src, className }) =>
  <img className={className ? className : null} src={`/media/images/${src}`} />;

export default Image;

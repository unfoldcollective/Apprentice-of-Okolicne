import React from 'react';

const Button = ({ disabled, action, children, className }) =>
  <button className={className} disabled={disabled} onClick={action}>
    {children}
  </button>;

export default Button;

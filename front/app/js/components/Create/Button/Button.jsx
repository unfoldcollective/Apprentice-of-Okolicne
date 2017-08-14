import React from 'react';

const Button = ({ disabled, action, children }) =>
  <button disabled={disabled} onClick={action}>
    {children}
  </button>;

export default Button;

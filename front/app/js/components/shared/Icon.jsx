import React from 'react';
import fa from 'font-awesome/css/font-awesome.css';
import cn from 'classnames';

const Icon = ({ name }) =>
  <i className={cn(fa.fa, fa[`fa-${name}`])} aria-hidden="true" />;

export default Icon;

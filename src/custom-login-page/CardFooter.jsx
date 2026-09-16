import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { LOGIN_PAGE, REGISTER_PAGE } from '../data/constants';
import { updatePathWithQueryParams } from '../data/utils';

const FOOTER_TARGET_BY_VARIANT = {
  login: REGISTER_PAGE,
  register: LOGIN_PAGE,
  password_reset: LOGIN_PAGE,
};

const CardFooter = ({ variant, label, text }) => {
  const target = FOOTER_TARGET_BY_VARIANT[variant];
  if (!target) {
    return null;
  }

  return (
    <div className="clp-card__footer">
      {text && <span className="clp-card__footer-text">{text}</span>}
      <Link to={updatePathWithQueryParams(target)}>{label}</Link>
    </div>
  );
};

CardFooter.propTypes = {
  variant: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  text: PropTypes.node,
};

CardFooter.defaultProps = {
  text: null,
};

export default CardFooter;

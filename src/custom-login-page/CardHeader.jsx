import React from 'react';

import PropTypes from 'prop-types';

const CardHeader = ({ title, subtitle }) => (
  <div className="clp-card__header">
    <span className="clp-card__icon" aria-hidden="true">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </span>
    <div className="clp-card__heading">
      <h2 className="clp-card__title">{title}</h2>
      {subtitle && <p className="clp-card__subtitle">{subtitle}</p>}
    </div>
  </div>
);

CardHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
};

CardHeader.defaultProps = {
  subtitle: null,
};

export default CardHeader;

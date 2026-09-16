import React from 'react';

import PropTypes from 'prop-types';

import { DEFAULT_COPY } from './defaults';

const HeroPanel = ({
  eyebrow, heading, headingHighlight, taglines, taglineEmphasis, ctas,
}) => (
  <div className="clp-marketing">
    {eyebrow && (
      <p className="clp-eyebrow">
        <span className="clp-dot" aria-hidden="true" />
        {eyebrow}
      </p>
    )}
    {(heading || headingHighlight) && (
      <h1 className="clp-heading">
        {heading}
        {headingHighlight && <span className="clp-heading__highlight">{headingHighlight}</span>}
      </h1>
    )}
    {(taglines.length > 0 || taglineEmphasis) && (
      <div className="clp-taglines">
        {taglines.map((tagline) => (
          <p className="clp-tagline" key={tagline}>{tagline}</p>
        ))}
        {taglineEmphasis && (
          <p className="clp-tagline clp-tagline--emphasis">{taglineEmphasis}</p>
        )}
      </div>
    )}
    {ctas.filter((cta) => cta && cta.label && cta.url).length > 0 && (
      <div className="clp-ctas">
        {ctas.filter((cta) => cta && cta.label && cta.url).map((cta) => (
          <a
            key={cta.url}
            className={`clp-cta clp-cta--${cta.style === 'primary' ? 'primary' : 'secondary'}`}
            href={cta.url}
            target={cta.new_tab ? '_blank' : undefined}
            rel={cta.new_tab ? 'noopener noreferrer' : undefined}
          >
            {cta.label}
            {cta.new_tab && (
              <>
                <span className="clp-cta__arrow" aria-hidden="true">{DEFAULT_COPY.submitArrow}</span>
                <span className="sr-only">{DEFAULT_COPY.ctaNewTabScreenReaderText}</span>
              </>
            )}
          </a>
        ))}
      </div>
    )}
  </div>
);

HeroPanel.propTypes = {
  eyebrow: PropTypes.node,
  heading: PropTypes.node,
  headingHighlight: PropTypes.node,
  taglines: PropTypes.arrayOf(PropTypes.node),
  taglineEmphasis: PropTypes.node,
  ctas: PropTypes.arrayOf(PropTypes.shape({})),
};

HeroPanel.defaultProps = {
  eyebrow: null,
  heading: null,
  headingHighlight: null,
  taglines: [],
  taglineEmphasis: null,
  ctas: [],
};

export default HeroPanel;

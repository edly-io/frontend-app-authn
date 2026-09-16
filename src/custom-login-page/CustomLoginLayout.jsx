import React from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import CardFooter from './CardFooter';
import CardHeader from './CardHeader';
import getCardVariant from './cardVariant';
import './custom-login-page.scss';
import HeroPanel from './HeroPanel';
import HeroSwooshes from './HeroSwooshes';

const CustomLoginLayout = ({
  children, hero, card, cssVars,
}) => {
  const { pathname } = useLocation();
  const showEmailCheck = useSelector((state) => state.emailCheck?.showEmailCheck);
  const variant = showEmailCheck ? 'email_check' : getCardVariant(pathname);
  const cardCopy = card[variant] || {};

  return (
    <div className="clp" style={cssVars}>
      <section className="clp-hero">
        <HeroSwooshes />
        <div className="clp-grid">
          <HeroPanel
            eyebrow={hero.eyebrow}
            heading={hero.heading}
            headingHighlight={hero.heading_highlight}
            taglines={hero.taglines}
            taglineEmphasis={hero.tagline_emphasis}
            ctas={hero.ctas}
          />
          <div className="clp-card">
            {cardCopy.title && <CardHeader title={cardCopy.title} subtitle={cardCopy.subtitle} />}
            <div className="clp-card__body">{children}</div>
            {cardCopy.footer && cardCopy.footer.label && (
              <CardFooter variant={variant} label={cardCopy.footer.label} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

CustomLoginLayout.propTypes = {
  children: PropTypes.node.isRequired,
  hero: PropTypes.shape({
    eyebrow: PropTypes.node,
    heading: PropTypes.node,
    heading_highlight: PropTypes.node,
    taglines: PropTypes.arrayOf(PropTypes.node),
    tagline_emphasis: PropTypes.node,
    ctas: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  card: PropTypes.objectOf(PropTypes.shape({})),
  cssVars: PropTypes.objectOf(PropTypes.string),
};

CustomLoginLayout.defaultProps = {
  hero: {},
  card: {},
  cssVars: {},
};

export default CustomLoginLayout;

import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Hyperlink, Image } from '@openedx/paragon';

import messages from './messages';

const LoginBrandPanel = () => {
  const { formatMessage } = useIntl();
  const config = getConfig();
  const logoUrl = config.LOGO_URL || config.LOGO_WHITE_URL;

  return (
    <section className="fbr-login-brand" aria-labelledby="fbr-login-brand-title">
      <div className="fbr-login-brand__glow" aria-hidden="true" />
      <header className="fbr-login-brand__header">
        <Hyperlink className="fbr-login-brand__logo-link" destination={config.MARKETING_SITE_BASE_URL}>
          <Image className="fbr-login-brand__logo" src={logoUrl} alt={config.SITE_NAME} />
        </Hyperlink>
        <div className="fbr-login-brand__organisation">
          <strong>{formatMessage(messages['login.brand.organisation'])}</strong>
          <span>{formatMessage(messages['login.brand.directorate'])}</span>
        </div>
      </header>

      <div className="fbr-login-brand__body">
        <div className="fbr-login-brand__kicker">
          {formatMessage(messages['login.brand.platform'])}
        </div>
        <h1 id="fbr-login-brand-title">
          {formatMessage(messages['login.brand.start.learning'])}
          <strong>{formatMessage(messages['login.brand.with.site'], { siteName: config.SITE_NAME })}</strong>
        </h1>
        <p>{formatMessage(messages['login.brand.description'])}</p>
      </div>

      <svg
        className="fbr-login-brand__skyline"
        viewBox="0 0 720 262"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        preserveAspectRatio="xMidYMax meet"
      >
        <g transform="translate(-180 0)">
          <path d="M220 220 Q248 176 292 166 H308 Q352 176 380 220" />
          <path d="M244 220 Q264 190 294 182 H306 Q336 190 356 220" />
          <path d="M291 166 L295 64 H305 L309 166 M293 102 H307 M294 130 H306" />
          <path d="M288 64 H312 M290 58 H310 M292 58 Q300 30 308 58 M300 30 V14" />
        </g>
        <g transform="translate(60 0)">
          <path d="M300 104 L354 196 H246 Z M300 130 L334 196 M300 130 L266 196" />
          <path d="M238 196 H362 M238 220 V196 M362 220 V196" />
          <path d="M214 220 V58 M386 220 V58 M210 58 L214 42 L218 58 M382 58 L386 42 L390 58" />
          <path d="M300 104 V88" />
        </g>
        <g transform="translate(300 0)">
          <path d="M226 220 V206 H374 V220 M240 206 V124 H360 V206 M234 124 H366" />
          <path d="M254 124 C254 86 274 62 300 62 C326 62 346 86 346 124 M300 62 V40" />
          <path d="M256 206 V170 A13 13 0 0 1 282 170 V206" />
          <path d="M287 206 V170 A13 13 0 0 1 313 170 V206" />
          <path d="M318 206 V170 A13 13 0 0 1 344 170 V206" />
        </g>
        <path d="M0 220.5 H720" />
      </svg>
    </section>
  );
};

export default LoginBrandPanel;

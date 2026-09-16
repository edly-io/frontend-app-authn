import React from 'react';

const HeroSwooshes = () => (
  <svg
    className="clp-hero__swoosh"
    viewBox="0 0 600 500"
    preserveAspectRatio="xMaxYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M600 0 C600 0 380 60 300 180 C220 300 260 400 180 460 C100 520 20 500 0 500 L0 0 Z"
      fill="var(--clp-bg-band)"
      opacity="0.12"
    />
    <path
      d="M600 50 C600 50 420 100 340 210 C260 320 290 420 210 475"
      stroke="var(--clp-bg-band-2)"
      strokeWidth="70"
      fill="none"
      strokeLinecap="round"
      opacity="0.14"
    />
    <path
      d="M440 -40 C520 -20 600 40 600 120"
      stroke="var(--clp-accent-soft)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
);

export default HeroSwooshes;

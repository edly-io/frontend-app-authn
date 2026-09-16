import { useMemo } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { getLocale } from '@edx/frontend-platform/i18n';

import { DEFAULT_PALETTE } from './defaults';
import { sanitizeCtaUrl, sanitizePalette } from './sanitize';

const DISABLED_CONFIG = { enabled: false };

const resolveByLanguageOverrides = (raw) => {
  const byLanguage = raw.by_language || {};
  const language = (getLocale() || '').toLowerCase();
  const candidates = [language, language.split('-')[0]].filter(Boolean);
  const code = candidates.find((candidate) => byLanguage[candidate]);
  return code ? byLanguage[code] : null;
};

const buildCssVars = (palette) => Object.entries(palette).reduce((vars, [key, value]) => ({
  ...vars,
  [`--clp-${key}`]: value,
}), {});

const resolveCustomLoginPage = () => {
  try {
    const raw = getConfig().CUSTOM_LOGIN_PAGE;
    if (!raw || raw.enabled !== true) {
      return DISABLED_CONFIG;
    }

    let hero = raw.hero || {};
    let card = raw.card || {};

    const overrides = resolveByLanguageOverrides(raw);
    if (overrides) {
      hero = { ...hero, ...(overrides.hero || {}) };
      card = { ...card, ...(overrides.card || {}) };
    }

    const rawCtas = Array.isArray(hero.ctas) ? hero.ctas : [];
    const ctas = rawCtas
      .filter((cta) => cta && cta.label && sanitizeCtaUrl(cta.url))
      .map((cta) => ({ ...cta, url: sanitizeCtaUrl(cta.url) }));

    const palette = sanitizePalette(raw.palette || {}, DEFAULT_PALETTE);
    const cssVars = buildCssVars({ ...DEFAULT_PALETTE, ...palette });

    return {
      enabled: true,
      hero: { ...hero, ctas },
      card,
      cssVars,
    };
  } catch (error) {
    return DISABLED_CONFIG;
  }
};

const useCustomLoginPage = () => useMemo(() => resolveCustomLoginPage(), []);

export default useCustomLoginPage;

import { mergeConfig } from '@edx/frontend-platform';
import { getLocale } from '@edx/frontend-platform/i18n';
import { renderHook } from '@testing-library/react';

import useCustomLoginPage from '../useCustomLoginPage';

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(() => 'en'),
}));

describe('useCustomLoginPage', () => {
  afterEach(() => {
    mergeConfig({ CUSTOM_LOGIN_PAGE: undefined });
    getLocale.mockReturnValue('en');
  });

  it('is disabled when the config key is absent', () => {
    const { result } = renderHook(() => useCustomLoginPage());
    expect(result.current).toEqual({ enabled: false });
  });

  it('is disabled when enabled is false', () => {
    mergeConfig({ CUSTOM_LOGIN_PAGE: { enabled: false } });
    const { result } = renderHook(() => useCustomLoginPage());
    expect(result.current).toEqual({ enabled: false });
  });

  it('is disabled when enabled is a truthy string rather than the boolean true', () => {
    mergeConfig({ CUSTOM_LOGIN_PAGE: { enabled: 'true' } });
    const { result } = renderHook(() => useCustomLoginPage());
    expect(result.current).toEqual({ enabled: false });
  });

  it('does not throw when hero is malformed', () => {
    mergeConfig({ CUSTOM_LOGIN_PAGE: { enabled: true, hero: { ctas: 'not-an-array' } } });
    expect(() => renderHook(() => useCustomLoginPage())).not.toThrow();
  });

  it('applies by_language overrides for the matching base language only', () => {
    mergeConfig({
      CUSTOM_LOGIN_PAGE: {
        enabled: true,
        hero: { heading: 'English heading' },
        by_language: {
          ar: { hero: { heading: 'Arabic heading' } },
        },
      },
    });

    getLocale.mockReturnValue('ar-sa');
    const { result: arResult } = renderHook(() => useCustomLoginPage());
    expect(arResult.current.hero.heading).toEqual('Arabic heading');

    getLocale.mockReturnValue('en');
    const { result: enResult } = renderHook(() => useCustomLoginPage());
    expect(enResult.current.hero.heading).toEqual('English heading');
  });

  it('drops an unsafe cta url while keeping a safe one', () => {
    mergeConfig({
      CUSTOM_LOGIN_PAGE: {
        enabled: true,
        hero: {
          ctas: [
            { label: 'Go', url: '//evil.com' },
            { label: 'Ok', url: '/dashboard' },
          ],
        },
      },
    });

    const { result } = renderHook(() => useCustomLoginPage());
    expect(result.current.hero.ctas).toEqual([{ label: 'Ok', url: '/dashboard' }]);
  });

  it('drops palette overrides that are not on the allowlist', () => {
    mergeConfig({
      CUSTOM_LOGIN_PAGE: {
        enabled: true,
        palette: { bg: '#111111', notAllowlisted: '#222222' },
      },
    });

    const { result } = renderHook(() => useCustomLoginPage());
    expect(result.current.cssVars['--clp-bg']).toEqual('#111111');
    expect(result.current.cssVars['--clp-notAllowlisted']).toBeUndefined();
  });
});

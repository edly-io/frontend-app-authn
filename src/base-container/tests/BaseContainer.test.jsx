import React from 'react';
import { Provider } from 'react-redux';

import { mergeConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import BaseContainer from '../index';

const mockStore = configureStore();
const store = mockStore({ emailCheck: {} });

const LargeScreen = {
  wrappingComponent: ResponsiveContext.Provider,
  wrappingComponentProps: { value: { width: 1200 } },
};

describe('Base component tests', () => {
  afterEach(() => {
    mergeConfig({ ENABLE_IMAGE_LAYOUT: false, CUSTOM_LOGIN_PAGE: undefined });
  });

  it('should show default layout', () => {
    const { container } = render(
      <IntlProvider locale="en">
        <Provider store={store}>
          <MemoryRouter>
            <BaseContainer>
              <div>Test Content</div>
            </BaseContainer>
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
      LargeScreen,
    );

    expect(container.querySelector('.banner__image')).toBeNull();
    expect(container.querySelector('.large-screen-svg-primary')).toBeDefined();
  });

  it('renders Image layout when ENABLE_IMAGE_LAYOUT configuration is enabled', () => {
    mergeConfig({
      ENABLE_IMAGE_LAYOUT: true,
    });

    const { container } = render(
      <IntlProvider locale="en">
        <Provider store={store}>
          <MemoryRouter>
            <BaseContainer showWelcomeBanner={false}>
              <div>Test Content</div>
            </BaseContainer>
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
      LargeScreen,
    );

    expect(container.querySelector('.banner__image')).toBeDefined();
  });

  it('renders the custom login layout when CUSTOM_LOGIN_PAGE is enabled', () => {
    mergeConfig({
      CUSTOM_LOGIN_PAGE: { enabled: true },
    });

    const { container } = render(
      <IntlProvider locale="en">
        <Provider store={store}>
          <MemoryRouter>
            <BaseContainer>
              <div>Test Content</div>
            </BaseContainer>
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
      LargeScreen,
    );

    expect(container.querySelector('.clp')).toBeDefined();
    expect(container.querySelector('.large-screen-svg-primary')).toBeNull();
  });

  it('falls through to the default layout on the welcome banner even when CUSTOM_LOGIN_PAGE is enabled', () => {
    mergeConfig({
      CUSTOM_LOGIN_PAGE: { enabled: true },
    });

    const { container } = render(
      <IntlProvider locale="en">
        <Provider store={store}>
          <MemoryRouter>
            <BaseContainer showWelcomeBanner fullName="Jane Doe">
              <div>Test Content</div>
            </BaseContainer>
          </MemoryRouter>
        </Provider>
      </IntlProvider>,
      LargeScreen,
    );

    expect(container.querySelector('.clp')).toBeNull();
  });
});

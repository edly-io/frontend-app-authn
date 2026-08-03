import React from 'react';
import { Provider } from 'react-redux';

import { IntlProvider } from '@edx/frontend-platform/i18n';
import { MemoryRouter } from 'react-router-dom';

/**
 * Wraps a component with the IntlProvider/MemoryRouter/Provider stack that most
 * connected page/modal tests in this app need. Router-specific mocks (useNavigate,
 * useLocation, etc.) still belong in each test file, since the mocked shape differs
 * per component.
 */
const reduxWrapper = (store, children) => (
  <IntlProvider locale="en">
    <MemoryRouter>
      <Provider store={store}>{children}</Provider>
    </MemoryRouter>
  </IntlProvider>
);

export default reduxWrapper;

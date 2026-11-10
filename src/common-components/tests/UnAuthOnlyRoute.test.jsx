/* eslint-disable import/no-import-module-exports */
/* eslint-disable react/function-component-definition */
import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { render, screen } from '@testing-library/react';
import {
  MemoryRouter, Route, BrowserRouter as Router, Routes,
} from 'react-router-dom';

import { UnAuthOnlyRoute } from '..';
import { DEFAULT_REDIRECT_URL, REGISTER_PAGE } from '../../data/constants';

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedUser: jest.fn(),
}));

const RRD = require('react-router-dom');
// Just render plain div with its children
// eslint-disable-next-line react/prop-types
RRD.BrowserRouter = ({ children }) => <div>{ children }</div>;
module.exports = RRD;

const TestApp = () => (
  <Router>
    <div>
      <Routes>
        <Route path={REGISTER_PAGE} element={<UnAuthOnlyRoute><span>Register Page</span></UnAuthOnlyRoute>} />
      </Routes>
    </div>
  </Router>
);

describe('UnAuthOnlyRoute', () => {
  const routerWrapper = () => (
    <MemoryRouter initialEntries={[REGISTER_PAGE]}>
      <TestApp />
    </MemoryRouter>
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('redirects an authenticated user', () => {
    const user = {
      username: 'gonzo',
      other: 'data',
    };

    getAuthenticatedUser.mockReturnValue(user);
    render(routerWrapper());

    expect(screen.queryByText('Register Page')).toBeNull();
    expect(getAuthenticatedUser).toHaveBeenCalled();
    expect(global.location.replace).toHaveBeenCalledWith(
      getConfig().LMS_BASE_URL.concat(DEFAULT_REDIRECT_URL),
    );
  });

  it('renders the route immediately for an unauthenticated user', () => {
    getAuthenticatedUser.mockReturnValue(null);
    render(routerWrapper());

    expect(screen.getByText('Register Page')).toBeDefined();
    expect(getAuthenticatedUser).toHaveBeenCalled();
  });
});

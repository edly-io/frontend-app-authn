/* eslint-disable import/no-import-module-exports */
/* eslint-disable react/function-component-definition */
import React from 'react';

import { getConfig } from '@edx/frontend-platform';
import { fetchAuthenticatedUser, getAuthenticatedUser } from '@edx/frontend-platform/auth';
import { act, render, screen } from '@testing-library/react';
import {
  MemoryRouter, Route, BrowserRouter as Router, Routes,
} from 'react-router-dom';

import { UnAuthOnlyRoute } from '..';
import { DEFAULT_REDIRECT_URL, REGISTER_PAGE } from '../../data/constants';

jest.mock('@edx/frontend-platform/auth', () => ({
  fetchAuthenticatedUser: jest.fn(),
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

  const user = {
    username: 'gonzo',
    other: 'data',
  };

  const renderAndSettle = async () => {
    await act(async () => {
      render(routerWrapper());
    });
  };

  it('redirects a user the LMS still recognises', async () => {
    getAuthenticatedUser.mockReturnValue(user);
    fetchAuthenticatedUser.mockResolvedValueOnce(user);
    await renderAndSettle();

    expect(fetchAuthenticatedUser).toHaveBeenCalledWith({ forceRefresh: true });
    expect(screen.queryByText('Register Page')).toBeNull();
    expect(global.location.replace).toHaveBeenCalledWith(
      getConfig().LMS_BASE_URL.concat(DEFAULT_REDIRECT_URL),
    );
  });

  it('renders the route when the LMS no longer recognises the cookie user', async () => {
    getAuthenticatedUser.mockReturnValue(user);
    fetchAuthenticatedUser.mockResolvedValueOnce(null);
    await renderAndSettle();

    expect(screen.getByText('Register Page')).toBeDefined();
    expect(global.location.replace).not.toHaveBeenCalled();
  });

  it('renders the route when verifying the user fails', async () => {
    getAuthenticatedUser.mockReturnValue(user);
    fetchAuthenticatedUser.mockRejectedValueOnce(new Error('blocked'));
    await renderAndSettle();

    expect(screen.getByText('Register Page')).toBeDefined();
    expect(global.location.replace).not.toHaveBeenCalled();
  });

  it('renders the route when verifying the user does not answer in time', async () => {
    jest.useFakeTimers();
    getAuthenticatedUser.mockReturnValue(user);
    fetchAuthenticatedUser.mockReturnValueOnce(new Promise(() => {}));
    await renderAndSettle();
    expect(screen.queryByText('Register Page')).toBeNull();

    await act(async () => {
      jest.runAllTimers();
    });

    expect(screen.getByText('Register Page')).toBeDefined();
    expect(global.location.replace).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('renders the route immediately for an unauthenticated user', () => {
    getAuthenticatedUser.mockReturnValue(null);
    render(routerWrapper());

    expect(screen.getByText('Register Page')).toBeDefined();
    expect(fetchAuthenticatedUser).not.toHaveBeenCalled();
  });
});

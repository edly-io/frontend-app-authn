import React from 'react';
import { Provider } from 'react-redux';

import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';

import { LOGIN_PAGE, REGISTER_PAGE } from '../../data/constants';
import CustomLoginLayout from '../CustomLoginLayout';

const mockStore = configureStore();

const renderLayout = (props = {}, { route = LOGIN_PAGE, showEmailCheck = false } = {}) => {
  const store = mockStore({ emailCheck: { showEmailCheck } });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <CustomLoginLayout hero={{}} card={{}} cssVars={{ '--clp-bg': '#000000' }} {...props}>
          <div>form body</div>
        </CustomLoginLayout>
      </MemoryRouter>
    </Provider>,
  );
};

describe('CustomLoginLayout', () => {
  it('renders children inside the card body', () => {
    const { container } = renderLayout();
    expect(container.querySelector('.clp-card__body').textContent).toEqual('form body');
  });

  it('suppresses the header when the resolved variant has no title', () => {
    const { container } = renderLayout({ card: { login: {} } });
    expect(container.querySelector('.clp-card__header')).toBeNull();
  });

  it('resolves the card variant from the route', () => {
    const { container } = renderLayout(
      { card: { register: { title: 'Join us' } } },
      { route: REGISTER_PAGE },
    );
    expect(container.querySelector('.clp-card__title').textContent).toEqual('Join us');
  });

  it('switches to the email_check variant when showEmailCheck is true', () => {
    const { container } = renderLayout(
      { card: { login: { title: 'Sign in' }, email_check: { title: 'Check your email' } } },
      { showEmailCheck: true },
    );
    expect(container.querySelector('.clp-card__title').textContent).toEqual('Check your email');
  });

  it('applies the resolved css vars on the layout root', () => {
    const { container } = renderLayout({ cssVars: { '--clp-bg': 'red' } });
    expect(container.querySelector('.clp').style.getPropertyValue('--clp-bg')).toEqual('red');
  });

  it('does not render a cta that is missing a url', () => {
    const { container } = renderLayout({ hero: { ctas: [{ label: 'Broken' }] } });
    expect(container.querySelector('.clp-cta')).toBeNull();
  });

  it('renders the footer link only when the variant supplies a footer label', () => {
    const { container } = renderLayout({ card: { login: { footer: { label: 'Create an account' } } } });
    expect(container.querySelector('.clp-card__footer').textContent).toEqual('Create an account');
  });
});

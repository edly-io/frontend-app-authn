import { LOGIN_PAGE, REGISTER_PAGE, RESET_PAGE } from '../data/constants';

const ROUTE_VARIANTS = {
  [LOGIN_PAGE]: 'login',
  [REGISTER_PAGE]: 'register',
  [RESET_PAGE]: 'password_reset',
};

const getCardVariant = (pathname) => ROUTE_VARIANTS[pathname] || 'login';

export default getCardVariant;

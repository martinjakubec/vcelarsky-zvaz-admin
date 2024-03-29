import {Route} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {LoginPage} from '../pages/Login';

export const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

import {Route} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {Signup} from '../pages/SignUp';

export const signupRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Signup,
});

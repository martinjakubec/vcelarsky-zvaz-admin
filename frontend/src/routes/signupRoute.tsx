import {Route, createRoute} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {Signup} from '../pages/SignUp';

export const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: Signup,
});

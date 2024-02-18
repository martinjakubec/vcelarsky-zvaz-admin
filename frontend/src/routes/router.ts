import {Router} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {homeRoute} from './homeRoute';
import {loginRoute} from './loginRoute';
import {signupRoute} from './signupRoute';
import {districts, districtsSingle} from './districtsRoute';

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  signupRoute,
  districts,
  districtsSingle,
]);

export const router = new Router({routeTree});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

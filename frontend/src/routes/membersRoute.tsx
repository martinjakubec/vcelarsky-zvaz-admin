import {Route} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {Home} from '../pages/Home';

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

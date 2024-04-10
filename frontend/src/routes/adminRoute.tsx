import {createRoute} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import { AdminPage } from '../pages/Admin';

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPage,
});

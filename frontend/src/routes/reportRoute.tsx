import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './rootRoute';
import { ReportPage } from '../pages/Reports';

export const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportPage,
});

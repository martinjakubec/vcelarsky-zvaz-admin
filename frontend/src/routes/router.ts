import {Router} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {indexRoute} from './indexRoute';
import {aboutRoute} from './aboutRoute';

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

export const router = new Router({routeTree});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

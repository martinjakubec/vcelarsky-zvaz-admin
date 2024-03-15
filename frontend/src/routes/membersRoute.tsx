import {Route} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {Home} from '../pages/Home';
import { Members } from '../pages/Members';
import { MembersSingle } from '../pages/MembersSingle';

export const members = new Route({
  getParentRoute: () => rootRoute,
  path: '/members',
  component: Members,
});

export const membersSingle = new Route({
  getParentRoute: () => rootRoute,
  path: '/members/$id',
  component: MembersSingle,
});
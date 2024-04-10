import {Route, createRoute} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {Home} from '../pages/Home';
import { Members } from '../pages/Members';
import { MembersSingle } from '../pages/MembersSingle';

export const members = createRoute({
  getParentRoute: () => rootRoute,
  path: '/members',
  component: Members,
});

export const membersSingle = createRoute({
  getParentRoute: () => rootRoute,
  path: '/members/$id',
  component: MembersSingle,
});
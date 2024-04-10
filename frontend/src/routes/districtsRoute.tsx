import {Route, createRoute} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {Districts} from '../pages/Districts';
import {DistrictsSingle} from '../pages/DistrictsSingle';

export const districts = createRoute({
  getParentRoute: () => rootRoute,
  path: '/districts',
  component: Districts,
});

export const districtsSingle = createRoute({
  getParentRoute: () => rootRoute,
  path: '/districts/$id',
  component: DistrictsSingle,
});

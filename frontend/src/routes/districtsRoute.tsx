import {Route} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';
import {Districts} from '../pages/Districts';
import {DistrictsSingle} from '../pages/DistrictsSingle';

export const districts = new Route({
  getParentRoute: () => rootRoute,
  path: '/districts',
  component: Districts,
});

export const districtsSingle = new Route({
  getParentRoute: () => rootRoute,
  path: '/districts/$id',
  component: DistrictsSingle,
});

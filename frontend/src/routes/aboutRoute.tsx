import {Route} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';

export const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: function About() {
    return (
      <div className="p-2">
        <h3>About us!</h3>
      </div>
    );
  },
});

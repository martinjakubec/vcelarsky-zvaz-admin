import {Route} from '@tanstack/react-router';
import {rootRoute} from './rootRoute';

export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Welcome Home!</h3>
      </div>
    );
  },
});

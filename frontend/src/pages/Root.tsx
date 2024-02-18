import {Link, Outlet} from '@tanstack/react-router';
import {TanStackRouterDevtools} from '@tanstack/router-devtools';
import { Navbar } from '../components/Navbar';

export function Root() {
  return (
    <>
      <Navbar />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

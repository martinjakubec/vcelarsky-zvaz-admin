import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./rootRoute";
import { homeRoute } from "./homeRoute";
import { loginRoute } from "./loginRoute";
import { signupRoute } from "./signupRoute";
import { districts, districtsSingle } from "./districtsRoute";
import { members, membersSingle } from "./membersRoute";
import { adminRoute } from "./adminRoute";
import { reportsRoute } from "./reportRoute";

const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  signupRoute,
  districts,
  districtsSingle,
  members,
  membersSingle,
  adminRoute,
  reportsRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

import React from "react";
import authRoute from "./authRoute";
import { ADMIN, USER } from "constants/roles.constant";

export const publicRoutes = [...authRoute];

export const protectedRoutes = [
  {
    key: "home",
    path: "/home",
    component: React.lazy(() => import("views/private/ProjectDashboard")),
    authority: [ADMIN],
  },
  {
    key: "projects",
    path: "/projects",
    component: React.lazy(() => import("views/private/ProjectsView")),
    authority: [ADMIN],
  },
  {
    key: "pages.accessDenied",
    path: "/access-denied",
    component: React.lazy(() => import("views/private/AccessDenied")),
    authority: [ADMIN, USER],
  },
];

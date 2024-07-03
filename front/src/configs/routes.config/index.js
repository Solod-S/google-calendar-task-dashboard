import React from "react";
import authRoute from "./authRoute";

export const publicRoutes = [...authRoute];

export const protectedRoutes = [
  {
    key: "home",
    path: "/home",
    component: React.lazy(() => import("views/private/ProjectDashboard")),
    // component: React.lazy(() => import("views/private/Home")),
    authority: [],
  },
  {
    key: "projects",
    path: "/projects",
    component: React.lazy(() => import("views/private/ProjectsView")),
    authority: [],
  },
];

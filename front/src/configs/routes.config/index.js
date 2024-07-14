import React from "react";
import authRoute from "./authRoute";

export const publicRoutes = [...authRoute];

export const protectedRoutes = [
  {
    key: "home",
    path: "/home",
    component: React.lazy(() => import("views/private/ProjectDashboard")),
    authority: ["user", "admin"],
  },
  {
    key: "projects",
    path: "/projects",
    component: React.lazy(() => import("views/private/ProjectsView")),
    authority: ["admin"],
  },
];

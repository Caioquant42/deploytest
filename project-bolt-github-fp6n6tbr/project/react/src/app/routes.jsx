import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";
import materialRoutes from "app/views/material-kit/MaterialRoutes";
import recomendationsRoutes from "app/views/recomendations/recommendations-routes";
import screenerRoutes from "app/views/screener/screener-routes";
import zboardRoutes from "app/views/zboard/zboard-routes";
import volatilidadeRoutes from "app/views/volatilidade/volatilidade-routes";
import rrgRoutes from "app/views/rrg/rrg-routes";
import survivalRoutes from "app/views/survival/survival-routes";
import portfolioRoutes from "app/views/portfolio/portfolio-routes";
import fundamentosRoutes from "app/views/fundamentos/fundamentos-routes";

// E-CHART PAGE
const AppEchart = Loadable(lazy(() => import("app/views/charts/echarts/AppEchart")));
// DASHBOARD PAGE
const Analytics = Loadable(lazy(() => import("app/views/dashboard/Analytics")));


const routes = [
  { path: "/", element: <Navigate to="zboard/dashboard" /> },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...materialRoutes,
      ...recomendationsRoutes,
      ...screenerRoutes,
      ...zboardRoutes,
      ...volatilidadeRoutes,
      ...rrgRoutes,
      ...survivalRoutes,
      ...portfolioRoutes,
      ...fundamentosRoutes,
      // dashboard route
      { path: "/dashboard/default", element: <Analytics />, auth: authRoles.admin },
      // e-chart route
      { path: "/charts/echarts", element: <AppEchart />, auth: authRoles.editor }
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;

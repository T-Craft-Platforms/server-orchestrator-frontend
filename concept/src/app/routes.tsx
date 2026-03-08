import { createBrowserRouter, Navigate, useParams } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { GlobalDashboard } from "./pages/global/GlobalDashboard";
import { NamespaceDashboard } from "./pages/namespace/NamespaceDashboard";
import { Namespaces } from "./pages/global/Namespaces";
import { Servers } from "./pages/namespace/Servers";
import { ServerDetail } from "./pages/namespace/ServerDetail";
import { GlobalTemplates } from "./pages/global/GlobalTemplates";
import { NamespaceTemplates } from "./pages/namespace/NamespaceTemplates";
import { GlobalResources } from "./pages/global/GlobalResources";
import { NamespaceResources } from "./pages/namespace/NamespaceResources";
import { GlobalSettings } from "./pages/global/GlobalSettings";
import { GlobalUsers } from "./pages/global/GlobalUsers";
import { GlobalUserDetail } from "./pages/global/GlobalUserDetail";
import { NamespaceUsers } from "./pages/namespace/NamespaceUsers";
import { TemplateDetail } from "./pages/TemplateDetail";
import { ResourceDetail } from "./pages/ResourceDetail";
import { NamespaceSettings } from "./pages/namespace/NamespaceSettings";

function ProjectRouteRedirect() {
  const { id } = useParams();
  if (!id) {
    return <Navigate to="/global/projects" replace />;
  }
  return <Navigate to={`/namespace/${id}/dashboard`} replace />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/global/dashboard" replace /> },
      
      // Global Routes
      { path: "global/dashboard", Component: GlobalDashboard },
      { path: "global/projects", Component: Namespaces },
      { path: "global/projects/:id", Component: ProjectRouteRedirect },
      { path: "global/namespaces", Component: Namespaces },
      { path: "global/namespaces/:id", Component: ProjectRouteRedirect },
      { path: "global/templates", Component: GlobalTemplates },
      { path: "global/templates/:id", Component: TemplateDetail },
      { path: "global/resources", Component: GlobalResources },
      { path: "global/resources/:id", Component: ResourceDetail },
      { path: "global/users", Component: GlobalUsers },
      { path: "global/users/:id", Component: GlobalUserDetail },
      { path: "global/settings", Component: GlobalSettings },
      
      // Namespace Routes
      { path: "namespace/:identifier/dashboard", Component: NamespaceDashboard },
      { path: "namespace/:identifier/servers", Component: Servers },
      { path: "namespace/:identifier/servers/:id", Component: ServerDetail },
      { path: "namespace/:identifier/templates", Component: NamespaceTemplates },
      { path: "namespace/:identifier/templates/:id", Component: TemplateDetail },
      { path: "namespace/:identifier/resources", Component: NamespaceResources },
      { path: "namespace/:identifier/resources/:id", Component: ResourceDetail },
      { path: "namespace/:identifier/users", Component: NamespaceUsers },
      { path: "namespace/:identifier/settings", Component: NamespaceSettings },

      // Project Aliases
      { path: "project/:identifier/dashboard", Component: NamespaceDashboard },
      { path: "project/:identifier/servers", Component: Servers },
      { path: "project/:identifier/servers/:id", Component: ServerDetail },
      { path: "project/:identifier/templates", Component: NamespaceTemplates },
      { path: "project/:identifier/templates/:id", Component: TemplateDetail },
      { path: "project/:identifier/resources", Component: NamespaceResources },
      { path: "project/:identifier/resources/:id", Component: ResourceDetail },
      { path: "project/:identifier/users", Component: NamespaceUsers },
      { path: "project/:identifier/settings", Component: NamespaceSettings },

      // Fallback
      { path: "*", element: <Navigate to="/global/dashboard" replace /> },
    ],
  },
]);

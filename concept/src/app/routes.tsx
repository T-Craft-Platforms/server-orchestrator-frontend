import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { GlobalDashboard } from "./pages/global/GlobalDashboard";
import { NamespaceDashboard } from "./pages/namespace/NamespaceDashboard";
import { Namespaces } from "./pages/global/Namespaces";
import { NamespaceDetail } from "./pages/NamespaceDetail";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/global/dashboard" replace /> },
      
      // Global Routes
      { path: "global/dashboard", Component: GlobalDashboard },
      { path: "global/namespaces", Component: Namespaces },
      { path: "global/namespaces/:id", Component: NamespaceDetail },
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
    ],
  },
]);

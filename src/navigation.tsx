import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  createRoute,
  Outlet,
  useRouter,
  notFound,
} from "@tanstack/react-router";
import { useEffect } from "react";

import { reportLovableError } from "./lib/lovable-error-reporting";

// Import components
import Connexion from "./pages/Connexion";
import Inscription from "./pages/Inscription";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { Customers } from "./pages/admin/Customers";
import { Drivers } from "./pages/admin/Drivers";
import { DriverDetails } from "./pages/admin/DriverDetails";
import { DriverValidation } from "./pages/admin/DriverValidation";
import { Finance } from "./pages/admin/Finance";
import { Reviews } from "./pages/admin/Reviews";
import { Trips } from "./pages/admin/Trips";

// Mock data for loader
import { drivers } from "./lib/mock-data";

// Root components
const NotFoundComponent = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="max-w-md text-center">
      <h1 className="text-7xl font-bold text-foreground">404</h1>
      <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
    </div>
  </div>
);

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function RootComponent() {
  const { queryClient } = rootRoute.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

// 1. Root Route
export const rootRoute = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// 2. Public Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Connexion,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: Inscription,
});

// 3. Admin routes
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin",
  component: AdminLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/dashboard",
  component: Dashboard,
});

const customersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/customers",
  component: Customers,
});

const validationsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/validations",
  component: DriverValidation,
});

const driversRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/drivers",
  component: Drivers,
});

const driverDetailsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/drivers/$id",
  loader: ({ params }): { driver: (typeof drivers)[number]; } => {
    const driver = drivers.find((d) => d.id === params.id);
    if (!driver) throw notFound();
    return { driver };
  },
  component: DriverDetails,
});

const financeRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/finance",
  component: Finance,
});

const reviewsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/reviews",
  component: Reviews,
});

const tripsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/trips",
  component: Trips,
});

// 4. Route Tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  signupRoute,
  adminLayoutRoute.addChildren([
    dashboardRoute,
    validationsRoute,
    customersRoute,
    driversRoute,
    driverDetailsRoute,
    financeRoute,
    reviewsRoute,
    tripsRoute,
  ]),
]);

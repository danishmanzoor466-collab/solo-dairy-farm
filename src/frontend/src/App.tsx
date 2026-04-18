import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AdminLayout } from "./components/AdminLayout";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ContactPage } from "./pages/ContactPage";
import { CowsPage } from "./pages/CowsPage";
import { HomePage } from "./pages/HomePage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { ProductsPage } from "./pages/ProductsPage";
import { AdminCowsPage } from "./pages/admin/AdminCowsPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminEnquiriesPage } from "./pages/admin/AdminEnquiriesPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public layout wrapper
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public-layout",
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// Public pages
const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/about",
  component: AboutPage,
});

const productsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/products",
  component: ProductsPage,
});

const cowsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/cows",
  component: CowsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/contact",
  component: ContactPage,
});

const cartRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/cart",
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const orderSuccessRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/order-success",
  component: OrderSuccessPage,
});

// Admin layout wrapper
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminLayout,
});

// Admin pages (nested under AdminLayout which renders Outlet)
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/",
  component: AdminDashboardPage,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/products",
  component: AdminProductsPage,
});

const adminCowsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/cows",
  component: AdminCowsPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/orders",
  component: AdminOrdersPage,
});

const adminEnquiriesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/enquiries",
  component: AdminEnquiriesPage,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/settings",
  component: AdminSettingsPage,
});

// Build the router tree
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    aboutRoute,
    productsRoute,
    cowsRoute,
    contactRoute,
    cartRoute,
    checkoutRoute,
    orderSuccessRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProductsRoute,
    adminCowsRoute,
    adminOrdersRoute,
    adminEnquiriesRoute,
    adminSettingsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

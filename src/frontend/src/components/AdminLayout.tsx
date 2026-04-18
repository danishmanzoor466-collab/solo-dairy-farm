import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  Beef,
  ClipboardList,
  LogIn,
  Menu,
  MessageSquare,
  Package,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { useIsAdmin } from "../hooks/useBackend";
import { Button } from "./ui/button";

const sidebarLinks = [
  {
    to: "/admin/",
    label: "Dashboard",
    icon: BarChart3,
    ocid: "admin_nav.dashboard_link",
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: Package,
    ocid: "admin_nav.products_link",
  },
  { to: "/admin/cows", label: "Cows", icon: Beef, ocid: "admin_nav.cows_link" },
  {
    to: "/admin/orders",
    label: "Orders",
    icon: ClipboardList,
    ocid: "admin_nav.orders_link",
  },
  {
    to: "/admin/enquiries",
    label: "Enquiries",
    icon: MessageSquare,
    ocid: "admin_nav.enquiries_link",
  },
  {
    to: "/admin/settings",
    label: "Settings",
    icon: Settings,
    ocid: "admin_nav.settings_link",
  },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: isAdmin, isLoading } = useIsAdmin();
  const { login, loginStatus, isAuthenticated } = useInternetIdentity();

  if (isLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground font-body">Checking access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center p-4"
        data-ocid="admin.access_denied"
      >
        <div className="card-elevated rounded-xl p-8 max-w-sm w-full text-center space-y-4">
          <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto">
            <LogIn className="w-7 h-7 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm font-body">
            You must be an admin and sign in with Internet Identity to access
            this panel.
          </p>
          {loginStatus !== "success" && !isAuthenticated ? (
            <Button
              className="btn-primary w-full"
              onClick={() => login()}
              data-ocid="admin.login_button"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In with Internet Identity
            </Button>
          ) : (
            <p className="text-sm text-destructive font-body">
              Your account does not have admin privileges.
            </p>
          )}
          <Link
            to="/"
            className="block text-sm text-primary hover:underline font-body"
            data-ocid="admin.back_home_link"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-56 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
        <div className="px-4 py-5 border-b border-sidebar-border">
          <span className="font-display font-bold text-sidebar-foreground text-base">
            🐄 Admin Panel
          </span>
          <p className="text-sidebar-foreground/60 text-xs mt-0.5 font-body">
            Solo Dairy Farm
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-body font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 transition-smooth"
              activeProps={{
                className: "bg-sidebar-accent/40 text-sidebar-foreground",
              }}
              data-ocid={link.ocid}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
            data-ocid="admin_nav.back_to_site_link"
          >
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-40 bg-foreground/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-4 py-5 border-b border-sidebar-border flex items-center justify-between">
          <span className="font-display font-bold text-sidebar-foreground text-base">
            🐄 Admin Panel
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded hover:bg-sidebar-accent/30"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-body font-medium text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/30 transition-smooth"
              activeProps={{
                className: "bg-sidebar-accent/40 text-sidebar-foreground",
              }}
              onClick={() => setSidebarOpen(false)}
              data-ocid={`mobile_${link.ocid}`}
            >
              <link.icon className="w-4 h-4 shrink-0" />
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden bg-card border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md hover:bg-muted"
            aria-label="Open sidebar"
            data-ocid="admin.open_sidebar_button"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-foreground">
            Admin Panel
          </span>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Bottom Tab Bar (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border flex justify-around items-center h-14">
        {sidebarLinks.slice(0, 5).map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 text-muted-foreground hover:text-primary transition-colors"
            activeProps={{ className: "text-primary" }}
            data-ocid={`bottom_nav.${link.label.toLowerCase()}_tab`}
          >
            <link.icon className="w-5 h-5" />
            <span className="text-[9px] font-body font-medium">
              {link.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

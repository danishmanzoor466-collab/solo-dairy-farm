import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  Beef,
  ClipboardList,
  MessageSquare,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { createActor } from "../../backend";
import { Skeleton } from "../../components/ui/skeleton";

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  ocid,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  loading: boolean;
  ocid: string;
}) {
  return (
    <div
      className="card-elevated rounded-xl p-5 flex items-center gap-4"
      data-ocid={ocid}
    >
      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-body uppercase tracking-wide">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-7 w-20 mt-1" />
        ) : (
          <p className="text-2xl font-display font-bold text-foreground">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

const quickActions = [
  {
    to: "/admin/orders",
    label: "View Orders",
    icon: ClipboardList,
    ocid: "dashboard.view_orders_link",
  },
  {
    to: "/admin/enquiries",
    label: "View Enquiries",
    icon: MessageSquare,
    ocid: "dashboard.view_enquiries_link",
  },
  {
    to: "/admin/products",
    label: "Add Product",
    icon: Package,
    ocid: "dashboard.add_product_link",
  },
  {
    to: "/admin/cows",
    label: "Add Cow",
    icon: Beef,
    ocid: "dashboard.add_cow_link",
  },
];

export function AdminDashboardPage() {
  const { actor, isFetching } = useActor(createActor);
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
  });

  const totalRevenue = stats
    ? `₹${(Number(stats.totalRevenue) / 100).toFixed(0)}`
    : "₹0";

  return (
    <div className="space-y-8" data-ocid="admin_dashboard.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            Solo Dairy Farm — Admin Overview
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="dashboard.stats_section"
      >
        <StatCard
          label="Total Orders"
          value={stats ? String(stats.totalOrders) : "0"}
          icon={ShoppingBag}
          loading={isLoading}
          ocid="dashboard.total_orders_card"
        />
        <StatCard
          label="Total Revenue"
          value={totalRevenue}
          icon={TrendingUp}
          loading={isLoading}
          ocid="dashboard.total_revenue_card"
        />
        <StatCard
          label="Pending Orders"
          value={stats ? String(stats.pendingOrders) : "0"}
          icon={ClipboardList}
          loading={isLoading}
          ocid="dashboard.pending_orders_card"
        />
        <StatCard
          label="Pending Enquiries"
          value={stats ? String(stats.pendingEnquiries) : "0"}
          icon={MessageSquare}
          loading={isLoading}
          ocid="dashboard.pending_enquiries_card"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-semibold text-lg text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="card-elevated rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:border-primary/40 hover:shadow-lg transition-smooth group"
              data-ocid={action.ocid}
            >
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <span className="text-sm font-body font-medium text-foreground">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

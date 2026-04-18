import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, ClipboardList } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import type { Order } from "../../types";
import { OrderStatus, OrderType, PaymentMethod } from "../../types";

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const ORDER_TYPE_LABELS: Record<string, string> = {
  OneTime: "One-time",
  SubscriptionDaily: "Daily Sub",
  SubscriptionWeekly: "Weekly Sub",
};

const PAYMENT_LABELS: Record<string, string> = {
  CashOnDelivery: "Cash on Delivery",
  UPI: "UPI",
};

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shortId(id: bigint) {
  return `#${String(id).padStart(4, "0")}`;
}

const STATUS_OPTIONS = [
  OrderStatus.Pending,
  OrderStatus.Confirmed,
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
];

function OrderRow({
  order,
  index,
  onStatusChange,
  updating,
}: {
  order: Order;
  index: number;
  onStatusChange: (id: bigint, status: OrderStatus) => void;
  updating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusClass =
    STATUS_COLORS[order.status as string] ??
    "bg-muted text-foreground border-border";

  return (
    <>
      <tr
        className="hover:bg-muted/20 cursor-pointer transition-colors"
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((prev) => !prev)}
        data-ocid={`orders.item.${index + 1}`}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {expanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            )}
            <span className="font-mono text-xs text-muted-foreground">
              {shortId(order.id)}
            </span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div>
            <p className="font-medium text-foreground text-sm">
              {order.customerName}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.customerPhone}
            </p>
          </div>
        </td>
        <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">
          {order.items.length}
        </td>
        <td className="px-4 py-3 text-right font-medium text-foreground">
          ₹{(Number(order.totalAmount) / 100).toLocaleString()}
        </td>
        <td className="px-4 py-3 hidden md:table-cell text-xs text-muted-foreground">
          {PAYMENT_LABELS[order.paymentMethod as string] ?? order.paymentMethod}
        </td>
        <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
          {ORDER_TYPE_LABELS[order.orderType as string] ?? order.orderType}
        </td>
        <td className="px-4 py-3">
          <Badge
            variant="outline"
            className={`text-xs ${statusClass}`}
            data-ocid={`orders.status_badge.${index + 1}`}
          >
            {order.status as string}
          </Badge>
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
          {formatDate(order.createdAt)}
        </td>
        <td
          className="px-4 py-3"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Select
            value={order.status as string}
            onValueChange={(v) => onStatusChange(order.id, v as OrderStatus)}
            disabled={updating}
          >
            <SelectTrigger
              className="h-7 text-xs w-28"
              data-ocid={`orders.status_select.${index + 1}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
      </tr>
      {expanded && (
        <tr data-ocid={`orders.expanded.${index + 1}`}>
          <td
            colSpan={9}
            className="px-4 pb-4 bg-muted/20 border-b border-border"
          >
            <div className="pt-3 grid sm:grid-cols-2 gap-4 text-sm font-body">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-semibold">
                  Delivery Address
                </p>
                <p className="text-foreground">{order.deliveryAddress}</p>
                {order.specialInstructions && (
                  <>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mt-2 mb-1 font-semibold">
                      Special Instructions
                    </p>
                    <p className="text-foreground">
                      {order.specialInstructions}
                    </p>
                  </>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1 font-semibold">
                  Items
                </p>
                <ul className="space-y-1">
                  {order.items.map((item) => (
                    <li
                      key={String(item.productId)}
                      className="flex justify-between text-foreground"
                    >
                      <span className="text-muted-foreground text-xs">
                        ID {String(item.productId)}
                      </span>
                      <span>
                        {String(item.quantity)} × ₹
                        {(Number(item.price) / 100).toFixed(0)}
                      </span>
                    </li>
                  ))}
                </ul>
                {order.customerEmail && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {order.customerEmail}
                  </p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

type FilterStatus = "All" | OrderStatus;

export function AdminOrdersPage() {
  const qc = useQueryClient();
  const { actor, isFetching } = useActor(createActor);
  const [filter, setFilter] = useState<FilterStatus>("All");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const filterTabs: FilterStatus[] = [
    "All",
    OrderStatus.Pending,
    OrderStatus.Confirmed,
    OrderStatus.Delivered,
    OrderStatus.Cancelled,
  ];

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6" data-ocid="admin_orders.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <ClipboardList className="w-5 h-5 text-primary" />
        </div>
        <h1 className="font-display font-bold text-2xl text-foreground">
          Orders
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap" data-ocid="orders.filter_tabs">
        {filterTabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
              filter === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
            data-ocid={`orders.filter.${tab.toLowerCase()}_tab`}
          >
            {tab}
            {tab !== "All" && (
              <span className="ml-1 opacity-70">
                ({orders.filter((o) => o.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-elevated rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="p-12 text-center space-y-2"
            data-ocid="orders.empty_state"
          >
            <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="font-body text-muted-foreground">
              No orders found for this filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-semibold hidden sm:table-cell">
                    Items
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold hidden md:table-cell">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold hidden lg:table-cell">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Update
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((order, i) => (
                  <OrderRow
                    key={order.id.toString()}
                    order={order}
                    index={i}
                    onStatusChange={(id, status) =>
                      statusMutation.mutate({ id, status })
                    }
                    updating={statusMutation.isPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

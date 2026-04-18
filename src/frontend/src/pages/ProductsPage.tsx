import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Beef,
  CalendarCheck,
  MessageCircle,
  Milk,
  Package,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useProducts } from "../hooks/useBackend";
import { useCartStore } from "../store/cartStore";
import { type Product, ProductCategory } from "../types";

type TabKey = "all" | "milk" | "dairy" | "cows";

const TABS: {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
  category?: ProductCategory;
}[] = [
  { key: "all", label: "All", icon: <Package className="w-4 h-4" /> },
  {
    key: "milk",
    label: "Fresh Milk",
    icon: <Milk className="w-4 h-4" />,
    category: ProductCategory.Milk,
  },
  {
    key: "dairy",
    label: "Dairy Products",
    icon: <ShoppingCart className="w-4 h-4" />,
    category: ProductCategory.DairyProduct,
  },
  {
    key: "cows",
    label: "Cows for Sale",
    icon: <Beef className="w-4 h-4" />,
    category: ProductCategory.Cow,
  },
];

const SKELETON_KEYS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"] as const;

const CATEGORY_BADGE: Record<
  ProductCategory,
  { label: string; className: string }
> = {
  [ProductCategory.Milk]: {
    label: "Milk",
    className: "bg-accent/20 text-accent-foreground border-accent/40",
  },
  [ProductCategory.DairyProduct]: {
    label: "Dairy",
    className: "bg-secondary/20 text-secondary border-secondary/40",
  },
  [ProductCategory.Cow]: {
    label: "Cow",
    className: "bg-primary/20 text-primary border-primary/40",
  },
};

function getStockStatus(stock: bigint): { label: string; className: string } {
  const n = Number(stock);
  if (n === 0)
    return {
      label: "Out of Stock",
      className: "bg-destructive/15 text-destructive border-destructive/30",
    };
  if (n <= 5)
    return {
      label: "Low Stock",
      className: "bg-yellow-100 text-yellow-800 border-yellow-300",
    };
  return {
    label: "In Stock",
    className: "bg-green-100 text-green-800 border-green-300",
  };
}

function formatPrice(price: bigint): string {
  return `₹${(Number(price) / 100).toFixed(0)}`;
}

function ProductImagePlaceholder({
  name,
  category,
}: { name: string; category: ProductCategory }) {
  const colorMap = {
    [ProductCategory.Milk]: "bg-accent/20",
    [ProductCategory.DairyProduct]: "bg-secondary/20",
    [ProductCategory.Cow]: "bg-primary/20",
  };
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${colorMap[category]}`}
    >
      <span className="font-display text-4xl font-bold text-primary/40">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card-elevated rounded-xl overflow-hidden">
      <Skeleton className="h-44 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

type SubscriptionType = "daily" | "weekly";

interface SubscriptionModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

function SubscriptionModal({ product, open, onClose }: SubscriptionModalProps) {
  const [subType, setSubType] = useState<SubscriptionType>("daily");

  if (!product) return null;

  const dailyPrice = formatPrice(product.price);
  const weeklyPrice = `₹${((Number(product.price) / 100) * 7).toFixed(0)}`;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm" data-ocid="subscription.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-primary">
            Subscribe to {product.name}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose your delivery frequency and get fresh milk at your doorstep.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          {/* Daily */}
          <button
            type="button"
            data-ocid="subscription.daily.toggle"
            onClick={() => setSubType("daily")}
            className={`w-full rounded-xl border-2 p-4 text-left transition-smooth ${
              subType === "daily"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-display font-semibold text-foreground">
                  Daily Delivery
                </p>
                <p className="text-sm text-muted-foreground">
                  Fresh milk every morning
                </p>
              </div>
              <span className="font-display font-bold text-primary text-lg">
                {dailyPrice}
                <span className="text-sm font-body font-normal text-muted-foreground">
                  /day
                </span>
              </span>
            </div>
          </button>

          {/* Weekly */}
          <button
            type="button"
            data-ocid="subscription.weekly.toggle"
            onClick={() => setSubType("weekly")}
            className={`w-full rounded-xl border-2 p-4 text-left transition-smooth ${
              subType === "weekly"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-display font-semibold text-foreground">
                  Weekly Pack
                </p>
                <p className="text-sm text-muted-foreground">
                  Billed weekly — save hassle
                </p>
              </div>
              <span className="font-display font-bold text-primary text-lg">
                {weeklyPrice}
                <span className="text-sm font-body font-normal text-muted-foreground">
                  /week
                </span>
              </span>
            </div>
          </button>
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            data-ocid="subscription.cancel_button"
          >
            Cancel
          </Button>
          <Link
            to="/checkout"
            search={{
              orderType:
                subType === "daily"
                  ? "SubscriptionDaily"
                  : "SubscriptionWeekly",
            }}
            className="flex-1"
            data-ocid="subscription.confirm_button"
          >
            <Button className="w-full btn-primary">
              <CalendarCheck className="w-4 h-4 mr-2" />
              Subscribe Now
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  onSubscribe: (product: Product) => void;
}

function ProductCard({ product, index, onSubscribe }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const catBadge = CATEGORY_BADGE[product.category];
  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = Number(product.stock) === 0;

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`, { duration: 3000 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="card-elevated rounded-xl overflow-hidden flex flex-col group hover:shadow-lg transition-smooth"
      data-ocid={`products.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        ) : (
          <ProductImagePlaceholder
            name={product.name}
            category={product.category}
          />
        )}
        {/* Category badge overlay */}
        <div className="absolute top-2 left-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${catBadge.className}`}
          >
            {catBadge.label}
          </span>
        </div>
        {/* Stock badge overlay */}
        <div className="absolute top-2 right-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${stockStatus.className}`}
          >
            {stockStatus.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-display font-semibold text-foreground text-lg leading-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="font-display font-bold text-primary text-xl">
            {formatPrice(product.price)}
            {product.category === ProductCategory.Milk && (
              <span className="text-xs font-body font-normal text-muted-foreground">
                /litre
              </span>
            )}
          </span>

          {/* Action button */}
          {product.category === ProductCategory.Milk && (
            <Button
              size="sm"
              className="btn-primary text-xs"
              onClick={() => onSubscribe(product)}
              disabled={isOutOfStock}
              data-ocid={`products.subscribe_button.${index + 1}`}
            >
              <CalendarCheck className="w-3.5 h-3.5 mr-1.5" />
              Subscribe
            </Button>
          )}

          {product.category === ProductCategory.DairyProduct && (
            <Button
              size="sm"
              className="btn-primary text-xs"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              data-ocid={`products.add_to_cart_button.${index + 1}`}
            >
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              Add to Cart
            </Button>
          )}

          {product.category === ProductCategory.Cow && (
            <Link to="/cows">
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth text-xs"
                data-ocid={`products.enquire_button.${index + 1}`}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Enquire
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProductsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [subscribeProduct, setSubscribeProduct] = useState<Product | null>(
    null,
  );

  const { data: products, isLoading, isError } = useProducts();

  const filtered = useMemo(() => {
    if (!products) return [];
    let list = products.filter((p) => p.isActive);

    // Tab filter
    const tab = TABS.find((t) => t.key === activeTab);
    if (tab?.category) {
      list = list.filter((p) => p.category === tab.category);
    }

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    return list;
  }, [products, activeTab, search]);

  return (
    <div className="min-h-screen bg-background" data-ocid="products.page">
      {/* Page header */}
      <div className="bg-primary/5 border-b border-border section-padding text-center py-10 sm:py-14">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-2">
            Solo Dairy Farm
          </p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight">
            Our Products
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Farm-fresh milk, artisan dairy delights, and healthy cows — all
            sourced directly from our fields to your family.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div
          className="relative max-w-md mx-auto mb-6"
          data-ocid="products.search_input"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-input focus-visible:ring-primary"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
              data-ocid="products.search_clear_button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sticky category tabs */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-3">
            {TABS.map((tab) => (
              <button
                type="button"
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                data-ocid={`products.${tab.key}.tab`}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-smooth border ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.key === "all" && products && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "all" ? "bg-primary-foreground/20" : "bg-muted"}`}
                  >
                    {products.filter((p) => p.isActive).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="products.loading_state"
          >
            {SKELETON_KEYS.map((sk) => (
              <SkeletonCard key={sk} />
            ))}
          </div>
        )}

        {/* Error state */}
        {isError && (
          <div
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="products.error_state"
          >
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <X className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Couldn't load products
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              We had trouble connecting to the farm. Please refresh the page or
              try again shortly.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="products.empty_state"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-5">
              {search
                ? `No results for "${search}". Try a different keyword.`
                : "No products available in this category right now."}
            </p>
            {search && (
              <Button
                variant="outline"
                onClick={() => setSearch("")}
                data-ocid="products.clear_search_button"
              >
                Clear Search
              </Button>
            )}
          </motion.div>
        )}

        {/* Product grid */}
        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-5">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              product{filtered.length !== 1 ? "s" : ""}
              {activeTab !== "all" &&
                ` in ${TABS.find((t) => t.key === activeTab)?.label}`}
              {search && ` matching "${search}"`}
            </p>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              data-ocid="products.list"
            >
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i}
                  onSubscribe={setSubscribeProduct}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Subscription modal */}
      <SubscriptionModal
        product={subscribeProduct}
        open={!!subscribeProduct}
        onClose={() => setSubscribeProduct(null)}
      />
    </div>
  );
}

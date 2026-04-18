import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Beef,
  CheckCircle,
  ChevronRight,
  Droplets,
  Leaf,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import { motion } from "motion/react";
import { useCows, useProducts } from "../hooks/useBackend";
import { useCartStore } from "../store/cartStore";
import type { Cow, Product } from "../types";

// ── Trust Badges ──────────────────────────────────────────────────────────────
const trustBadges = [
  { icon: Leaf, label: "100% Organic", desc: "No hormones, no additives" },
  {
    icon: Droplets,
    label: "Farm Fresh Daily",
    desc: "Delivered within hours of milking",
  },
  {
    icon: Award,
    label: "Hygiene Certified",
    desc: "FSSAI certified facility",
  },
];

// ── Why Choose Us ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Star,
    title: "Pure Quality",
    desc: "Our milk comes from healthy, grass-fed cows raised with care and love on open pastures.",
  },
  {
    icon: Truck,
    title: "Home Delivery",
    desc: "Fresh dairy delivered right to your doorstep — daily subscriptions available.",
  },
  {
    icon: Droplets,
    title: "Fresh Daily",
    desc: "Milk collected, pasteurised, and dispatched each morning so you get it at peak freshness.",
  },
  {
    icon: CheckCircle,
    title: "Trusted Since 2010",
    desc: "Over a decade of serving thousands of families with honest, natural dairy products.",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatPrice(paisa: bigint) {
  return `₹${(Number(paisa) / 100).toFixed(0)}`;
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      data-ocid={`featured_products.item.${index + 1}`}
    >
      <Card className="card-elevated h-full flex flex-col overflow-hidden group hover:shadow-lg transition-smooth">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Droplets className="w-12 h-12 text-muted-foreground/40" />
            </div>
          )}
          <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs">
            {product.category}
          </Badge>
        </div>
        <CardContent className="flex flex-col flex-1 p-4 gap-3">
          <h3 className="font-display font-semibold text-lg leading-snug text-foreground">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="font-display text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            <Button
              size="sm"
              className="btn-primary gap-1.5"
              onClick={() => addItem(product)}
              data-ocid={`featured_products.add_to_cart.${index + 1}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Cow Card ──────────────────────────────────────────────────────────────────
function CowCard({ cow, index }: { cow: Cow; index: number }) {
  const ageYears = (Number(cow.ageMonths) / 12).toFixed(1);
  const image = cow.imageUrls[0];
  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in your ${cow.breed} cow listed on Solo Dairy Farm. Price: ${formatPrice(cow.price)}`,
  );
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      data-ocid={`featured_cows.item.${index + 1}`}
    >
      <Card className="card-elevated h-full flex flex-col overflow-hidden group hover:shadow-lg transition-smooth">
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={cow.breed}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Beef className="w-12 h-12 text-muted-foreground/40" />
            </div>
          )}
          <Badge className="absolute top-2 left-2 bg-secondary/90 text-secondary-foreground text-xs">
            Available
          </Badge>
        </div>
        <CardContent className="flex flex-col flex-1 p-4 gap-3">
          <h3 className="font-display font-semibold text-lg text-foreground">
            {cow.breed}
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            <span className="text-muted-foreground">Age</span>
            <span className="font-medium text-foreground">
              {ageYears} years
            </span>
            <span className="text-muted-foreground">Milk / day</span>
            <span className="font-medium text-foreground">
              {cow.milkCapacityLiters.toString()} L
            </span>
            <span className="text-muted-foreground">Health</span>
            <span className="font-medium text-foreground">
              {cow.healthStatus}
            </span>
          </div>
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="font-display text-xl font-bold text-primary">
              {formatPrice(cow.price)}
            </span>
            <a
              href={`https://wa.me/${encodeURIComponent("919876543210")}?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid={`featured_cows.enquire.${index + 1}`}
            >
              <Button size="sm" className="btn-secondary gap-1.5">
                <MessageCircle className="w-3.5 h-3.5" />
                Enquire
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Product Skeleton ──────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-8 w-28" />
        </div>
      </div>
    </Card>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────
export function HomePage() {
  const { data: allProducts, isLoading: productsLoading } = useProducts();
  const { data: allCows, isLoading: cowsLoading } = useCows();

  const featuredProducts = (allProducts ?? []).slice(0, 6);
  const featuredCows = (allCows ?? []).slice(0, 3);

  return (
    <div data-ocid="home.page">
      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center min-h-[80vh] lg:min-h-[90vh] overflow-hidden"
        data-ocid="home.hero.section"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/hero-farm.dim_1200x600.jpg"
            alt="Solo Dairy Farm"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/85" />
          {/* Subtle texture pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative z-10 section-padding max-w-4xl mx-auto flex flex-col items-center gap-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-accent/20 text-primary-foreground border border-primary-foreground/30 backdrop-blur-sm px-4 py-1.5 text-sm font-body">
              <MapPin className="w-3.5 h-3.5 mr-1.5 inline" />
              Farm-to-Home Delivery
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-black text-primary-foreground leading-[1.05] tracking-tight"
          >
            Pure Dairy,
            <br />
            <span className="text-accent">Direct from Farm</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-lg sm:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed"
          >
            Fresh milk and dairy products from Solo Dairy Farm, delivered to
            your doorstep — straight from happy, healthy cows.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center mt-2"
          >
            <Link to="/products">
              <Button
                size="lg"
                className="btn-primary font-semibold gap-2 px-7 shadow-lg"
                data-ocid="home.hero.buy_milk_button"
              >
                <Droplets className="w-4 h-4" />
                Buy Milk
              </Button>
            </Link>
            <Link to="/cows">
              <Button
                size="lg"
                className="btn-secondary font-semibold gap-2 px-7 shadow-lg"
                data-ocid="home.hero.buy_cows_button"
              >
                <Beef className="w-4 h-4" />
                Buy Cows
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground/70 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 font-semibold gap-2 px-7"
                data-ocid="home.hero.contact_button"
              >
                <MessageCircle className="w-4 h-4" />
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-primary-foreground/70 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── ABOUT PREVIEW ─────────────────────────────────────────────────── */}
      <section
        className="bg-muted/40 section-padding"
        data-ocid="home.about.section"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary font-body">
              About Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
              Quality You Can Trust
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Solo Dairy Farm was founded with one mission: to bring pure,
              unadulterated dairy directly from our farm to your family. Our
              cows graze freely on pesticide-free pastures, and every drop of
              milk is tested for quality before it reaches you.
            </p>
          </motion.div>

          {/* Trust badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card-elevated rounded-xl p-6 flex flex-col items-center text-center gap-3"
                data-ocid={`home.trust_badge.${i + 1}`}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <badge.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">
                  {badge.label}
                </h3>
                <p className="text-sm text-muted-foreground">{badge.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/about" data-ocid="home.about.learn_story_link">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 gap-2 font-semibold"
              >
                Learn Our Story
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────────── */}
      <section
        className="bg-background section-padding"
        data-ocid="home.products.section"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary font-body">
              Fresh from the Farm
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
              Our Fresh Products
            </h2>
          </motion.div>

          {productsLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="home.products.loading_state"
            >
              {["p1", "p2", "p3", "p4", "p5", "p6"].map((k) => (
                <ProductSkeleton key={k} />
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="home.products.empty_state"
            >
              <Droplets className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-body">
                Products coming soon. Check back later!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard
                  key={product.id.toString()}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/products" data-ocid="home.products.view_all_link">
              <Button className="btn-primary gap-2 px-8 font-semibold">
                View All Products
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED COWS ─────────────────────────────────────────────────── */}
      <section
        className="bg-muted/30 section-padding"
        data-ocid="home.cows.section"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary font-body">
              Premium Livestock
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2">
              Cows for Sale
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Healthy, high-yield dairy cows from proven breeds — certified,
              vaccinated, and ready for your farm.
            </p>
          </motion.div>

          {cowsLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="home.cows.loading_state"
            >
              {["c1", "c2", "c3"].map((k) => (
                <ProductSkeleton key={k} />
              ))}
            </div>
          ) : featuredCows.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="home.cows.empty_state"
            >
              <Beef className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-body">
                No cows listed currently. Enquire for availability.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCows.map((cow, i) => (
                <CowCard key={cow.id.toString()} cow={cow} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/cows" data-ocid="home.cows.view_all_link">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary/5 gap-2 px-8 font-semibold"
              >
                View All Cows
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────────────────────────── */}
      <section
        className="bg-primary section-padding"
        data-ocid="home.why_us.section"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70 font-body">
              Why Solo Dairy Farm
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mt-2">
              Why Choose Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3 p-5 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10 hover:bg-primary-foreground/10 transition-smooth"
                data-ocid={`home.why_us.item.${i + 1}`}
              >
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <feat.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-display font-bold text-primary-foreground text-lg">
                  {feat.title}
                </h3>
                <p className="text-sm text-primary-foreground/70 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

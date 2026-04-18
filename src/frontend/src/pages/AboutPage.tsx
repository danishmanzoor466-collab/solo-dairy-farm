import { Link } from "@tanstack/react-router";
import {
  Beef,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Leaf,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Truck,
} from "lucide-react";

const values = [
  {
    icon: Leaf,
    title: "Organic Farming",
    description:
      "Our cows graze freely on natural pastures without chemicals, hormones, or antibiotics — because healthy land produces healthy milk.",
  },
  {
    icon: ShieldCheck,
    title: "Hygiene First",
    description:
      "Daily cleaning routines, certified milk testing, and strict food-safety standards ensure every drop meets the highest purity benchmarks.",
  },
  {
    icon: Truck,
    title: "Direct from Farm",
    description:
      "No middlemen, no extra hands — milk travels from our farm straight to your doorstep, preserving freshness and cutting costs.",
  },
];

const qualityCommitments = [
  {
    icon: Droplets,
    title: "Fresh Daily Collection",
    description:
      "Milk collected twice daily at peak freshness, never stored beyond 12 hours before dispatch.",
  },
  {
    icon: FlaskConical,
    title: "Lab Tested",
    description:
      "Every batch undergoes fat content, SNF, and microbial testing before it leaves the farm.",
  },
  {
    icon: Snowflake,
    title: "Cold Chain Maintained",
    description:
      "Refrigerated transport end-to-end to preserve nutrients and prevent spoilage.",
  },
  {
    icon: CheckCircle2,
    title: "No Adulterants",
    description:
      "Zero water, zero synthetic additives — what you receive is 100% pure, unadulterated milk.",
  },
];

const breeds = [
  {
    name: "HF (Holstein Friesian)",
    image: "/assets/generated/breed-hf.dim_400x300.jpg",
    traits: [
      "High yield — up to 20L/day",
      "Calm temperament",
      "Ideal for commercial dairy",
    ],
    badge: "High Yield",
  },
  {
    name: "Gir",
    image: "/assets/generated/breed-gir.dim_400x300.jpg",
    traits: [
      "A2 milk — easy to digest",
      "Heat-tolerant & hardy",
      "Traditional Indian breed",
    ],
    badge: "A2 Milk",
  },
  {
    name: "Jersey",
    image: "/assets/generated/breed-jersey.dim_400x300.jpg",
    traits: [
      "Rich creamy milk",
      "High butterfat content",
      "Smaller, efficient breed",
    ],
    badge: "Creamy Rich",
  },
];

export function AboutPage() {
  return (
    <div data-ocid="about.page" className="flex flex-col min-h-0">
      {/* ── Hero ── */}
      <section
        data-ocid="about.hero.section"
        className="relative overflow-hidden bg-primary text-primary-foreground"
        style={{ minHeight: "340px" }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-secondary/30 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto section-padding text-center flex flex-col items-center justify-center gap-4">
          <span className="inline-flex items-center gap-2 text-sm font-body font-medium bg-white/10 px-4 py-1.5 rounded-full border border-white/20 mb-2">
            <Beef className="w-4 h-4" />
            Est. 2010 · Solo Dairy Farm
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
            About Solo Dairy Farm
          </h1>
          <p className="text-lg sm:text-xl font-body text-primary-foreground/80 max-w-xl">
            Rooted in the land, committed to purity
          </p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section
        data-ocid="about.story.section"
        className="bg-background section-padding"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
              <img
                src="/assets/generated/about-farm-story.dim_800x500.jpg"
                alt="Solo Dairy Farm green pasture with cows"
                className="w-full h-72 sm:h-80 md:h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow">
                <p className="text-xs font-body text-muted-foreground">
                  Founded
                </p>
                <p className="text-lg font-display font-bold text-primary">
                  2010
                </p>
              </div>
            </div>

            {/* Text */}
            <div className="order-1 md:order-2 flex flex-col gap-5">
              <div>
                <span className="text-sm font-body font-semibold text-accent uppercase tracking-widest">
                  Our Journey
                </span>
                <h2 className="mt-1 text-3xl sm:text-4xl font-display font-bold text-foreground leading-snug">
                  Our Story
                </h2>
              </div>
              <p className="font-body text-muted-foreground leading-relaxed">
                Founded in 2010 by a family of farmers deeply passionate about
                natural dairy, Solo Dairy Farm began with a simple belief —
                every family deserves pure milk straight from healthy cows.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                Spanning over 50 acres of lush green pasture, our farm is home
                to carefully selected HF, Gir, and Jersey cows. They graze
                freely, breathe fresh air, and are never treated with hormones
                or antibiotics. We believe animals raised with care produce milk
                of exceptional quality.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed">
                Today, we deliver farm-fresh milk and dairy products directly to
                hundreds of families across the region — without a single
                middleman. When you order from Solo Dairy Farm, you know exactly
                where your milk comes from.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                {[
                  { label: "50+ Acres", sub: "of green pasture" },
                  { label: "200+ Cows", sub: "in our herd" },
                  { label: "500+ Families", sub: "served daily" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-2xl font-display font-bold text-primary">
                      {stat.label}
                    </span>
                    <span className="text-xs font-body text-muted-foreground">
                      {stat.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section
        data-ocid="about.values.section"
        className="bg-muted/40 section-padding"
      >
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-sm font-body font-semibold text-accent uppercase tracking-widest">
            What We Stand For
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold text-foreground mb-10">
            Our Core Values
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  data-ocid={`about.value.item.${i + 1}`}
                  className="card-elevated rounded-2xl p-7 flex flex-col items-center gap-4 text-center hover:shadow-lg transition-smooth"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Quality Promise ── */}
      <section
        data-ocid="about.quality.section"
        className="bg-background section-padding"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-sm font-body font-semibold text-accent uppercase tracking-widest">
              Uncompromising Standards
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold text-foreground">
              Our Quality Promise
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {qualityCommitments.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  data-ocid={`about.quality.item.${i + 1}`}
                  className="card-elevated rounded-2xl p-6 flex flex-col gap-3 hover:shadow-lg transition-smooth group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-smooth">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Our Herd ── */}
      <section
        data-ocid="about.herd.section"
        className="bg-muted/40 section-padding"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-sm font-body font-semibold text-secondary uppercase tracking-widest">
              Meet Our Animals
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold text-foreground">
              Our Herd
            </h2>
            <p className="mt-3 font-body text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We carefully select our cattle for milk quality, temperament, and
              adaptability to our local climate. Each breed brings something
              special to our farm.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {breeds.map((breed, i) => (
              <div
                key={breed.name}
                data-ocid={`about.breed.item.${i + 1}`}
                className="card-elevated rounded-2xl overflow-hidden hover:shadow-xl transition-smooth group"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={breed.image}
                    alt={`${breed.name} cow`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  />
                  <span className="absolute top-3 right-3 bg-secondary text-secondary-foreground text-xs font-body font-semibold px-3 py-1 rounded-full">
                    {breed.badge}
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <h3 className="font-display font-bold text-foreground text-lg">
                    {breed.name}
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {breed.traits.map((trait) => (
                      <li
                        key={trait}
                        className="flex items-center gap-2 font-body text-sm text-muted-foreground"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                        {trait}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        data-ocid="about.cta.section"
        className="bg-primary text-primary-foreground section-padding"
      >
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl font-display font-bold leading-snug">
            Ready to experience the difference?
          </h2>
          <p className="font-body text-primary-foreground/80 text-lg max-w-xl">
            Join hundreds of families who trust Solo Dairy Farm for their daily
            dose of pure, farm-fresh milk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              data-ocid="about.cta.shop_link"
              className="btn-secondary inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 font-body font-semibold text-base shadow-lg"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              data-ocid="about.cta.contact_link"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3 font-body font-semibold text-base bg-white/15 hover:bg-white/25 border border-white/30 transition-smooth text-primary-foreground"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

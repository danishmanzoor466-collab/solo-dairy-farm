import { Link } from "@tanstack/react-router";
import { Menu, Milk, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { useSettings } from "../hooks/useBackend";
import { useCartStore } from "../store/cartStore";
import { Button } from "./ui/button";

const navLinks = [
  { to: "/products", label: "Products" },
  { to: "/cows", label: "Cows for Sale" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const { data: settings } = useSettings();
  const whatsappNumber = settings?.whatsappNumber ?? "919876543210";
  const whatsappGreeting =
    settings?.whatsappGreeting ??
    "Hello! I'm interested in your dairy products.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappGreeting)}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              data-ocid="nav.logo_link"
            >
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm">
                <Milk className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors duration-200">
                  Solo Dairy Farm
                </span>
                <span className="text-[10px] text-muted-foreground font-body tracking-wide hidden sm:block">
                  Pure Dairy, Direct from Farm
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-body font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
                  activeProps={{ className: "text-primary bg-muted" }}
                  data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                to="/cart"
                className="relative p-2 rounded-md hover:bg-muted transition-smooth"
                data-ocid="nav.cart_link"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                className="md:hidden p-2 rounded-md hover:bg-muted transition-smooth"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                data-ocid="nav.hamburger_toggle"
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="container px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-4 py-3 text-sm font-body font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
                  activeProps={{ className: "text-primary bg-muted" }}
                  onClick={() => setMenuOpen(false)}
                  data-ocid={`mobile_nav.${link.label.toLowerCase().replace(/\s+/g, "_")}_link`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-auto">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Milk className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-lg">
                  Solo Dairy Farm
                </span>
              </div>
              <p className="text-primary-foreground/75 text-sm font-body leading-relaxed max-w-xs">
                Pure Dairy, Direct from Farm. We bring you fresh, hygienic dairy
                products straight from our cows to your table.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe57] text-white text-sm font-medium px-4 py-2 rounded-md transition-smooth"
                data-ocid="footer.whatsapp_button"
              >
                <SiWhatsapp className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-3 text-primary-foreground/90">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {[
                  { to: "/", label: "Home" },
                  { to: "/products", label: "Products" },
                  { to: "/cows", label: "Cows for Sale" },
                  { to: "/about", label: "About Us" },
                  { to: "/contact", label: "Contact" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-primary-foreground/70 hover:text-primary-foreground text-sm font-body transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-3 text-primary-foreground/90">
                Contact Us
              </h4>
              <address className="not-italic space-y-2">
                <p className="text-primary-foreground/70 text-sm font-body">
                  📞 {settings?.businessPhone ?? "+91 98765 43210"}
                </p>
                <p className="text-primary-foreground/70 text-sm font-body">
                  ✉️ {settings?.contactEmail ?? "info@solodairyfarm.com"}
                </p>
                <p className="text-primary-foreground/70 text-sm font-body">
                  🕐 {settings?.hoursOfOperation ?? "Mon–Sat: 6am – 8pm"}
                </p>
              </address>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-primary-foreground/60 text-xs font-body">
              © {new Date().getFullYear()} Solo Dairy Farm. All rights reserved.
            </p>
            <p className="text-primary-foreground/50 text-xs font-body">
              Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary-foreground/80 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebe57] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-smooth"
        aria-label="Chat on WhatsApp"
        data-ocid="floating.whatsapp_button"
      >
        <SiWhatsapp className="w-7 h-7" />
      </a>
    </div>
  );
}

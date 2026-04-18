import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "../store/cartStore";

function formatPrice(paise: bigint): string {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}

export function CartPage() {
  const { items, removeItem, updateQuantity, totalAmount } = useCartStore();

  const subtotal = totalAmount();

  if (items.length === 0) {
    return (
      <div
        data-ocid="cart.page"
        className="min-h-[60vh] flex flex-col items-center justify-center section-padding text-center"
      >
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground font-body mb-8 max-w-sm">
          Looks like you haven't added anything yet. Browse our fresh farm
          products!
        </p>
        <Button asChild className="btn-primary rounded-full px-8">
          <Link to="/products" data-ocid="cart.browse_products_link">
            Browse Products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div data-ocid="cart.page" className="bg-background min-h-screen">
      {/* Header Band */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Your Cart
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4" data-ocid="cart.list">
            {items.map((item, index) => (
              <div
                key={item.product.id.toString()}
                data-ocid={`cart.item.${index + 1}`}
                className="card-elevated rounded-xl p-4 flex gap-4"
              >
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-base truncate">
                        {item.product.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-xs mt-1 font-body"
                      >
                        {item.product.category}
                      </Badge>
                    </div>
                    <button
                      type="button"
                      data-ocid={`cart.delete_button.${index + 1}`}
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-smooth flex-shrink-0 p-1 rounded"
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 gap-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                      <button
                        type="button"
                        data-ocid={`cart.decrease_qty.${index + 1}`}
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-card transition-smooth"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-body font-semibold text-sm w-6 text-center text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        data-ocid={`cart.increase_qty.${index + 1}`}
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-card transition-smooth"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="font-display font-bold text-primary text-base">
                      {formatPrice(item.product.price * BigInt(item.quantity))}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground font-body mt-1">
                    {formatPrice(item.product.price)} each
                  </p>
                </div>
              </div>
            ))}

            {/* Continue Shopping */}
            <div className="pt-2">
              <Link
                to="/products"
                data-ocid="cart.continue_shopping_link"
                className="text-sm text-primary font-body hover:underline flex items-center gap-1"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 flex-shrink-0" data-ocid="cart.summary">
            <div className="card-elevated rounded-xl p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 font-body text-sm">
                {items.map((item) => (
                  <div
                    key={item.product.id.toString()}
                    className="flex justify-between text-foreground/80"
                  >
                    <span className="truncate mr-2">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="flex-shrink-0">
                      {formatPrice(item.product.price * BigInt(item.quantity))}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-body text-sm text-muted-foreground mb-1">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between font-body text-sm text-muted-foreground mb-4">
                <span>Delivery</span>
                <span className="text-accent font-medium">Free</span>
              </div>

              <Separator className="mb-4" />

              <div className="flex justify-between font-display font-bold text-lg text-foreground mb-6">
                <span>Total</span>
                <span className="text-primary">{formatPrice(subtotal)}</span>
              </div>

              <p className="text-xs text-muted-foreground font-body mb-6 bg-muted/50 rounded-lg p-3">
                🚚 Free delivery to your doorstep. Fresh from our farm daily.
              </p>

              <Button
                asChild
                className="w-full btn-primary rounded-full font-body font-semibold py-3"
              >
                <Link to="/checkout" data-ocid="cart.checkout_button">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

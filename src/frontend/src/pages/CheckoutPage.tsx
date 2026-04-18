import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Banknote,
  CalendarDays,
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { usePlaceOrder, useSettings } from "../hooks/useBackend";
import { useCartStore } from "../store/cartStore";
import { OrderType, PaymentMethod, ProductCategory } from "../types";

function formatPrice(paise: bigint): string {
  return `₹${(Number(paise) / 100).toFixed(2)}`;
}

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  instructions: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
    errors.phone = "Enter a valid 10-digit Indian mobile number";
  if (!form.address.trim()) errors.address = "Delivery address is required";
  return errors;
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCartStore();
  const { data: settings } = useSettings();
  const placeOrder = usePlaceOrder();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    address: "",
    instructions: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [orderType, setOrderType] = useState<OrderType>(OrderType.OneTime);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CashOnDelivery,
  );

  const subtotal = totalAmount();
  const hasMilkItem = items.some(
    (item) => item.product.category === ProductCategory.Milk,
  );

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div
        data-ocid="checkout.page"
        className="min-h-[60vh] flex flex-col items-center justify-center section-padding text-center"
      >
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground font-body mb-8">
          Add items to your cart before checking out.
        </p>
        <Button asChild className="btn-primary rounded-full px-8">
          <Link to="/cart">Go to Cart</Link>
        </Button>
      </div>
    );
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        quantity: BigInt(item.quantity),
        price: item.product.price,
      }));

      const result = await placeOrder.mutateAsync({
        customerName: form.name.trim(),
        customerPhone: form.phone.trim(),
        customerEmail: form.email.trim(),
        deliveryAddress: form.address.trim(),
        specialInstructions: form.instructions.trim(),
        orderType,
        paymentMethod,
        totalAmount: subtotal,
        items: orderItems,
      });

      clearCart();
      void navigate({
        to: "/order-success",
        search: {
          orderId: result.id.toString(),
          total: subtotal.toString(),
          payment: paymentMethod,
        },
      });
    } catch {
      // Error handled via placeOrder.isError
    }
  }

  const upiId = settings?.whatsappNumber
    ? "solodairyfarm@upi"
    : "solodairyfarm@upi";

  return (
    <div data-ocid="checkout.page" className="bg-background min-h-screen">
      {/* Header Band */}
      <div className="bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-2">
            <Link
              to="/cart"
              className="hover:text-foreground transition-colors"
            >
              Cart
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">Checkout</span>
          </nav>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Complete Your Order
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Form */}
            <div className="flex-1 space-y-6">
              {/* Customer Details */}
              <div className="card-elevated rounded-xl p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-5">
                  Delivery Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="font-body text-sm font-medium"
                    >
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      data-ocid="checkout.name_input"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`mt-1.5 font-body ${errors.name ? "border-destructive" : ""}`}
                    />
                    {errors.name && (
                      <p
                        data-ocid="checkout.name_field_error"
                        className="text-xs text-destructive mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="font-body text-sm font-medium"
                    >
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      data-ocid="checkout.phone_input"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number (e.g. 9876543210)"
                      className={`mt-1.5 font-body ${errors.phone ? "border-destructive" : ""}`}
                    />
                    {errors.phone && (
                      <p
                        data-ocid="checkout.phone_field_error"
                        className="text-xs text-destructive mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="font-body text-sm font-medium"
                    >
                      Email{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      data-ocid="checkout.email_input"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="mt-1.5 font-body"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="address"
                      className="font-body text-sm font-medium"
                    >
                      Delivery Address{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      data-ocid="checkout.address_input"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House/flat number, street, area, city, pincode"
                      rows={3}
                      className={`mt-1.5 font-body resize-none ${errors.address ? "border-destructive" : ""}`}
                    />
                    {errors.address && (
                      <p
                        data-ocid="checkout.address_field_error"
                        className="text-xs text-destructive mt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="instructions"
                      className="font-body text-sm font-medium"
                    >
                      Special Instructions{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Textarea
                      id="instructions"
                      name="instructions"
                      data-ocid="checkout.instructions_input"
                      value={form.instructions}
                      onChange={handleChange}
                      placeholder="Any special delivery instructions..."
                      rows={2}
                      className="mt-1.5 font-body resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Order Type */}
              <div className="card-elevated rounded-xl p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-5">
                  Order Type
                </h2>
                <div className="space-y-3">
                  {/* One-time */}
                  <label
                    data-ocid="checkout.order_type_onetime"
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-smooth ${
                      orderType === OrderType.OneTime
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value={OrderType.OneTime}
                      checked={orderType === OrderType.OneTime}
                      onChange={() => setOrderType(OrderType.OneTime)}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                        <span className="font-body font-semibold text-foreground">
                          One-time Order
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        Single delivery — for all product types
                      </p>
                    </div>
                  </label>

                  {/* Daily Subscription */}
                  <label
                    data-ocid="checkout.order_type_daily"
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-smooth ${
                      !hasMilkItem ? "opacity-50 cursor-not-allowed" : ""
                    } ${
                      orderType === OrderType.SubscriptionDaily
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value={OrderType.SubscriptionDaily}
                      checked={orderType === OrderType.SubscriptionDaily}
                      onChange={() => setOrderType(OrderType.SubscriptionDaily)}
                      disabled={!hasMilkItem}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-accent" />
                        <span className="font-body font-semibold text-foreground">
                          Daily Subscription
                        </span>
                        <span className="text-xs bg-accent/20 text-accent font-body px-2 py-0.5 rounded-full">
                          Milk only
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        Fresh milk delivered every morning to your door
                      </p>
                      {!hasMilkItem && (
                        <p className="text-xs text-muted-foreground font-body mt-1 italic">
                          Add a milk product to enable this option
                        </p>
                      )}
                    </div>
                  </label>

                  {/* Weekly Subscription */}
                  <label
                    data-ocid="checkout.order_type_weekly"
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-smooth ${
                      !hasMilkItem ? "opacity-50 cursor-not-allowed" : ""
                    } ${
                      orderType === OrderType.SubscriptionWeekly
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="orderType"
                      value={OrderType.SubscriptionWeekly}
                      checked={orderType === OrderType.SubscriptionWeekly}
                      onChange={() =>
                        setOrderType(OrderType.SubscriptionWeekly)
                      }
                      disabled={!hasMilkItem}
                      className="mt-0.5 accent-primary"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 text-secondary" />
                        <span className="font-body font-semibold text-foreground">
                          Weekly Subscription
                        </span>
                        <span className="text-xs bg-secondary/20 text-secondary font-body px-2 py-0.5 rounded-full">
                          Milk only
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        Fixed quantity delivered every week — save more with
                        bulk orders
                      </p>
                      {!hasMilkItem && (
                        <p className="text-xs text-muted-foreground font-body mt-1 italic">
                          Add a milk product to enable this option
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card-elevated rounded-xl p-6">
                <h2 className="font-display font-bold text-lg text-foreground mb-5">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label
                    data-ocid="checkout.payment_cod"
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-smooth ${
                      paymentMethod === PaymentMethod.CashOnDelivery
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={PaymentMethod.CashOnDelivery}
                      checked={paymentMethod === PaymentMethod.CashOnDelivery}
                      onChange={() =>
                        setPaymentMethod(PaymentMethod.CashOnDelivery)
                      }
                      className="mt-0.5 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-primary" />
                        <span className="font-body font-semibold text-foreground">
                          Cash on Delivery
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        Pay in cash when your order arrives — no upfront payment
                        needed
                      </p>
                    </div>
                  </label>

                  {/* UPI */}
                  <label
                    data-ocid="checkout.payment_upi"
                    className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-smooth ${
                      paymentMethod === PaymentMethod.UPI
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-border/80"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={PaymentMethod.UPI}
                      checked={paymentMethod === PaymentMethod.UPI}
                      onChange={() => setPaymentMethod(PaymentMethod.UPI)}
                      className="mt-0.5 accent-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-accent" />
                        <span className="font-body font-semibold text-foreground">
                          UPI Payment
                        </span>
                        <span className="text-xs bg-accent/20 text-accent font-body px-2 py-0.5 rounded-full">
                          Instant
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        UPI ID will be shared after placing the order:{" "}
                        <strong className="text-foreground">{upiId}</strong>
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="card-elevated rounded-xl p-6 sticky top-24">
                <h2 className="font-display font-bold text-lg text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-2 font-body text-sm max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.product.id.toString()}
                      className="flex justify-between text-foreground/80"
                    >
                      <span className="truncate mr-2">
                        {item.product.name} × {item.quantity}
                      </span>
                      <span className="flex-shrink-0">
                        {formatPrice(
                          item.product.price * BigInt(item.quantity),
                        )}
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

                {/* Error */}
                {placeOrder.isError && (
                  <div
                    data-ocid="checkout.error_state"
                    className="flex items-start gap-2 text-destructive text-sm font-body bg-destructive/10 rounded-lg p-3 mb-4"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Failed to place order. Please try again.</span>
                  </div>
                )}

                <Button
                  type="submit"
                  data-ocid="checkout.submit_button"
                  disabled={placeOrder.isPending}
                  className="w-full btn-primary rounded-full font-body font-semibold py-3"
                >
                  {placeOrder.isPending ? (
                    <span
                      data-ocid="checkout.loading_state"
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 animate-spin" /> Placing
                      Order...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <p className="text-xs text-muted-foreground font-body text-center mt-3">
                  By placing your order, you agree to our delivery terms
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

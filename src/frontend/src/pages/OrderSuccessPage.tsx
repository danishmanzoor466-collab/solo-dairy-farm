import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useSearch } from "@tanstack/react-router";
import {
  Banknote,
  CheckCircle2,
  Copy,
  MessageCircle,
  ShoppingBag,
  Smartphone,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { PaymentMethod } from "../types";

function formatPrice(paise: string): string {
  const amount = Number(paise) / 100;
  return `₹${amount.toFixed(2)}`;
}

export function OrderSuccessPage() {
  const search = useSearch({ strict: false }) as {
    orderId?: string;
    total?: string;
    payment?: string;
  };
  const [copied, setCopied] = useState(false);

  const orderId = search.orderId ?? "—";
  const total = search.total ?? "0";
  const payment = search.payment ?? PaymentMethod.CashOnDelivery;
  const isUPI = payment === PaymentMethod.UPI;
  const upiId = "solodairyfarm@upi";
  const whatsappPhone = "919876543210"; // default, can be from settings

  const whatsappMessage = encodeURIComponent(
    `Hello Solo Dairy Farm! 🐄\n\nI placed an order and want to confirm:\n\nOrder ID: #${orderId}\nAmount: ${formatPrice(total)}\nPayment: ${isUPI ? "UPI" : "Cash on Delivery"}\n\nPlease confirm my order. Thank you!`,
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`;

  function handleCopyUPI() {
    void navigator.clipboard.writeText(upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div data-ocid="order_success.page" className="bg-background min-h-screen">
      {/* Green success band */}
      <div className="bg-primary text-primary-foreground py-12 sm:py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-foreground/10 mb-6 mx-auto">
            <CheckCircle2
              className="w-12 h-12 text-primary-foreground"
              strokeWidth={1.5}
            />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Order Placed Successfully!
          </h1>
          <p className="font-body text-primary-foreground/80 text-base">
            Thank you for choosing Solo Dairy Farm. Your fresh dairy is on its
            way!
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Order ID Card */}
        <div className="card-elevated rounded-2xl p-6 text-center">
          <p className="font-body text-sm text-muted-foreground mb-1">
            Order ID
          </p>
          <p
            data-ocid="order_success.order_id"
            className="font-display font-bold text-3xl text-primary tracking-wide"
          >
            #{orderId}
          </p>
          <p className="font-body text-xs text-muted-foreground mt-2">
            Save this order ID for your reference
          </p>
        </div>

        {/* Payment Instructions */}
        <div
          data-ocid="order_success.payment_info"
          className="card-elevated rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            {isUPI ? (
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-accent" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-primary" />
              </div>
            )}
            <div>
              <h2 className="font-display font-bold text-base text-foreground">
                {isUPI ? "UPI Payment" : "Cash on Delivery"}
              </h2>
              <p className="text-xs text-muted-foreground font-body">
                {isUPI
                  ? "Complete your payment now"
                  : "Pay when your order arrives"}
              </p>
            </div>
          </div>

          {isUPI ? (
            <div className="bg-muted/60 rounded-xl p-4">
              <p className="font-body text-sm text-foreground mb-3">
                Please pay{" "}
                <strong className="text-primary">{formatPrice(total)}</strong>{" "}
                to:
              </p>
              <div className="flex items-center justify-between gap-3 bg-card border border-border rounded-lg px-4 py-3">
                <span className="font-mono font-semibold text-foreground text-sm">
                  {upiId}
                </span>
                <button
                  type="button"
                  data-ocid="order_success.copy_upi_button"
                  onClick={handleCopyUPI}
                  className="flex items-center gap-1.5 text-xs text-primary hover:opacity-80 transition-smooth font-body"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-3">
                Use any UPI app (GPay, PhonePe, Paytm) to send the payment. Your
                order will be dispatched after payment confirmation.
              </p>
            </div>
          ) : (
            <div className="bg-muted/60 rounded-xl p-4">
              <p className="font-body text-sm text-foreground">
                Pay{" "}
                <strong className="text-primary">{formatPrice(total)}</strong>{" "}
                when your order arrives at your doorstep. Our delivery person
                will collect the cash.
              </p>
              <p className="font-body text-xs text-muted-foreground mt-2">
                Please keep exact change ready if possible.
              </p>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div
          data-ocid="order_success.delivery_info"
          className="card-elevated rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Truck className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-foreground">
                Estimated Delivery
              </h2>
              <p className="text-xs text-muted-foreground font-body">
                Fresh from our farm
              </p>
            </div>
          </div>
          <Separator className="mb-3" />
          <p className="font-body text-sm text-foreground">
            🕗 <strong>Same Day</strong> — orders before 10 AM are delivered by
            6 PM
          </p>
          <p className="font-body text-sm text-foreground mt-1">
            📅 <strong>Next Day</strong> — orders after 10 AM are delivered the
            following morning
          </p>
          <p className="font-body text-xs text-muted-foreground mt-3">
            You'll receive a WhatsApp message when your order is out for
            delivery.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full bg-[#25D366] hover:bg-[#1fba5a] text-white rounded-full font-body font-semibold py-3 transition-smooth"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="order_success.whatsapp_button"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Us for Confirmation
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full rounded-full font-body font-semibold py-3 border-primary/30 text-primary hover:bg-primary/5"
          >
            <Link
              to="/products"
              data-ocid="order_success.continue_shopping_button"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground font-body pt-2">
          Questions? Call us or WhatsApp anytime — we're happy to help! 🐄
        </p>
      </div>
    </div>
  );
}

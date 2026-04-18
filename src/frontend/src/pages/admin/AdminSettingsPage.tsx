import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Skeleton } from "../../components/ui/skeleton";
import { Textarea } from "../../components/ui/textarea";
import type { Settings as SettingsType } from "../../types";

interface SettingsForm {
  businessPhone: string;
  whatsappNumber: string;
  contactEmail: string;
  hoursOfOperation: string;
  deliveryPolicy: string;
  whatsappGreeting: string;
}

const emptyForm: SettingsForm = {
  businessPhone: "",
  whatsappNumber: "",
  contactEmail: "",
  hoursOfOperation: "",
  deliveryPolicy: "",
  whatsappGreeting: "",
};

function toForm(s: SettingsType): SettingsForm {
  return {
    businessPhone: s.businessPhone,
    whatsappNumber: s.whatsappNumber,
    contactEmail: s.contactEmail,
    hoursOfOperation: s.hoursOfOperation,
    deliveryPolicy: s.deliveryPolicy,
    whatsappGreeting: s.whatsappGreeting,
  };
}

export function AdminSettingsPage() {
  const qc = useQueryClient();
  const { actor, isFetching } = useActor(createActor);
  const { identity } = useInternetIdentity();
  const [form, setForm] = useState<SettingsForm>(emptyForm);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSettings();
    },
    enabled: !!actor && !isFetching,
  });

  const { data: adminPrincipal } = useQuery({
    queryKey: ["admin-principal"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAdmin();
    },
    enabled: !!actor && !isFetching,
  });

  useEffect(() => {
    if (settings) setForm(toForm(settings));
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: (data: SettingsType) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateSettings(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-settings"] });
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Settings saved successfully");
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const setAdminMutation = useMutation({
    mutationFn: () => {
      if (!actor) throw new Error("Actor not ready");
      if (!identity) throw new Error("Not authenticated");
      return actor.setAdmin(identity.getPrincipal());
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-principal"] });
      qc.invalidateQueries({ queryKey: ["isAdmin"] });
      toast.success("Admin principal updated to your account");
    },
    onError: () => toast.error("Failed to update admin"),
  });

  const set = (field: keyof SettingsForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({
      businessPhone: form.businessPhone,
      whatsappNumber: form.whatsappNumber,
      contactEmail: form.contactEmail,
      hoursOfOperation: form.hoursOfOperation,
      deliveryPolicy: form.deliveryPolicy,
      whatsappGreeting: form.whatsappGreeting,
    });
  };

  return (
    <div className="space-y-8 max-w-2xl" data-ocid="admin_settings.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            Manage your business information and preferences
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="card-elevated rounded-xl p-6">
        <h2 className="font-display font-semibold text-lg text-foreground mb-5">
          Business Information
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="business-phone">Business Phone</Label>
                <Input
                  id="business-phone"
                  type="tel"
                  value={form.businessPhone}
                  onChange={(e) => set("businessPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                  data-ocid="settings.business_phone_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp-num">WhatsApp Number</Label>
                <Input
                  id="whatsapp-num"
                  type="tel"
                  value={form.whatsappNumber}
                  onChange={(e) => set("whatsappNumber", e.target.value)}
                  placeholder="+91 98765 43210"
                  data-ocid="settings.whatsapp_number_input"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={form.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)}
                placeholder="hello@solodairyfarm.com"
                data-ocid="settings.contact_email_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hours">Hours of Operation</Label>
              <Textarea
                id="hours"
                value={form.hoursOfOperation}
                onChange={(e) => set("hoursOfOperation", e.target.value)}
                placeholder="Mon-Sat: 6:00 AM – 8:00 PM&#10;Sunday: 7:00 AM – 12:00 PM"
                rows={3}
                data-ocid="settings.hours_textarea"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="delivery-policy">Delivery Policy</Label>
              <Textarea
                id="delivery-policy"
                value={form.deliveryPolicy}
                onChange={(e) => set("deliveryPolicy", e.target.value)}
                placeholder="Free delivery within 10km. Delivery by 8:00 AM for morning orders."
                rows={4}
                data-ocid="settings.delivery_policy_textarea"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="wa-greeting">WhatsApp Greeting Message</Label>
              <Textarea
                id="wa-greeting"
                value={form.whatsappGreeting}
                onChange={(e) => set("whatsappGreeting", e.target.value)}
                placeholder="Hello! I'm interested in ordering fresh dairy products from Solo Dairy Farm."
                rows={3}
                data-ocid="settings.whatsapp_greeting_textarea"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="btn-primary w-full sm:w-auto"
                disabled={saveMutation.isPending}
                data-ocid="settings.save_button"
              >
                {saveMutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        )}
      </div>

      <Separator />

      {/* Admin Management */}
      <div className="card-elevated rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg text-foreground">
            Admin Management
          </h2>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-body">
            Current Admin Principal
          </p>
          {adminPrincipal ? (
            <p
              className="font-mono text-xs bg-muted rounded-lg px-3 py-2 text-foreground break-all"
              data-ocid="settings.admin_principal_display"
            >
              {adminPrincipal.toString()}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground font-body italic">
              No admin set
            </p>
          )}
        </div>

        {identity && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-body">
              Your Principal
            </p>
            <p className="font-mono text-xs bg-muted rounded-lg px-3 py-2 text-foreground break-all">
              {identity.getPrincipal().toString()}
            </p>
          </div>
        )}

        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setAdminMutation.mutate()}
            disabled={setAdminMutation.isPending || !identity}
            data-ocid="settings.set_admin_button"
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            {setAdminMutation.isPending
              ? "Updating..."
              : "Set My Account as Admin"}
          </Button>
          <p className="text-xs text-muted-foreground font-body mt-2">
            This will grant your current Internet Identity admin access.
          </p>
        </div>
      </div>
    </div>
  );
}

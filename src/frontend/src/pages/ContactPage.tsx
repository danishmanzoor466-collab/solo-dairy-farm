import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useSettings, useSubmitEnquiry } from "../hooks/useBackend";
import { EnquiryType } from "../types";

interface FormState {
  name: string;
  phone: string;
  email: string;
  enquiryType: EnquiryType | "";
  subject: string;
  message: string;
}

const defaultForm: FormState = {
  name: "",
  phone: "",
  email: "",
  enquiryType: "",
  subject: "",
  message: "",
};

export function ContactPage() {
  const { data: settings } = useSettings();
  const submitEnquiry = useSubmitEnquiry();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [successId, setSuccessId] = useState<bigint | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const businessPhone = settings?.businessPhone ?? "+91 98765 43210";
  const whatsappNumber = settings?.whatsappNumber ?? "919876543210";
  const whatsappGreeting =
    settings?.whatsappGreeting ??
    "Hello! I'm interested in Solo Dairy Farm products.";
  const hours =
    settings?.hoursOfOperation ??
    "Mon–Sat: 6:00 AM – 8:00 PM\nSun: 7:00 AM – 1:00 PM";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappGreeting)}`;

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!form.enquiryType) return;

    try {
      const result = await submitEnquiry.mutateAsync({
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        enquiryType: form.enquiryType as EnquiryType,
        subject: form.subject,
        message: form.message,
      });
      setSuccessId(result.id);
      setForm(defaultForm);
    } catch {
      setSubmitError(
        "Something went wrong. Please try again or reach us via WhatsApp.",
      );
    }
  }

  const infoCards = [
    {
      icon: Phone,
      title: "Call Us",
      content: businessPhone,
      action: (
        <a
          href={`tel:${businessPhone.replace(/\s/g, "")}`}
          className="inline-flex items-center gap-2 btn-primary px-4 py-2 rounded-lg text-sm font-semibold mt-3"
          data-ocid="contact.phone_link"
        >
          <Phone className="w-4 h-4" />
          Call Now
        </a>
      ),
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      content: `Chat with us at\n${whatsappNumber}`,
      action: (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold mt-3 bg-[#25D366] text-white hover:opacity-90 transition-smooth"
          data-ocid="contact.whatsapp_button"
        >
          <MessageCircle className="w-4 h-4" />
          Chat on WhatsApp
        </a>
      ),
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: hours,
      action: null,
    },
  ];

  return (
    <div data-ocid="contact.page" className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-primary section-padding text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3">
            Get in Touch
          </h1>
          <p className="text-primary-foreground/80 text-base sm:text-lg max-w-xl mx-auto font-body">
            We'd love to hear from you — whether it's a product question, cow
            enquiry, or just a friendly hello. We're here for you.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section
        className="bg-muted/30 section-padding"
        data-ocid="contact.info_section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {infoCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="card-elevated rounded-2xl p-6 flex flex-col items-center text-center"
                data-ocid={`contact.info_card.${i + 1}`}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <card.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {card.title}
                </h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line font-body">
                  {card.content}
                </p>
                {card.action}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section
        className="bg-background section-padding"
        data-ocid="contact.location_section"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
              Find Us
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              {/* Static map placeholder */}
              <div
                className="rounded-2xl border border-border bg-muted/40 flex flex-col items-center justify-center min-h-[280px] gap-4 p-8 relative overflow-hidden"
                data-ocid="contact.map_placeholder"
              >
                {/* Decorative grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(oklch(0.37 0.095 159) 1px, transparent 1px), linear-gradient(90deg, oklch(0.37 0.095 159) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
                <MapPin className="w-12 h-12 text-primary relative z-10" />
                <div className="text-center relative z-10">
                  <p className="font-display font-semibold text-foreground text-lg">
                    Solo Dairy Farm
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    Location Map
                  </p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 inline-flex items-center gap-2 btn-secondary px-4 py-2 rounded-lg text-sm font-semibold"
                  data-ocid="contact.directions_whatsapp_button"
                >
                  <MessageCircle className="w-4 h-4" />
                  Get Directions via WhatsApp
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Use the WhatsApp button to get directions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="flex flex-col gap-5"
            >
              <div className="card-elevated rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Farm Address
                </h3>
                <address className="not-italic font-body text-muted-foreground leading-relaxed text-sm space-y-1">
                  <p className="font-semibold text-foreground">
                    Solo Dairy Farm
                  </p>
                  <p>Village Road, Near Gram Panchayat</p>
                  <p>Tal. Shirpur, Dist. Dhule</p>
                  <p>Maharashtra – 425405</p>
                  <p>India</p>
                </address>
              </div>
              <div className="card-elevated rounded-2xl p-6">
                <h3 className="font-display text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Quick Contact
                </h3>
                <p className="text-muted-foreground text-sm font-body mb-3">
                  For the fastest response, reach us directly on WhatsApp. We
                  typically reply within 30 minutes.
                </p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[#25D366] text-white hover:opacity-90 transition-smooth"
                  data-ocid="contact.quick_whatsapp_button"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message on WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section
        className="bg-muted/20 section-padding"
        data-ocid="contact.form_section"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Send Us a Message
            </h2>
            <p className="text-muted-foreground font-body">
              Fill out the form and we'll get back to you as soon as possible.
            </p>
          </motion.div>

          {successId !== null ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="card-elevated rounded-2xl p-8 text-center"
              data-ocid="contact.form.success_state"
            >
              <CheckCircle className="w-14 h-14 text-accent mx-auto mb-4" />
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Message Sent!
              </h3>
              <p className="text-muted-foreground font-body mb-2">
                Thank you for reaching out. We'll get back to you soon.
              </p>
              <p className="text-sm font-mono bg-muted/60 rounded-lg px-4 py-2 inline-block text-foreground mt-1">
                Reference #{successId.toString()}
              </p>
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setSuccessId(null)}
                  data-ocid="contact.form.send_another_button"
                >
                  Send Another Message
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="card-elevated rounded-2xl p-6 sm:p-8 space-y-5"
              data-ocid="contact.form"
            >
              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-name"
                    className="font-body text-sm font-semibold"
                  >
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact-name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    data-ocid="contact.form.name_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="contact-phone"
                    className="font-body text-sm font-semibold"
                  >
                    Phone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    data-ocid="contact.form.phone_input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-email"
                  className="font-body text-sm font-semibold"
                >
                  Email{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  data-ocid="contact.form.email_input"
                />
              </div>

              {/* Enquiry Type */}
              <div className="space-y-1.5">
                <Label className="font-body text-sm font-semibold">
                  Enquiry Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  required
                  value={form.enquiryType}
                  onValueChange={(val) => handleChange("enquiryType", val)}
                >
                  <SelectTrigger data-ocid="contact.form.enquiry_type_select">
                    <SelectValue placeholder="Select enquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EnquiryType.ProductQuestion}>
                      Product Question
                    </SelectItem>
                    <SelectItem value={EnquiryType.CowInquiry}>
                      Cow Inquiry
                    </SelectItem>
                    <SelectItem value={EnquiryType.General}>
                      General Enquiry
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-subject"
                  className="font-body text-sm font-semibold"
                >
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-subject"
                  placeholder="How can we help you?"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  required
                  data-ocid="contact.form.subject_input"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="contact-message"
                  className="font-body text-sm font-semibold"
                >
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="Tell us more about your enquiry..."
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                  rows={5}
                  className="resize-none"
                  data-ocid="contact.form.message_textarea"
                />
              </div>

              {/* Error state */}
              {submitError && (
                <div
                  className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  data-ocid="contact.form.error_state"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="font-body">{submitError}</span>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitEnquiry.isPending || !form.enquiryType}
                className="w-full btn-primary h-11 font-semibold text-base gap-2"
                data-ocid="contact.form.submit_button"
              >
                {submitEnquiry.isPending ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>

              {submitEnquiry.isPending && (
                <div data-ocid="contact.form.loading_state" className="sr-only">
                  Submitting your enquiry, please wait.
                </div>
              )}
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}

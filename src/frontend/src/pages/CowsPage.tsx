import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useCows, useSubmitEnquiry } from "@/hooks/useBackend";
import { type Cow, EnquiryType } from "@/types";
import {
  Beef,
  CheckCircle2,
  Droplets,
  Filter,
  Heart,
  LayoutGrid,
  LayoutList,
  Mail,
  MessageSquare,
  Phone,
  SlidersHorizontal,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ViewMode = "grid" | "list";
type BreedFilter = "All" | "HF" | "Gir" | "Jersey" | "Sahiwal";
type HealthFilter = "All" | "Excellent" | "Good";

function formatAge(ageMonths: bigint): string {
  const months = Number(ageMonths);
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} Month${rem !== 1 ? "s" : ""}`;
  if (rem === 0) return `${years} Year${years !== 1 ? "s" : ""}`;
  return `${years} Year${years !== 1 ? "s" : ""} ${rem} Month${rem !== 1 ? "s" : ""}`;
}

function formatPrice(price: bigint): string {
  const val = Number(price) / 100;
  return `₹${val.toLocaleString("en-IN")}`;
}

interface EnquiryDialogProps {
  cow: Cow | null;
  open: boolean;
  onClose: () => void;
}

function EnquiryDialog({ cow, open, onClose }: EnquiryDialogProps) {
  const { mutateAsync: submitEnquiry, isPending } = useSubmitEnquiry();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: cow
      ? `I'm interested in your ${cow.breed} cow priced at ${formatPrice(cow.price)}. Please provide more details.`
      : "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState<string>("");

  // Reset form when cow changes
  useEffect(() => {
    if (cow) {
      setForm({
        name: "",
        phone: "",
        email: "",
        message: `I'm interested in your ${cow.breed} cow priced at ${formatPrice(cow.price)}. Please provide more details.`,
      });
      setSubmitted(false);
    }
  }, [cow]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cow) return;
    try {
      const result = await submitEnquiry({
        customerName: form.name,
        customerPhone: form.phone,
        customerEmail: form.email,
        subject: `Cow Enquiry - ${cow.breed}`,
        message: form.message,
        enquiryType: EnquiryType.CowInquiry,
      });
      setRefId(`ENQ-${result.id.toString()}`);
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit enquiry. Please try again.");
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md w-full mx-auto"
        data-ocid="cows.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {submitted
              ? "Enquiry Submitted!"
              : `Enquire About ${cow?.breed} Cow`}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-6 text-center"
            data-ocid="cows.success_state"
          >
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-accent" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-foreground">
                We'll be in touch soon!
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Reference ID:{" "}
                <span className="font-mono font-semibold text-primary">
                  {refId}
                </span>
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Our team will contact you within 24 hours to discuss the cow
              details.
            </p>
            <Button
              onClick={handleClose}
              className="btn-primary w-full mt-2"
              data-ocid="cows.close_button"
            >
              Close
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="enq-name" className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Full Name *
              </Label>
              <Input
                id="enq-name"
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="cows.name.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="enq-phone" className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone Number *
              </Label>
              <Input
                id="enq-phone"
                required
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                data-ocid="cows.phone.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="enq-email" className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email (Optional)
              </Label>
              <Input
                id="enq-email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                data-ocid="cows.email.input"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="enq-msg" className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Message
              </Label>
              <Textarea
                id="enq-msg"
                rows={3}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                data-ocid="cows.message.textarea"
              />
            </div>
            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
                data-ocid="cows.cancel_button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 btn-primary"
                disabled={isPending}
                data-ocid="cows.submit_button"
              >
                {isPending ? "Sending..." : "Send Enquiry"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface CowCardGridProps {
  cow: Cow;
  index: number;
  onEnquire: (cow: Cow) => void;
}

function CowCardGrid({ cow, index, onEnquire }: CowCardGridProps) {
  const isExcellent = cow.healthStatus.toLowerCase() === "excellent";
  const imgSrc = cow.imageUrls.length > 0 ? cow.imageUrls[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="card-elevated rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-smooth group"
      data-ocid={`cows.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={cow.breed}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-muted/50">
            <Beef className="w-12 h-12 text-muted-foreground/40" />
            <span className="text-xs text-muted-foreground">{cow.breed}</span>
          </div>
        )}
        <Badge
          className={`absolute top-2 right-2 text-xs ${
            isExcellent
              ? "bg-accent/90 text-accent-foreground"
              : "bg-secondary/80 text-secondary-foreground"
          }`}
          data-ocid={`cows.health_badge.${index + 1}`}
        >
          <Heart className="w-3 h-3 mr-1" />
          {cow.healthStatus}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="font-display text-xl font-semibold text-foreground leading-tight">
          {cow.breed}
        </h3>
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 text-primary">🐄</span>
            <span>Age: {formatAge(cow.ageMonths)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-primary shrink-0" />
            <span>{Number(cow.milkCapacityLiters)} Liters/day</span>
          </div>
        </div>
        {cow.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {cow.description}
          </p>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-primary">
            {formatPrice(cow.price)}
          </span>
          <Button
            size="sm"
            className="btn-primary text-xs"
            onClick={() => onEnquire(cow)}
            data-ocid={`cows.enquire_button.${index + 1}`}
          >
            Make Enquiry
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

interface CowCardListProps {
  cow: Cow;
  index: number;
  onEnquire: (cow: Cow) => void;
}

function CowCardList({ cow, index, onEnquire }: CowCardListProps) {
  const isExcellent = cow.healthStatus.toLowerCase() === "excellent";
  const imgSrc = cow.imageUrls.length > 0 ? cow.imageUrls[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="card-elevated rounded-xl overflow-hidden flex flex-row hover:shadow-lg transition-smooth"
      data-ocid={`cows.item.${index + 1}`}
    >
      {/* Image */}
      <div className="relative w-28 sm:w-36 md:w-44 shrink-0 bg-muted">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={cow.breed}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center min-h-[100px]">
            <Beef className="w-10 h-10 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 sm:p-4 gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
            {cow.breed}
          </h3>
          <Badge
            className={`shrink-0 text-xs ${
              isExcellent
                ? "bg-accent/90 text-accent-foreground"
                : "bg-secondary/80 text-secondary-foreground"
            }`}
          >
            {cow.healthStatus}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>🐄 {formatAge(cow.ageMonths)}</span>
          <span className="flex items-center gap-1">
            <Droplets className="w-3 h-3 text-primary" />
            {Number(cow.milkCapacityLiters)}L/day
          </span>
        </div>
        {cow.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
            {cow.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-1 gap-2">
          <span className="font-display font-bold text-primary">
            {formatPrice(cow.price)}
          </span>
          <Button
            size="sm"
            className="btn-primary text-xs"
            onClick={() => onEnquire(cow)}
            data-ocid={`cows.enquire_button.${index + 1}`}
          >
            Make Enquiry
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function CowSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {(["s1", "s2", "s3", "s4", "s5", "s6"] as const).map((sk) => (
        <div key={sk} className="card-elevated rounded-xl overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <div className="p-4 flex flex-col gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
            <div className="flex justify-between items-center mt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const ALL_BREEDS: BreedFilter[] = ["All", "HF", "Gir", "Jersey", "Sahiwal"];
const HEALTH_OPTIONS: HealthFilter[] = ["All", "Excellent", "Good"];

export function CowsPage() {
  const { data: cows, isLoading } = useCows();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [breedFilter, setBreedFilter] = useState<BreedFilter>("All");
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [enquiryTarget, setEnquiryTarget] = useState<Cow | null>(null);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!cows) return [];
    return cows.filter((c) => {
      if (
        breedFilter !== "All" &&
        !c.breed.toLowerCase().includes(breedFilter.toLowerCase())
      )
        return false;
      if (
        healthFilter !== "All" &&
        c.healthStatus.toLowerCase() !== healthFilter.toLowerCase()
      )
        return false;
      const priceVal = Number(c.price) / 100;
      if (minPrice !== "" && priceVal < Number(minPrice)) return false;
      if (maxPrice !== "" && priceVal > Number(maxPrice)) return false;
      return true;
    });
  }, [cows, breedFilter, healthFilter, minPrice, maxPrice]);

  const hasActiveFilters =
    breedFilter !== "All" ||
    healthFilter !== "All" ||
    minPrice !== "" ||
    maxPrice !== "";

  const resetFilters = () => {
    setBreedFilter("All");
    setHealthFilter("All");
    setMinPrice("");
    setMaxPrice("");
  };

  const handleEnquire = (cow: Cow) => {
    setEnquiryTarget(cow);
    setEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen" data-ocid="cows.page">
      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-foreground/10 mb-4">
              <Beef className="w-7 h-7" />
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
              Cows for Sale
            </h1>
            <p className="text-primary-foreground/80 text-base sm:text-lg max-w-xl mx-auto">
              Hand-raised, healthy dairy cows — certified breeds, verified
              health records, direct from our farm.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters + View Toggle */}
      <section className="bg-card border-b border-border sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            {/* Filters row */}
            <div
              className="flex flex-wrap items-end gap-3 flex-1"
              data-ocid="cows.filters.section"
            >
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium shrink-0">
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </div>

              {/* Breed */}
              <div className="flex flex-col gap-1 min-w-[120px]">
                <Label className="text-xs text-muted-foreground">Breed</Label>
                <Select
                  value={breedFilter}
                  onValueChange={(v) => setBreedFilter(v as BreedFilter)}
                >
                  <SelectTrigger
                    className="h-8 text-sm"
                    data-ocid="cows.breed.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_BREEDS.map((b) => (
                      <SelectItem key={`breed-${b}`} value={b}>
                        {b === "All" ? "All Breeds" : b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Health */}
              <div className="flex flex-col gap-1 min-w-[110px]">
                <Label className="text-xs text-muted-foreground">Health</Label>
                <Select
                  value={healthFilter}
                  onValueChange={(v) => setHealthFilter(v as HealthFilter)}
                >
                  <SelectTrigger
                    className="h-8 text-sm"
                    data-ocid="cows.health.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HEALTH_OPTIONS.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h === "All" ? "All" : h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price range */}
              <div className="flex flex-col gap-1">
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> Price (₹)
                </Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    placeholder="Min"
                    className="h-8 text-sm w-20"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    data-ocid="cows.price_min.input"
                  />
                  <span className="text-muted-foreground text-xs">–</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    className="h-8 text-sm w-20"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    data-ocid="cows.price_max.input"
                  />
                </div>
              </div>

              {/* Reset */}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs gap-1 text-muted-foreground hover:text-destructive"
                  onClick={resetFilters}
                  data-ocid="cows.reset_filters.button"
                >
                  <X className="w-3 h-3" />
                  Reset
                </Button>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5 shrink-0 self-end sm:self-auto">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                className="h-7 w-8 p-0"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                data-ocid="cows.grid_view.toggle"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                className="h-7 w-8 p-0"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                data-ocid="cows.list_view.toggle"
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isLoading ? (
          <div data-ocid="cows.loading_state">
            <CowSkeletonGrid />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-20 text-center"
            data-ocid="cows.empty_state"
          >
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Beef className="w-10 h-10 text-muted-foreground/40" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              No cows found
            </h2>
            <p className="text-muted-foreground text-sm max-w-xs">
              {hasActiveFilters
                ? "No cows match your current filters. Try adjusting your criteria."
                : "We don't have any cows available right now. Check back soon!"}
            </p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={resetFilters}
                data-ocid="cows.empty_reset.button"
              >
                Clear Filters
              </Button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                cow{filtered.length !== 1 ? "s" : ""} available
              </p>
            </div>

            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                  data-ocid="cows.grid.list"
                >
                  {filtered.map((cow, i) => (
                    <CowCardGrid
                      key={cow.id.toString()}
                      cow={cow}
                      index={i}
                      onEnquire={handleEnquire}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4"
                  data-ocid="cows.list.list"
                >
                  {filtered.map((cow, i) => (
                    <CowCardList
                      key={cow.id.toString()}
                      cow={cow}
                      index={i}
                      onEnquire={handleEnquire}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </section>

      {/* Enquiry Dialog */}
      <EnquiryDialog
        cow={enquiryTarget}
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
      />
    </div>
  );
}

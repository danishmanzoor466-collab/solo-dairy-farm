import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, MessageSquare, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import type { Enquiry } from "../../types";
import { EnquiryStatus, EnquiryType } from "../../types";

const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-100 text-blue-800 border-blue-200",
  Read: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Replied: "bg-green-100 text-green-800 border-green-200",
};

const TYPE_LABELS: Record<string, string> = {
  General: "General",
  ProductQuestion: "Product",
  CowInquiry: "Cow Enquiry",
};

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EnquiryRow({
  enquiry,
  index,
  onStatusChange,
  updating,
}: {
  enquiry: Enquiry;
  index: number;
  onStatusChange: (id: bigint, status: EnquiryStatus) => void;
  updating: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusClass =
    STATUS_COLORS[enquiry.status as string] ??
    "bg-muted text-foreground border-border";
  const waLink = `https://wa.me/${enquiry.customerPhone.replace(/\D/g, "")}`;

  return (
    <>
      <div
        className="card-elevated rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-smooth"
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((prev) => !prev)}
        data-ocid={`enquiries.item.${index + 1}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-foreground font-body">
                  {enquiry.customerName}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${statusClass}`}
                  data-ocid={`enquiries.status_badge.${index + 1}`}
                >
                  {enquiry.status as string}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs bg-accent/10 text-accent-foreground border-accent/30"
                >
                  {TYPE_LABELS[enquiry.enquiryType as string] ??
                    enquiry.enquiryType}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-body mt-0.5 truncate max-w-xs">
                {enquiry.subject}
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground font-body">
              {formatDate(enquiry.createdAt)}
            </p>
            <p className="text-xs text-muted-foreground font-body">
              {enquiry.customerPhone}
            </p>
          </div>
        </div>

        {expanded && (
          <section
            className="mt-4 pt-4 border-t border-border space-y-3"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            data-ocid={`enquiries.expanded.${index + 1}`}
          >
            {/* Message */}
            <p className="text-sm font-body text-foreground bg-muted/40 rounded-lg p-3 leading-relaxed">
              {enquiry.message}
            </p>

            {enquiry.customerEmail && (
              <p className="text-xs text-muted-foreground font-body">
                Email: {enquiry.customerEmail}
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              {enquiry.status !== EnquiryStatus.Read &&
                enquiry.status !== EnquiryStatus.Replied && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={updating}
                    onClick={() =>
                      onStatusChange(enquiry.id, EnquiryStatus.Read)
                    }
                    data-ocid={`enquiries.mark_read_button.${index + 1}`}
                  >
                    Mark as Read
                  </Button>
                )}
              {enquiry.status !== EnquiryStatus.Replied && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={updating}
                  onClick={() =>
                    onStatusChange(enquiry.id, EnquiryStatus.Replied)
                  }
                  data-ocid={`enquiries.mark_replied_button.${index + 1}`}
                >
                  Mark as Replied
                </Button>
              )}
              <a
                href={`tel:${enquiry.customerPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm font-body font-medium text-foreground hover:bg-muted transition-colors"
                data-ocid={`enquiries.call_button.${index + 1}`}
              >
                <Phone className="w-3.5 h-3.5" />
                Call
              </a>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[oklch(0.55_0.18_142)] text-white text-sm font-body font-medium hover:opacity-90 transition-colors"
                data-ocid={`enquiries.whatsapp_button.${index + 1}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 fill-current"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M11.988 2.007C6.47 2.007 2.007 6.47 2.007 11.988c0 1.731.46 3.356 1.265 4.761L2 22l5.392-1.243A9.977 9.977 0 0011.988 22c5.518 0 9.981-4.463 9.981-9.981S17.506 2.007 11.988 2.007z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </section>
        )}
      </div>
    </>
  );
}

type FilterStatus = "All" | EnquiryStatus;

export function AdminEnquiriesPage() {
  const qc = useQueryClient();
  const { actor, isFetching } = useActor(createActor);
  const [filter, setFilter] = useState<FilterStatus>("All");

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEnquiries();
    },
    enabled: !!actor && !isFetching,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: bigint;
      status: EnquiryStatus;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateEnquiryStatus(id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
      qc.invalidateQueries({ queryKey: ["dashboardStats"] });
      toast.success("Enquiry status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const filterTabs: FilterStatus[] = [
    "All",
    EnquiryStatus.New,
    EnquiryStatus.Read,
    EnquiryStatus.Replied,
  ];

  const filtered =
    filter === "All" ? enquiries : enquiries.filter((e) => e.status === filter);

  return (
    <div className="space-y-6" data-ocid="admin_enquiries.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <h1 className="font-display font-bold text-2xl text-foreground">
          Enquiries
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap" data-ocid="enquiries.filter_tabs">
        {filterTabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-colors ${
              filter === tab
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
            data-ocid={`enquiries.filter.${tab.toLowerCase()}_tab`}
          >
            {tab}
            {tab !== "All" && (
              <span className="ml-1 opacity-70">
                ({enquiries.filter((e) => e.status === tab).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="card-elevated rounded-xl p-12 text-center space-y-2"
          data-ocid="enquiries.empty_state"
        >
          <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto" />
          <p className="font-body text-muted-foreground">
            No enquiries found for this filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="enquiries.list">
          {filtered.map((enquiry, i) => (
            <EnquiryRow
              key={enquiry.id.toString()}
              enquiry={enquiry}
              index={i}
              onStatusChange={(id, status) =>
                statusMutation.mutate({ id, status })
              }
              updating={statusMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

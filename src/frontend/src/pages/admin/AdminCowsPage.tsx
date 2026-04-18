import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Beef, Edit2, ImageIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../../backend";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Skeleton } from "../../components/ui/skeleton";
import { Switch } from "../../components/ui/switch";
import { Textarea } from "../../components/ui/textarea";
import type { Cow, CowInput } from "../../types";

interface CowFormData {
  breed: string;
  ageMonths: string;
  milkCapacityLiters: string;
  healthStatus: string;
  price: string;
  description: string;
  imageUrls: string;
  isAvailable: boolean;
}

const emptyCowForm: CowFormData = {
  breed: "",
  ageMonths: "",
  milkCapacityLiters: "",
  healthStatus: "Healthy",
  price: "",
  description: "",
  imageUrls: "",
  isAvailable: true,
};

function CowFormModal({
  open,
  onClose,
  cow,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  cow: Cow | null;
  onSubmit: (data: CowInput) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<CowFormData>(() =>
    cow
      ? {
          breed: cow.breed,
          ageMonths: String(cow.ageMonths),
          milkCapacityLiters: String(cow.milkCapacityLiters),
          healthStatus: cow.healthStatus,
          price: (Number(cow.price) / 100).toFixed(0),
          description: cow.description,
          imageUrls: cow.imageUrls.join(", "),
          isAvailable: cow.isAvailable,
        }
      : emptyCowForm,
  );

  const set = (field: keyof CowFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Math.round(Number.parseFloat(form.price) * 100);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    const urls = form.imageUrls
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
    onSubmit({
      breed: form.breed,
      ageMonths: BigInt(Number.parseInt(form.ageMonths) || 0),
      milkCapacityLiters: BigInt(Number.parseInt(form.milkCapacityLiters) || 0),
      healthStatus: form.healthStatus,
      price: BigInt(priceNum),
      description: form.description,
      imageUrls: urls,
      isAvailable: form.isAvailable,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        data-ocid="cow.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            {cow ? "Edit Cow" : "Add Cow"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="cow-breed">Breed</Label>
            <Input
              id="cow-breed"
              value={form.breed}
              onChange={(e) => set("breed", e.target.value)}
              placeholder="HF / Jersey / Desi"
              required
              data-ocid="cow.breed_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cow-age">Age (months)</Label>
              <Input
                id="cow-age"
                type="number"
                min="0"
                value={form.ageMonths}
                onChange={(e) => set("ageMonths", e.target.value)}
                placeholder="36"
                data-ocid="cow.age_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cow-milk">Milk/day (L)</Label>
              <Input
                id="cow-milk"
                type="number"
                min="0"
                value={form.milkCapacityLiters}
                onChange={(e) => set("milkCapacityLiters", e.target.value)}
                placeholder="15"
                data-ocid="cow.milk_capacity_input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cow-health">Health Status</Label>
              <Input
                id="cow-health"
                value={form.healthStatus}
                onChange={(e) => set("healthStatus", e.target.value)}
                placeholder="Healthy"
                data-ocid="cow.health_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cow-price">Price (₹)</Label>
              <Input
                id="cow-price"
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="60000"
                required
                data-ocid="cow.price_input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cow-desc">Description</Label>
            <Textarea
              id="cow-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              placeholder="Vaccinated, good temperament..."
              data-ocid="cow.description_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cow-imgs">
              Image URLs{" "}
              <span className="text-muted-foreground text-xs">
                (comma-separated)
              </span>
            </Label>
            <Input
              id="cow-imgs"
              value={form.imageUrls}
              onChange={(e) => set("imageUrls", e.target.value)}
              placeholder="https://img1.jpg, https://img2.jpg"
              data-ocid="cow.image_urls_input"
            />
          </div>
          <div className="flex items-center justify-between py-1">
            <Label htmlFor="cow-avail" className="cursor-pointer">
              Available for sale
            </Label>
            <Switch
              id="cow-avail"
              checked={form.isAvailable}
              onCheckedChange={(v) => set("isAvailable", v)}
              data-ocid="cow.available_switch"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-ocid="cow.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
              data-ocid="cow.submit_button"
            >
              {loading ? "Saving..." : cow ? "Save Changes" : "Add Cow"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminCowsPage() {
  const qc = useQueryClient();
  const { actor, isFetching } = useActor(createActor);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCow, setEditingCow] = useState<Cow | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const { data: cows = [], isLoading } = useQuery({
    queryKey: ["admin-cows"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCows();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: (input: CowInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCow(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-cows"] });
      qc.invalidateQueries({ queryKey: ["cows"] });
      toast.success("Cow added successfully");
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to add cow"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: bigint; input: CowInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCow(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-cows"] });
      qc.invalidateQueries({ queryKey: ["cows"] });
      toast.success("Cow updated");
      setModalOpen(false);
      setEditingCow(null);
    },
    onError: () => toast.error("Failed to update cow"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCow(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-cows"] });
      qc.invalidateQueries({ queryKey: ["cows"] });
      toast.success("Cow deleted");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete cow"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.toggleCowAvailability(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-cows"] });
      qc.invalidateQueries({ queryKey: ["cows"] });
    },
    onError: () => toast.error("Failed to toggle availability"),
  });

  const handleSubmit = (data: CowInput) => {
    if (editingCow) {
      updateMutation.mutate({ id: editingCow.id, input: data });
    } else {
      addMutation.mutate(data);
    }
  };

  const mutLoading = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6" data-ocid="admin_cows.page">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display font-bold text-2xl text-foreground">
          Cows
        </h1>
        <Button
          className="btn-primary"
          onClick={() => {
            setEditingCow(null);
            setModalOpen(true);
          }}
          data-ocid="cows.add_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Cow
        </Button>
      </div>

      {/* Table */}
      <div className="card-elevated rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : cows.length === 0 ? (
          <div
            className="p-12 text-center space-y-2"
            data-ocid="cows.empty_state"
          >
            <Beef className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="font-body text-muted-foreground">
              No cows listed yet. Add your first cow.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Cow
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold hidden sm:table-cell">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold hidden md:table-cell">
                    Milk/day
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold hidden lg:table-cell">
                    Health
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Available
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cows.map((cow, i) => (
                  <tr
                    key={cow.id.toString()}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`cows.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {cow.imageUrls[0] ? (
                          <img
                            src={cow.imageUrls[0]}
                            alt={cow.breed}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 bg-muted"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium text-foreground">
                          {cow.breed}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {String(cow.ageMonths)}m
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {String(cow.milkCapacityLiters)}L
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge
                        variant="outline"
                        className="text-xs border-accent/40 text-accent-foreground bg-accent/10"
                      >
                        {cow.healthStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      ₹{(Number(cow.price) / 100).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={cow.isAvailable}
                        onCheckedChange={() => toggleMutation.mutate(cow.id)}
                        aria-label={`Toggle availability of ${cow.breed}`}
                        data-ocid={`cows.toggle.${i + 1}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingCow(cow);
                            setModalOpen(true);
                          }}
                          aria-label="Edit cow"
                          data-ocid={`cows.edit_button.${i + 1}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => setDeleteId(cow.id)}
                          aria-label="Delete cow"
                          data-ocid={`cows.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <CowFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCow(null);
        }}
        cow={editingCow}
        onSubmit={handleSubmit}
        loading={mutLoading}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="cow_delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cow?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The cow listing will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="cow_delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteId !== null && deleteMutation.mutate(deleteId)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="cow_delete.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

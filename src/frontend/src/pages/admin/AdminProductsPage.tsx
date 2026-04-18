import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, ImageIcon, Package, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import { Switch } from "../../components/ui/switch";
import { Textarea } from "../../components/ui/textarea";
import type { Product, ProductCategory, ProductInput } from "../../types";

const CATEGORY_LABELS: Record<string, string> = {
  Milk: "Milk",
  DairyProduct: "Dairy Product",
  Cow: "Cow",
};

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
}

const emptyForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "Milk",
  imageUrl: "",
  isActive: true,
};

function ProductFormModal({
  open,
  onClose,
  product,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (data: ProductInput) => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<ProductFormData>(() =>
    product
      ? {
          name: product.name,
          description: product.description,
          price: (Number(product.price) / 100).toFixed(2),
          stock: String(product.stock),
          category: product.category as string,
          imageUrl: product.imageUrl,
          isActive: product.isActive,
        }
      : emptyForm,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Math.round(Number.parseFloat(form.price) * 100);
    if (Number.isNaN(priceNum) || priceNum <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    onSubmit({
      name: form.name,
      description: form.description,
      price: BigInt(priceNum),
      stock: BigInt(Number.parseInt(form.stock) || 0),
      category: form.category as ProductCategory,
      imageUrl: form.imageUrl,
      isActive: form.isActive,
    });
  };

  const set = (field: keyof ProductFormData, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-y-auto"
        data-ocid="product.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            {product ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="prod-name">Name</Label>
            <Input
              id="prod-name"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Full Cream Milk"
              required
              data-ocid="product.name_input"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prod-desc">Description</Label>
            <Textarea
              id="prod-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Fresh full cream milk..."
              rows={3}
              data-ocid="product.description_input"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="prod-price">Price (₹)</Label>
              <Input
                id="prod-price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="50.00"
                required
                data-ocid="product.price_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-stock">Stock</Label>
              <Input
                id="prod-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="100"
                data-ocid="product.stock_input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v)}
            >
              <SelectTrigger data-ocid="product.category_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Milk">Milk</SelectItem>
                <SelectItem value="DairyProduct">Dairy Product</SelectItem>
                <SelectItem value="Cow">Cow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="prod-img">Image URL</Label>
            <Input
              id="prod-img"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://..."
              data-ocid="product.image_url_input"
            />
          </div>
          <div className="flex items-center justify-between py-1">
            <Label htmlFor="prod-active" className="cursor-pointer">
              Active (visible to customers)
            </Label>
            <Switch
              id="prod-active"
              checked={form.isActive}
              onCheckedChange={(v) => set("isActive", v)}
              data-ocid="product.active_switch"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-ocid="product.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
              data-ocid="product.submit_button"
            >
              {loading ? "Saving..." : product ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AdminProductsPage() {
  const qc = useQueryClient();
  const { actor, isFetching } = useActor(createActor);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });

  const addMutation = useMutation({
    mutationFn: (input: ProductInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addProduct(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product added successfully");
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to add product"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: bigint; input: ProductInput }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateProduct(id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated");
      setModalOpen(false);
      setEditingProduct(null);
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.toggleProductActive(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: () => toast.error("Failed to toggle product"),
  });

  const handleSubmit = (data: ProductInput) => {
    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, input: data });
    } else {
      addMutation.mutate(data);
    }
  };

  const openAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const mutLoading = addMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6" data-ocid="admin_products.page">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display font-bold text-2xl text-foreground">
          Products
        </h1>
        <Button
          className="btn-primary"
          onClick={openAdd}
          data-ocid="products.add_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
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
        ) : products.length === 0 ? (
          <div
            className="p-12 text-center space-y-2"
            data-ocid="products.empty_state"
          >
            <Package className="w-10 h-10 text-muted-foreground mx-auto" />
            <p className="font-body text-muted-foreground">
              No products yet. Add your first product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-body">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-muted-foreground font-semibold hidden sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-semibold hidden md:table-cell">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-center text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product, i) => (
                  <tr
                    key={product.id.toString()}
                    className="hover:bg-muted/20 transition-colors"
                    data-ocid={`products.item.${i + 1}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0 bg-muted"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        <span className="font-medium text-foreground truncate max-w-[140px]">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {CATEGORY_LABELS[product.category as string] ??
                        product.category}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      ₹{(Number(product.price) / 100).toFixed(0)}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                      {String(product.stock)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={() =>
                          toggleMutation.mutate(product.id)
                        }
                        aria-label={`Toggle ${product.name}`}
                        data-ocid={`products.toggle.${i + 1}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(product)}
                          aria-label="Edit product"
                          data-ocid={`products.edit_button.${i + 1}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={() => setDeleteId(product.id)}
                          aria-label="Delete product"
                          data-ocid={`products.delete_button.${i + 1}`}
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
      <ProductFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSubmit={handleSubmit}
        loading={mutLoading}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="product_delete.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The product will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="product_delete.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteId !== null && deleteMutation.mutate(deleteId)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="product_delete.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

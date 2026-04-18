// Re-export all types from backend.d.ts with any additional frontend types
export type {
  Product,
  ProductInput,
  Cow,
  CowInput,
  Order,
  OrderItem,
  OrderInput,
  Enquiry,
  EnquiryInput,
  Settings,
  Stats,
  ProductId,
  CowId,
  OrderId,
  EnquiryId,
  Timestamp,
} from "./backend.d";

export {
  ProductCategory,
  OrderStatus,
  OrderType,
  PaymentMethod,
  EnquiryStatus,
  EnquiryType,
} from "./backend.d";

// Frontend-only types
export interface CartItem {
  product: import("./backend.d").Product;
  quantity: number;
}

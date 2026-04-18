import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type EnquiryId = bigint;
export interface ProductInput {
    name: string;
    description: string;
    isActive: boolean;
    stock: bigint;
    imageUrl: string;
    category: ProductCategory;
    price: bigint;
}
export type Timestamp = bigint;
export interface EnquiryInput {
    customerName: string;
    subject: string;
    customerPhone: string;
    enquiryType: EnquiryType;
    message: string;
    customerEmail: string;
}
export interface CowInput {
    imageUrls: Array<string>;
    ageMonths: bigint;
    isAvailable: boolean;
    description: string;
    milkCapacityLiters: bigint;
    healthStatus: string;
    breed: string;
    price: bigint;
}
export interface OrderItem {
    productId: ProductId;
    quantity: bigint;
    price: bigint;
}
export interface Stats {
    totalOrders: bigint;
    pendingOrders: bigint;
    totalRevenue: bigint;
    pendingEnquiries: bigint;
}
export interface OrderInput {
    customerName: string;
    deliveryAddress: string;
    paymentMethod: PaymentMethod;
    customerPhone: string;
    orderType: OrderType;
    specialInstructions: string;
    totalAmount: bigint;
    items: Array<OrderItem>;
    customerEmail: string;
}
export interface Enquiry {
    id: EnquiryId;
    customerName: string;
    status: EnquiryStatus;
    subject: string;
    customerPhone: string;
    enquiryType: EnquiryType;
    createdAt: Timestamp;
    message: string;
    customerEmail: string;
}
export interface Order {
    id: OrderId;
    customerName: string;
    status: OrderStatus;
    deliveryAddress: string;
    paymentMethod: PaymentMethod;
    customerPhone: string;
    createdAt: Timestamp;
    orderType: OrderType;
    specialInstructions: string;
    totalAmount: bigint;
    items: Array<OrderItem>;
    customerEmail: string;
}
export interface Settings {
    deliveryPolicy: string;
    whatsappGreeting: string;
    whatsappNumber: string;
    contactEmail: string;
    businessPhone: string;
    hoursOfOperation: string;
}
export interface Cow {
    id: CowId;
    imageUrls: Array<string>;
    createdAt: Timestamp;
    ageMonths: bigint;
    isAvailable: boolean;
    description: string;
    milkCapacityLiters: bigint;
    healthStatus: string;
    breed: string;
    price: bigint;
}
export type ProductId = bigint;
export type CowId = bigint;
export type OrderId = bigint;
export interface Product {
    id: ProductId;
    name: string;
    createdAt: Timestamp;
    description: string;
    isActive: boolean;
    stock: bigint;
    imageUrl: string;
    category: ProductCategory;
    price: bigint;
}
export enum EnquiryStatus {
    New = "New",
    Read = "Read",
    Replied = "Replied"
}
export enum EnquiryType {
    ProductQuestion = "ProductQuestion",
    General = "General",
    CowInquiry = "CowInquiry"
}
export enum OrderStatus {
    Delivered = "Delivered",
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Pending = "Pending"
}
export enum OrderType {
    OneTime = "OneTime",
    SubscriptionWeekly = "SubscriptionWeekly",
    SubscriptionDaily = "SubscriptionDaily"
}
export enum PaymentMethod {
    UPI = "UPI",
    CashOnDelivery = "CashOnDelivery"
}
export enum ProductCategory {
    Cow = "Cow",
    Milk = "Milk",
    DairyProduct = "DairyProduct"
}
export interface backendInterface {
    addCow(input: CowInput): Promise<Cow>;
    addProduct(input: ProductInput): Promise<Product>;
    checkIsAdmin(): Promise<boolean>;
    deleteCow(id: CowId): Promise<boolean>;
    deleteProduct(id: ProductId): Promise<boolean>;
    getAdmin(): Promise<Principal | null>;
    getAvailableCows(): Promise<Array<Cow>>;
    getCowById(id: CowId): Promise<Cow | null>;
    getCows(): Promise<Array<Cow>>;
    getDashboardStats(): Promise<Stats>;
    getEnquiries(): Promise<Array<Enquiry>>;
    getOrderById(id: OrderId): Promise<Order | null>;
    getOrders(): Promise<Array<Order>>;
    getProductById(id: ProductId): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getProductsByCategory(category: ProductCategory): Promise<Array<Product>>;
    getSettings(): Promise<Settings>;
    placeOrder(input: OrderInput): Promise<Order>;
    setAdmin(principal: Principal): Promise<void>;
    submitEnquiry(input: EnquiryInput): Promise<Enquiry>;
    toggleCowAvailability(id: CowId): Promise<Cow | null>;
    toggleProductActive(id: ProductId): Promise<Product | null>;
    updateCow(id: CowId, input: CowInput): Promise<Cow | null>;
    updateEnquiryStatus(id: EnquiryId, status: EnquiryStatus): Promise<Enquiry | null>;
    updateOrderStatus(id: OrderId, status: OrderStatus): Promise<Order | null>;
    updateProduct(id: ProductId, input: ProductInput): Promise<Product | null>;
    updateSettings(settings: Settings): Promise<Settings>;
}

import type { backendInterface } from "../backend";
import {
  EnquiryStatus,
  EnquiryType,
  OrderStatus,
  OrderType,
  PaymentMethod,
  ProductCategory,
} from "../backend";

export const mockBackend: backendInterface = {
  addCow: async (input) => ({
    id: BigInt(1),
    imageUrls: input.imageUrls,
    createdAt: BigInt(Date.now()),
    ageMonths: input.ageMonths,
    isAvailable: input.isAvailable,
    description: input.description,
    milkCapacityLiters: input.milkCapacityLiters,
    healthStatus: input.healthStatus,
    breed: input.breed,
    price: input.price,
  }),

  addProduct: async (input) => ({
    id: BigInt(1),
    name: input.name,
    createdAt: BigInt(Date.now()),
    description: input.description,
    isActive: input.isActive,
    stock: input.stock,
    imageUrl: input.imageUrl,
    category: input.category,
    price: input.price,
  }),

  checkIsAdmin: async () => false,

  deleteCow: async () => true,

  deleteProduct: async () => true,

  getAdmin: async () => null,

  getAvailableCows: async () => [
    {
      id: BigInt(1),
      imageUrls: ["https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=400"],
      createdAt: BigInt(Date.now()),
      ageMonths: BigInt(36),
      isAvailable: true,
      description: "Healthy Gir cow with excellent milk yield. Well-maintained and regularly vaccinated.",
      milkCapacityLiters: BigInt(15),
      healthStatus: "Excellent",
      breed: "Gir",
      price: BigInt(55000),
    },
    {
      id: BigInt(2),
      imageUrls: ["https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400"],
      createdAt: BigInt(Date.now()),
      ageMonths: BigInt(48),
      isAvailable: true,
      description: "Premium HF cow, high milk producer. Ideal for dairy farming.",
      milkCapacityLiters: BigInt(20),
      healthStatus: "Good",
      breed: "Holstein Friesian",
      price: BigInt(75000),
    },
  ],

  getCowById: async () => null,

  getCows: async () => [
    {
      id: BigInt(1),
      imageUrls: ["https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=400"],
      createdAt: BigInt(Date.now()),
      ageMonths: BigInt(36),
      isAvailable: true,
      description: "Healthy Gir cow with excellent milk yield.",
      milkCapacityLiters: BigInt(15),
      healthStatus: "Excellent",
      breed: "Gir",
      price: BigInt(55000),
    },
  ],

  getDashboardStats: async () => ({
    totalOrders: BigInt(124),
    pendingOrders: BigInt(8),
    totalRevenue: BigInt(452000),
    pendingEnquiries: BigInt(3),
  }),

  getEnquiries: async () => [
    {
      id: BigInt(1),
      customerName: "Ramesh Kumar",
      status: EnquiryStatus.New,
      subject: "Milk subscription inquiry",
      customerPhone: "+91 9876543210",
      enquiryType: EnquiryType.ProductQuestion,
      createdAt: BigInt(Date.now()),
      message: "I would like to know about the daily milk subscription plans.",
      customerEmail: "ramesh@example.com",
    },
  ],

  getOrderById: async () => null,

  getOrders: async () => [
    {
      id: BigInt(1),
      customerName: "Priya Sharma",
      status: OrderStatus.Confirmed,
      deliveryAddress: "12, MG Road, Bangalore",
      paymentMethod: PaymentMethod.UPI,
      customerPhone: "+91 9876543211",
      createdAt: BigInt(Date.now()),
      orderType: OrderType.SubscriptionDaily,
      specialInstructions: "Please deliver before 7am",
      totalAmount: BigInt(1500),
      items: [{ productId: BigInt(1), quantity: BigInt(2), price: BigInt(750) }],
      customerEmail: "priya@example.com",
    },
  ],

  getProductById: async () => null,

  getProducts: async () => [
    {
      id: BigInt(1),
      name: "Fresh Farm Milk",
      createdAt: BigInt(Date.now()),
      description: "Pure, fresh cow milk delivered daily from Solo Dairy Farm. Rich in nutrients.",
      isActive: true,
      stock: BigInt(100),
      imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
      category: ProductCategory.Milk,
      price: BigInt(60),
    },
    {
      id: BigInt(2),
      name: "Pure Desi Ghee",
      createdAt: BigInt(Date.now()),
      description: "Handcrafted pure desi ghee made from fresh farm butter. 500g jar.",
      isActive: true,
      stock: BigInt(50),
      imageUrl: "https://images.unsplash.com/photo-1603036050141-c61fde866f5c?w=400",
      category: ProductCategory.DairyProduct,
      price: BigInt(650),
    },
    {
      id: BigInt(3),
      name: "Fresh Curd",
      createdAt: BigInt(Date.now()),
      description: "Thick and creamy homemade curd, set fresh every morning. 500g.",
      isActive: true,
      stock: BigInt(40),
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
      category: ProductCategory.DairyProduct,
      price: BigInt(80),
    },
    {
      id: BigInt(4),
      name: "White Butter",
      createdAt: BigInt(Date.now()),
      description: "Fresh farm butter made from pure cream. 250g pack.",
      isActive: true,
      stock: BigInt(30),
      imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400",
      category: ProductCategory.DairyProduct,
      price: BigInt(120),
    },
  ],

  getProductsByCategory: async (category) => {
    const allProducts = [
      {
        id: BigInt(1),
        name: "Fresh Farm Milk",
        createdAt: BigInt(Date.now()),
        description: "Pure, fresh cow milk delivered daily from Solo Dairy Farm.",
        isActive: true,
        stock: BigInt(100),
        imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
        category: ProductCategory.Milk,
        price: BigInt(60),
      },
      {
        id: BigInt(2),
        name: "Pure Desi Ghee",
        createdAt: BigInt(Date.now()),
        description: "Handcrafted pure desi ghee from fresh farm butter. 500g.",
        isActive: true,
        stock: BigInt(50),
        imageUrl: "https://images.unsplash.com/photo-1603036050141-c61fde866f5c?w=400",
        category: ProductCategory.DairyProduct,
        price: BigInt(650),
      },
    ];
    return allProducts.filter((p) => p.category === category);
  },

  getSettings: async () => ({
    deliveryPolicy: "Free delivery for orders above ₹200. Same-day delivery for orders placed before 8am.",
    whatsappGreeting: "Hello! Welcome to Solo Dairy Farm. How can we help you today?",
    whatsappNumber: "+919876543200",
    contactEmail: "info@solodairyfarm.com",
    businessPhone: "+91 98765 43200",
    hoursOfOperation: "Monday to Sunday, 6:00 AM – 8:00 PM",
  }),

  placeOrder: async (input) => ({
    id: BigInt(Date.now()),
    customerName: input.customerName,
    status: OrderStatus.Pending,
    deliveryAddress: input.deliveryAddress,
    paymentMethod: input.paymentMethod,
    customerPhone: input.customerPhone,
    createdAt: BigInt(Date.now()),
    orderType: input.orderType,
    specialInstructions: input.specialInstructions,
    totalAmount: input.totalAmount,
    items: input.items,
    customerEmail: input.customerEmail,
  }),

  setAdmin: async () => undefined,

  submitEnquiry: async (input) => ({
    id: BigInt(Date.now()),
    customerName: input.customerName,
    status: EnquiryStatus.New,
    subject: input.subject,
    customerPhone: input.customerPhone,
    enquiryType: input.enquiryType,
    createdAt: BigInt(Date.now()),
    message: input.message,
    customerEmail: input.customerEmail,
  }),

  toggleCowAvailability: async () => null,

  toggleProductActive: async () => null,

  updateCow: async () => null,

  updateEnquiryStatus: async () => null,

  updateOrderStatus: async () => null,

  updateProduct: async () => null,

  updateSettings: async (settings) => settings,
};

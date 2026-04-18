import Common "common";

module {
  public type PaymentMethod = {
    #CashOnDelivery;
    #UPI;
  };

  public type OrderType = {
    #OneTime;
    #SubscriptionDaily;
    #SubscriptionWeekly;
  };

  public type OrderStatus = {
    #Pending;
    #Confirmed;
    #Delivered;
    #Cancelled;
  };

  public type OrderItem = {
    productId : Common.ProductId;
    quantity : Nat;
    price : Nat;
  };

  public type Order = {
    id : Common.OrderId;
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    deliveryAddress : Text;
    items : [OrderItem];
    totalAmount : Nat;
    paymentMethod : PaymentMethod;
    orderType : OrderType;
    status : OrderStatus;
    specialInstructions : Text;
    createdAt : Common.Timestamp;
  };

  public type OrderInput = {
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    deliveryAddress : Text;
    items : [OrderItem];
    totalAmount : Nat;
    paymentMethod : PaymentMethod;
    orderType : OrderType;
    specialInstructions : Text;
  };
};

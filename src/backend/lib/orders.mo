import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/orders";
import Common "../types/common";

module {
  public type State = {
    orders : Map.Map<Common.OrderId, Types.Order>;
    var nextOrderId : Nat;
  };

  public func newState() : State {
    let state = {
      orders = Map.empty<Common.OrderId, Types.Order>();
      var nextOrderId = 2;
    };
    // Sample order 1
    let order1 : Types.Order = {
      id = 0;
      customerName = "Ramesh Kumar";
      customerPhone = "9876543210";
      customerEmail = "ramesh@example.com";
      deliveryAddress = "123 Main Street, Pune, Maharashtra 411001";
      items = [{ productId = 1; quantity = 2; price = 60 }];
      totalAmount = 120;
      paymentMethod = #CashOnDelivery;
      orderType = #SubscriptionDaily;
      status = #Confirmed;
      specialInstructions = "Please deliver before 7am";
      createdAt = 0;
    };
    // Sample order 2
    let order2 : Types.Order = {
      id = 1;
      customerName = "Priya Sharma";
      customerPhone = "9812345678";
      customerEmail = "priya@example.com";
      deliveryAddress = "456 Park Avenue, Mumbai, Maharashtra 400001";
      items = [
        { productId = 2; quantity = 1; price = 500 },
        { productId = 3; quantity = 2; price = 80 },
      ];
      totalAmount = 660;
      paymentMethod = #UPI;
      orderType = #OneTime;
      status = #Pending;
      specialInstructions = "";
      createdAt = 0;
    };
    state.orders.add(0, order1);
    state.orders.add(1, order2);
    state;
  };

  public func placeOrder(state : State, input : Types.OrderInput) : Types.Order {
    let id = state.nextOrderId;
    let order : Types.Order = {
      id;
      customerName = input.customerName;
      customerPhone = input.customerPhone;
      customerEmail = input.customerEmail;
      deliveryAddress = input.deliveryAddress;
      items = input.items;
      totalAmount = input.totalAmount;
      paymentMethod = input.paymentMethod;
      orderType = input.orderType;
      status = #Pending;
      specialInstructions = input.specialInstructions;
      createdAt = Time.now();
    };
    state.orders.add(id, order);
    state.nextOrderId += 1;
    order;
  };

  public func getOrders(state : State) : [Types.Order] {
    state.orders.values() |> List.fromIter<Types.Order>(_).toArray();
  };

  public func getOrdersList(state : State) : List.List<Types.Order> {
    List.fromIter<Types.Order>(state.orders.values());
  };

  public func getOrderById(state : State, id : Common.OrderId) : ?Types.Order {
    state.orders.get(id);
  };

  public func updateOrderStatus(state : State, id : Common.OrderId, status : Types.OrderStatus) : ?Types.Order {
    switch (state.orders.get(id)) {
      case null null;
      case (?existing) {
        let updated = { existing with status };
        state.orders.add(id, updated);
        ?updated;
      };
    };
  };
};

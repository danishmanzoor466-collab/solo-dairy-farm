import OrdersLib "../lib/orders";
import Types "../types/orders";
import Common "../types/common";

mixin (state : OrdersLib.State) {

  public func placeOrder(input : Types.OrderInput) : async Types.Order {
    OrdersLib.placeOrder(state, input);
  };

  public query func getOrders() : async [Types.Order] {
    OrdersLib.getOrders(state);
  };

  public query func getOrderById(id : Common.OrderId) : async ?Types.Order {
    OrdersLib.getOrderById(state, id);
  };

  public shared func updateOrderStatus(id : Common.OrderId, status : Types.OrderStatus) : async ?Types.Order {
    OrdersLib.updateOrderStatus(state, id, status);
  };

};

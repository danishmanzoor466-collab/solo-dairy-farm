import Principal "mo:core/Principal";
import Map "mo:core/Map";
import ProductLib "lib/products";
import ProductsMixin "mixins/products-api";
import CowsLib "lib/cows";
import CowsMixin "mixins/cows-api";
import CowTypes "types/cows";
import Common "types/common";
import OrdersLib "lib/orders";
import OrdersMixin "mixins/orders-api";
import EnquiriesLib "lib/enquiries";
import EnquiriesMixin "mixins/enquiries-api";
import AdminLib "lib/admin";
import AdminMixin "mixins/admin-api";

actor {
  let productState = ProductLib.init();

  let cowStore : Map.Map<Common.CowId, CowTypes.Cow> = CowsLib.initStore();
  let nextCowId = { var value : Nat = 4 };

  let ordersState = OrdersLib.newState();
  let enquiriesState = EnquiriesLib.newState();

  let adminState = AdminLib.init();

  include ProductsMixin(productState, adminState);
  include CowsMixin(cowStore, nextCowId);
  include OrdersMixin(ordersState);
  include EnquiriesMixin(enquiriesState);
  include AdminMixin(adminState, ordersState, enquiriesState);
};

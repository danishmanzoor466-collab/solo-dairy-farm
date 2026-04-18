import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Types "../types/settings";
import OrderTypes "../types/orders";
import EnquiryTypes "../types/enquiries";
import Common "../types/common";

module {
  public type State = {
    var adminPrincipal : ?Principal;
    var settings : Types.Settings;
  };

  let defaultSettings : Types.Settings = {
    businessPhone = "+91 98765 43210";
    whatsappNumber = "919876543210";
    contactEmail = "info@solodairyfarm.com";
    hoursOfOperation = "Mon-Sun 6:00 AM - 8:00 PM";
    deliveryPolicy = "Free delivery within 10km. Orders placed before 7 AM delivered same morning.";
    whatsappGreeting = "Hello! I am interested in Solo Dairy Farm products.";
  };

  public func init() : State {
    {
      var adminPrincipal = null;
      var settings = defaultSettings;
    };
  };

  public func isAdmin(state : State, caller : Principal) : Bool {
    switch (state.adminPrincipal) {
      case null false;
      case (?admin) Principal.equal(admin, caller);
    };
  };

  public func setAdmin(state : State, caller : Principal, principal : Principal) {
    switch (state.adminPrincipal) {
      case null {
        // First setup — anyone can set the initial admin
        state.adminPrincipal := ?principal;
      };
      case (?currentAdmin) {
        if (not Principal.equal(currentAdmin, caller)) {
          Runtime.trap("Unauthorized: only the current admin can change the admin principal");
        };
        state.adminPrincipal := ?principal;
      };
    };
  };

  public func getAdmin(state : State) : ?Principal {
    state.adminPrincipal;
  };

  public func getSettings(state : State) : Types.Settings {
    state.settings;
  };

  public func updateSettings(state : State, caller : Principal, settings : Types.Settings) : Types.Settings {
    if (not isAdmin(state, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    state.settings := settings;
    state.settings;
  };

  public func getDashboardStats(
    state : State,
    caller : Principal,
    orders : Map.Map<Common.OrderId, OrderTypes.Order>,
    enquiries : Map.Map<Common.EnquiryId, EnquiryTypes.Enquiry>,
  ) : Types.Stats {
    if (not isAdmin(state, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };

    var totalOrders : Nat = 0;
    var totalRevenue : Nat = 0;
    var pendingOrders : Nat = 0;
    for ((_, order) in orders.entries()) {
      totalOrders += 1;
      totalRevenue += order.totalAmount;
      if (order.status == #Pending) {
        pendingOrders += 1;
      };
    };

    var pendingEnquiries : Nat = 0;
    for ((_, enquiry) in enquiries.entries()) {
      if (enquiry.status == #New) {
        pendingEnquiries += 1;
      };
    };

    {
      totalOrders;
      totalRevenue;
      pendingOrders;
      pendingEnquiries;
    };
  };
};

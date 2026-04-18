import Principal "mo:core/Principal";
import AdminLib "../lib/admin";
import OrderLib "../lib/orders";
import EnquiryLib "../lib/enquiries";
import Types "../types/settings";

mixin (
  adminState : AdminLib.State,
  orderState : OrderLib.State,
  enquiryState : EnquiryLib.State,
) {

  public shared ({ caller }) func checkIsAdmin() : async Bool {
    AdminLib.isAdmin(adminState, caller);
  };

  public shared ({ caller }) func setAdmin(principal : Principal) : async () {
    AdminLib.setAdmin(adminState, caller, principal);
  };

  public query func getAdmin() : async ?Principal {
    AdminLib.getAdmin(adminState);
  };

  public query func getSettings() : async Types.Settings {
    AdminLib.getSettings(adminState);
  };

  public shared ({ caller }) func updateSettings(settings : Types.Settings) : async Types.Settings {
    AdminLib.updateSettings(adminState, caller, settings);
  };

  public shared ({ caller }) func getDashboardStats() : async Types.Stats {
    AdminLib.getDashboardStats(
      adminState,
      caller,
      orderState.orders,
      enquiryState.enquiries,
    );
  };

};

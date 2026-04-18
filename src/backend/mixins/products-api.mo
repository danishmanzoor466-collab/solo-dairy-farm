import Runtime "mo:core/Runtime";
import ProductLib "../lib/products";
import AdminLib "../lib/admin";
import Types "../types/products";
import Common "../types/common";

mixin (state : ProductLib.State, adminState : AdminLib.State) {

  // Public query functions

  public query func getProducts() : async [Types.Product] {
    ProductLib.getProducts(state);
  };

  public query func getProductById(id : Common.ProductId) : async ?Types.Product {
    ProductLib.getProductById(state, id);
  };

  public query func getProductsByCategory(category : Types.ProductCategory) : async [Types.Product] {
    ProductLib.getProductsByCategory(state, category);
  };

  // Admin update functions

  public shared ({ caller }) func addProduct(input : Types.ProductInput) : async Types.Product {
    if (not AdminLib.isAdmin(adminState, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    ProductLib.addProduct(state, input);
  };

  public shared ({ caller }) func updateProduct(id : Common.ProductId, input : Types.ProductInput) : async ?Types.Product {
    if (not AdminLib.isAdmin(adminState, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    ProductLib.updateProduct(state, id, input);
  };

  public shared ({ caller }) func deleteProduct(id : Common.ProductId) : async Bool {
    if (not AdminLib.isAdmin(adminState, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    ProductLib.deleteProduct(state, id);
  };

  public shared ({ caller }) func toggleProductActive(id : Common.ProductId) : async ?Types.Product {
    if (not AdminLib.isAdmin(adminState, caller)) {
      Runtime.trap("Unauthorized: admin access required");
    };
    ProductLib.toggleProductActive(state, id);
  };

};

import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Types "../types/products";
import Common "../types/common";

module {
  public type State = {
    products : Map.Map<Common.ProductId, Types.Product>;
    var nextId : Common.ProductId;
  };

  public func init() : State {
    let products = Map.empty<Common.ProductId, Types.Product>();
    let state : State = {
      products;
      var nextId = 1;
    };
    seedSampleProducts(state);
    state;
  };

  func seedSampleProducts(state : State) {
    let samples : [(Text, Text, Nat, Nat, Types.ProductCategory, Text)] = [
      ("Fresh Cow Milk", "Pure fresh cow milk delivered daily from our farm. Rich in nutrients and free from additives.", 6000, 100, #Milk, "/images/milk.jpg"),
      ("A2 Ghee", "Premium A2 ghee made from desi cow milk using traditional bilona method. Rich, aromatic, and pure.", 95000, 30, #DairyProduct, "/images/ghee.jpg"),
      ("White Butter", "Fresh homemade white butter churned daily from pure cow cream. No preservatives added.", 30000, 50, #DairyProduct, "/images/butter.jpg"),
      ("Fresh Curd", "Thick, creamy curd set fresh every morning from pure whole milk. Probiotic-rich and delicious.", 8000, 60, #DairyProduct, "/images/curd.jpg"),
      ("Paneer", "Soft, fresh paneer made from pure cow milk. High protein, great for cooking and snacking.", 40000, 40, #DairyProduct, "/images/paneer.jpg"),
    ];
    for ((name, desc, price, stock, category, imageUrl) in samples.values()) {
      let id = state.nextId;
      state.nextId := id + 1;
      let product : Types.Product = {
        id;
        name;
        description = desc;
        price;
        stock;
        category;
        imageUrl;
        isActive = true;
        createdAt = Time.now();
      };
      state.products.add(id, product);
    };
  };

  public func getProducts(state : State) : [Types.Product] {
    state.products.values() |> List.fromIter<Types.Product>(_).toArray()
  };

  public func getProductById(state : State, id : Common.ProductId) : ?Types.Product {
    state.products.get(id);
  };

  public func getProductsByCategory(state : State, category : Types.ProductCategory) : [Types.Product] {
    state.products.values()
    |> List.fromIter<Types.Product>(_)
    |> _.filter(func(p : Types.Product) : Bool { p.category == category })
    |> _.toArray()
  };

  public func addProduct(state : State, input : Types.ProductInput) : Types.Product {
    let id = state.nextId;
    state.nextId := id + 1;
    let product : Types.Product = {
      id;
      name = input.name;
      description = input.description;
      price = input.price;
      stock = input.stock;
      category = input.category;
      imageUrl = input.imageUrl;
      isActive = input.isActive;
      createdAt = Time.now();
    };
    state.products.add(id, product);
    product;
  };

  public func updateProduct(state : State, id : Common.ProductId, input : Types.ProductInput) : ?Types.Product {
    switch (state.products.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Product = {
          existing with
          name = input.name;
          description = input.description;
          price = input.price;
          stock = input.stock;
          category = input.category;
          imageUrl = input.imageUrl;
          isActive = input.isActive;
        };
        state.products.add(id, updated);
        ?updated;
      };
    };
  };

  public func deleteProduct(state : State, id : Common.ProductId) : Bool {
    switch (state.products.get(id)) {
      case null false;
      case (?_) {
        state.products.remove(id);
        true;
      };
    };
  };

  public func toggleProductActive(state : State, id : Common.ProductId) : ?Types.Product {
    switch (state.products.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Product = { existing with isActive = not existing.isActive };
        state.products.add(id, updated);
        ?updated;
      };
    };
  };
};

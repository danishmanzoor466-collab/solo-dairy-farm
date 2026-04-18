import Common "common";

module {
  public type ProductCategory = {
    #Milk;
    #DairyProduct;
    #Cow;
  };

  public type Product = {
    id : Common.ProductId;
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    category : ProductCategory;
    imageUrl : Text;
    isActive : Bool;
    createdAt : Common.Timestamp;
  };

  public type ProductInput = {
    name : Text;
    description : Text;
    price : Nat;
    stock : Nat;
    category : ProductCategory;
    imageUrl : Text;
    isActive : Bool;
  };
};

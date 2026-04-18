import Common "common";

module {
  public type Cow = {
    id : Common.CowId;
    breed : Text;
    ageMonths : Nat;
    milkCapacityLiters : Nat;
    healthStatus : Text;
    price : Nat;
    imageUrls : [Text];
    description : Text;
    isAvailable : Bool;
    createdAt : Common.Timestamp;
  };

  public type CowInput = {
    breed : Text;
    ageMonths : Nat;
    milkCapacityLiters : Nat;
    healthStatus : Text;
    price : Nat;
    imageUrls : [Text];
    description : Text;
    isAvailable : Bool;
  };
};

import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/cows";
import Common "../types/common";

module {
  public type CowStore = Map.Map<Common.CowId, Types.Cow>;

  public func initStore() : CowStore {
    let store = Map.empty<Common.CowId, Types.Cow>();
    let now = Time.now();

    let hf : Types.Cow = {
      id = 1;
      breed = "Holstein Friesian (HF)";
      ageMonths = 36;
      milkCapacityLiters = 15;
      healthStatus = "Healthy";
      price = 8000000;
      imageUrls = ["/images/cow-hf.jpg"];
      description = "High-yielding Holstein Friesian cow, 3 years old, producing 15 litres of fresh milk per day. Vaccinated and certified healthy. Ideal for commercial dairy farming.";
      isAvailable = true;
      createdAt = now;
    };

    let gir : Types.Cow = {
      id = 2;
      breed = "Gir";
      ageMonths = 48;
      milkCapacityLiters = 10;
      healthStatus = "Healthy";
      price = 9500000;
      imageUrls = ["/images/cow-gir.jpg"];
      description = "Pure Gir cow, 4 years old, known for A2 milk with high medicinal value. Produces 10 litres per day. Ideal for organic and A2 dairy businesses.";
      isAvailable = true;
      createdAt = now;
    };

    let jersey : Types.Cow = {
      id = 3;
      breed = "Jersey";
      ageMonths = 30;
      milkCapacityLiters = 12;
      healthStatus = "Healthy";
      price = 7000000;
      imageUrls = ["/images/cow-jersey.jpg"];
      description = "Jersey cow, 2.5 years old, produces rich, high-fat milk — 12 litres per day. Great for making ghee and paneer. Well-maintained and disease-free.";
      isAvailable = true;
      createdAt = now;
    };

    store.add(1, hf);
    store.add(2, gir);
    store.add(3, jersey);
    store
  };

  public func getCows(store : CowStore) : [Types.Cow] {
    let iter = store.values();
    List.fromIter<Types.Cow>(iter).toArray()
  };

  public func getCowById(store : CowStore, id : Common.CowId) : ?Types.Cow {
    store.get(id)
  };

  public func getAvailableCows(store : CowStore) : [Types.Cow] {
    let iter = store.values();
    List.fromIter<Types.Cow>(iter).filter(func(c) { c.isAvailable }).toArray()
  };

  public func addCow(store : CowStore, nextId : Nat, input : Types.CowInput) : Types.Cow {
    let cow : Types.Cow = {
      id = nextId;
      breed = input.breed;
      ageMonths = input.ageMonths;
      milkCapacityLiters = input.milkCapacityLiters;
      healthStatus = input.healthStatus;
      price = input.price;
      imageUrls = input.imageUrls;
      description = input.description;
      isAvailable = input.isAvailable;
      createdAt = Time.now();
    };
    store.add(nextId, cow);
    cow
  };

  public func updateCow(store : CowStore, id : Common.CowId, input : Types.CowInput) : ?Types.Cow {
    switch (store.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Cow = {
          existing with
          breed = input.breed;
          ageMonths = input.ageMonths;
          milkCapacityLiters = input.milkCapacityLiters;
          healthStatus = input.healthStatus;
          price = input.price;
          imageUrls = input.imageUrls;
          description = input.description;
          isAvailable = input.isAvailable;
        };
        store.add(id, updated);
        ?updated
      };
    }
  };

  public func deleteCow(store : CowStore, id : Common.CowId) : Bool {
    switch (store.get(id)) {
      case null false;
      case (?_) {
        store.remove(id);
        true
      };
    }
  };

  public func toggleCowAvailability(store : CowStore, id : Common.CowId) : ?Types.Cow {
    switch (store.get(id)) {
      case null null;
      case (?existing) {
        let updated : Types.Cow = { existing with isAvailable = not existing.isAvailable };
        store.add(id, updated);
        ?updated
      };
    }
  };
};

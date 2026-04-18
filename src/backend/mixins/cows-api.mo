import Map "mo:core/Map";
import CowsLib "../lib/cows";
import Types "../types/cows";
import Common "../types/common";

mixin (cowStore : Map.Map<Common.CowId, Types.Cow>, nextCowId : { var value : Nat }) {

  public query func getCows() : async [Types.Cow] {
    CowsLib.getCows(cowStore)
  };

  public query func getCowById(id : Common.CowId) : async ?Types.Cow {
    CowsLib.getCowById(cowStore, id)
  };

  public query func getAvailableCows() : async [Types.Cow] {
    CowsLib.getAvailableCows(cowStore)
  };

  public shared func addCow(input : Types.CowInput) : async Types.Cow {
    let id = nextCowId.value;
    nextCowId.value += 1;
    CowsLib.addCow(cowStore, id, input)
  };

  public shared func updateCow(id : Common.CowId, input : Types.CowInput) : async ?Types.Cow {
    CowsLib.updateCow(cowStore, id, input)
  };

  public shared func deleteCow(id : Common.CowId) : async Bool {
    CowsLib.deleteCow(cowStore, id)
  };

  public shared func toggleCowAvailability(id : Common.CowId) : async ?Types.Cow {
    CowsLib.toggleCowAvailability(cowStore, id)
  };

};

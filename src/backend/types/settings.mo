module {
  public type Settings = {
    businessPhone : Text;
    whatsappNumber : Text;
    contactEmail : Text;
    hoursOfOperation : Text;
    deliveryPolicy : Text;
    whatsappGreeting : Text;
  };

  public type Stats = {
    totalOrders : Nat;
    totalRevenue : Nat;
    pendingOrders : Nat;
    pendingEnquiries : Nat;
  };
};

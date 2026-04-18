import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Types "../types/enquiries";
import Common "../types/common";

module {
  public type State = {
    enquiries : Map.Map<Common.EnquiryId, Types.Enquiry>;
    var nextEnquiryId : Nat;
  };

  public func newState() : State {
    let state = {
      enquiries = Map.empty<Common.EnquiryId, Types.Enquiry>();
      var nextEnquiryId = 2;
    };
    // Sample enquiry 1
    let enq1 : Types.Enquiry = {
      id = 0;
      customerName = "Anil Patil";
      customerPhone = "9900112233";
      customerEmail = "anil@example.com";
      subject = "Daily milk subscription query";
      message = "I would like to know about your daily fresh milk subscription plans and pricing. Do you deliver to Kothrud area?";
      enquiryType = #ProductQuestion;
      status = #New;
      createdAt = 0;
    };
    // Sample enquiry 2
    let enq2 : Types.Enquiry = {
      id = 1;
      customerName = "Sunita Desai";
      customerPhone = "9823456789";
      customerEmail = "sunita@example.com";
      subject = "HF Cow availability";
      message = "I am interested in purchasing a Holstein Friesian cow. Could you please share details about available cows, their milk yield, and pricing?";
      enquiryType = #CowInquiry;
      status = #Read;
      createdAt = 0;
    };
    state.enquiries.add(0, enq1);
    state.enquiries.add(1, enq2);
    state;
  };

  public func submitEnquiry(state : State, input : Types.EnquiryInput) : Types.Enquiry {
    let id = state.nextEnquiryId;
    let enquiry : Types.Enquiry = {
      id;
      customerName = input.customerName;
      customerPhone = input.customerPhone;
      customerEmail = input.customerEmail;
      subject = input.subject;
      message = input.message;
      enquiryType = input.enquiryType;
      status = #New;
      createdAt = Time.now();
    };
    state.enquiries.add(id, enquiry);
    state.nextEnquiryId += 1;
    enquiry;
  };

  public func getEnquiries(state : State) : [Types.Enquiry] {
    state.enquiries.values() |> List.fromIter<Types.Enquiry>(_).toArray();
  };

  public func getEnquiriesList(state : State) : List.List<Types.Enquiry> {
    List.fromIter<Types.Enquiry>(state.enquiries.values());
  };

  public func updateEnquiryStatus(state : State, id : Common.EnquiryId, status : Types.EnquiryStatus) : ?Types.Enquiry {
    switch (state.enquiries.get(id)) {
      case null null;
      case (?existing) {
        let updated = { existing with status };
        state.enquiries.add(id, updated);
        ?updated;
      };
    };
  };
};

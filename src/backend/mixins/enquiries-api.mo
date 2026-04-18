import EnquiriesLib "../lib/enquiries";
import Types "../types/enquiries";
import Common "../types/common";

mixin (state : EnquiriesLib.State) {

  public func submitEnquiry(input : Types.EnquiryInput) : async Types.Enquiry {
    EnquiriesLib.submitEnquiry(state, input);
  };

  public query func getEnquiries() : async [Types.Enquiry] {
    EnquiriesLib.getEnquiries(state);
  };

  public shared func updateEnquiryStatus(id : Common.EnquiryId, status : Types.EnquiryStatus) : async ?Types.Enquiry {
    EnquiriesLib.updateEnquiryStatus(state, id, status);
  };

};

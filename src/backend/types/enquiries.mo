import Common "common";

module {
  public type EnquiryType = {
    #ProductQuestion;
    #CowInquiry;
    #General;
  };

  public type EnquiryStatus = {
    #New;
    #Read;
    #Replied;
  };

  public type Enquiry = {
    id : Common.EnquiryId;
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    subject : Text;
    message : Text;
    enquiryType : EnquiryType;
    status : EnquiryStatus;
    createdAt : Common.Timestamp;
  };

  public type EnquiryInput = {
    customerName : Text;
    customerPhone : Text;
    customerEmail : Text;
    subject : Text;
    message : Text;
    enquiryType : EnquiryType;
  };
};

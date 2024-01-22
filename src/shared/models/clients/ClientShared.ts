export interface IClientContactDetails {
    address1: string;
    address2: string;
    suburb: string;
    city: string;
    state: string;
    country: string;
    phoneNumber: string;
    cellphoneNumber: string;
    cellphoneNumberSecondary: string;
    fax: string;
    emailAddress: string;
    emailAddressSecondary: string;
}

export interface IClientTaxDetails {
    tin: string;
    tinCountryOfIssue: string;
    vatNumber: string;
    reasonForNoTIN: string;
}

export interface IClientBankingDetails {
    bankName: string;
    branch: string;
    branchNumber: string;
    accountNumber: string;
    accountHolder: string;
    accountType: string;
    accountVerificationStatus: string;
}

export interface IClientRelatedPartyDetails {
    id?: string;
    firstName?: string;
    surname?: string;
    idNumber?: string;
    relationship: string;
    riskRating?: string; //low //high //medium
}
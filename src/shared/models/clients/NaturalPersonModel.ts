import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";
import { IClientContactDetails, IClientTaxDetails, IClientBankingDetails, IClientRelatedPartyDetails } from "./ClientShared";

export const defaultNaturalPerson: INaturalPerson = {
    id: "",
    entityId: "",
    oldCPNumber: null,
    entityDisplayName: "",
    clientName: "",
    clientSurname: "",
    clientTitle: "",
    clientClassification: "",
    idType: "ID",
    idNumber: "",
    idCountry: "",
    idExpiry: "",
    dateCreated: "",
    dateDeactivated: "",
    riskRating: "",
    dateOfLastFIA: "",
    dateOfNextFIA: "",
    dateOfBirth: "",
    deceased: false,
    dateOfDeath: "",
    annualIncome: 0,
    clientStatus: "Pending",
    annualInvestmentLimit: 0,
    singleTransactionLimit: 0,
    countryNationality: "",
    restricted: false,
    reasonForRestriction: "",
    entityType: "",
    contactDetail: {
        address1: "",
        address2: "",
        suburb: "",
        city: "",
        state: "",
        country: "",
        phoneNumber: "",
        cellphoneNumber: "",
        cellphoneNumberSecondary: "",
        fax: "",
        emailAddress: "",
        emailAddressSecondary: "",
    },
    taxDetail: {
        tin: "",
        tinCountryOfIssue: "",
        vatNumber: "",
        reasonForNoTIN: ""
    },
    bankingDetail: [{
        bankName: "",
        branch: "",
        branchNumber: "",
        accountNumber: "",
        accountType: "",
        accountHolder: "",
        accountVerificationStatus: "",
    }],
    relatedParty: [{
        id: "",
        firstName: "",
        surname: "",
        idNumber: "",
        relationship: "",
        riskRating: "Low"
    }]
}

export interface INaturalPerson {
    id: string;
    entityId: string;
    entityDisplayName: string;
    oldCPNumber: string | null;
    clientName: string;
    clientSurname: string;
    clientTitle: string; //Mr/Ms/Mrs/ Dr
    clientClassification: string;
    idType: string; //ID / Passport
    idNumber: string;
    idCountry: string;
    idExpiry: string;
    dateCreated: string;
    dateDeactivated: string;
    riskRating: string; //low medium high
    dateOfLastFIA: string;
    dateOfNextFIA: string ;
    dateOfBirth: string;
    deceased: boolean;
    dateOfDeath: string
    annualIncome: number;
    clientStatus: string; //Pending / Active / Closed / Suspended
    annualInvestmentLimit: number;
    singleTransactionLimit: number;
    countryNationality: string;
    restricted: boolean;
    reasonForRestriction: string; // Reason FIC / KYC / Court order
    entityType: string;
    contactDetail: IClientContactDetails;
    taxDetail: IClientTaxDetails;
    bankingDetail: IClientBankingDetails[];
    relatedParty: IClientRelatedPartyDetails[];
}


export default class NaturalPersonModel {
    private naturalPerson: INaturalPerson;

    constructor(private store: AppStore, naturalPerson: INaturalPerson) {
        makeAutoObservable(this);
        this.naturalPerson = naturalPerson;
    }

    get asJson(): INaturalPerson {
        return toJS(this.naturalPerson);
    }
}
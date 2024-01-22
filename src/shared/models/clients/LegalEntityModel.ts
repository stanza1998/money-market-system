import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";
import { IClientContactDetails, IClientTaxDetails, IClientBankingDetails, IClientRelatedPartyDetails } from "./ClientShared";

export const defaultlegalEntity: ILegalEntity = {
    id: "",
    entityId: "",
    oldCPNumber: null,
    entityDisplayName: "",
    clientRegisteredName: "",
    legalEntityType: "",
    yearEnd: null,
    registrationDate: Date.now(),
    clientTradingName: "",
    registrationNumber: "",
    countryOfRegistration: "",
    dateCreated: Date.now(),
    dateDeactivated: null,
    listed: null,
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
        emailAddressSecondary: ""
    },
    contactPerson:{
        contactPersonName: "",
        contactPersonCellphone: "",
        contactPersonNameAlt: "",
        contactPersonCellphoneAlt: ""
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
        accountType:"",
        accountHolder: "",
        accountVerificationStatus: ""
    }],
    relatedParty: [{
        firstName: "",
        surname: "",
        idNumber: "",
        relationship: "",
        riskRating: "low"
    }]
}

export interface ILegalEntityContactPerson {
    contactPersonName: string;
    contactPersonCellphone: string;
    contactPersonNameAlt: string;
    contactPersonCellphoneAlt: string;
}

export interface ILegalEntity {
    id: string;
    entityId: string;
    entityDisplayName: string;
    oldCPNumber: string | null;
    clientRegisteredName: string;
    legalEntityType: string;
    yearEnd: number | null;
    registrationDate: number;
    clientTradingName: string;
    registrationNumber: string;
    countryOfRegistration: string;
    dateCreated: number;
    dateDeactivated: number | null;
    listed: string | null;
    contactDetail: IClientContactDetails;
    contactPerson: ILegalEntityContactPerson;
    taxDetail: IClientTaxDetails;
    bankingDetail: IClientBankingDetails[];
    relatedParty: IClientRelatedPartyDetails[];
}

export default class LegalEntityModel {
    private clientLegalEntity: ILegalEntity;

    constructor(private store: AppStore, clientLegalEntity: ILegalEntity) {
        makeAutoObservable(this);
        this.clientLegalEntity = clientLegalEntity;
    }

    get asJson(): ILegalEntity {
        return toJS(this.clientLegalEntity);
    }
}


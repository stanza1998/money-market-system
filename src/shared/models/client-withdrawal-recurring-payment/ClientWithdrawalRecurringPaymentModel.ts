import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultClientWithdrawalRecurringPayment: IClientWithdrawalRecurringPayment = {
    id: "",
    reference: "",
    description: "",
    amount: 0,
    transactionDate: Date.now(),
    entity: "",
    allocation: "",
    allocatedBy: "",
    allocationApprovedBy: "",
    allocationStatus: "unallocated",
    transactionStatus: "pending",
    bank: "",
    sourceOfFunds: "",
    reasonForNoSourceOfFunds: "",
    proofOfPayment: "",
    reasonForNoProofOfPayment: "",
    instruction: "",
    reasonForNoInstruction: "",
    isRecurring: false,
    recurringDay: null,
    valueDate: null,
    timeCretated: ""
}

export interface IClientWithdrawalRecurringPayment {
    id: string;
    amount: number;
    reference: string;
    description: string;
    transactionDate: number | null;
    valueDate: number | null;
    entity: string,
    allocation: string;
    allocatedBy: string;
    allocationApprovedBy: string;
    allocationStatus: string;
    transactionStatus: string;
    bank: string;
    sourceOfFunds: string,
    reasonForNoSourceOfFunds: string,
    proofOfPayment: string,
    reasonForNoProofOfPayment: string,
    instruction: string,
    reasonForNoInstruction: string,
    isRecurring: boolean,
    recurringDay: number | null,
    timeCretated: string;
}


export const defaultClientWithdrawalRecurringPaymentColumnVisibility = {
    clientName: true,
    allocation: true,
    balance: true,
    amount: true,
    description: true,
    reference: true,
    transactionDate: true,
    valueDate: true,
    bank: true,
    instruction: true,
    reasonForNoInstruction: true,
    isRecurring: true,
    recurringDay: true,
    sourceOfFunds: false,
    reasonForNoSourceOfFunds: false,
    proofOfPayment: false,
    reasonForNoProofOfPayment: false,
    allocatedBy: false,
    allocationApprovedBy: false,
    allocationStatus: false,
    transactionStatus: false,
    entity: false,
    id: false,
}

export const ClientWithdrawalRecurringPaymentColumnNames = {
    id: "Withdrawal ID",
    clientName: "Client Name",
    allocation: "Money Market Account",
    description: "Description",
    reference: "Reference",
    balance: "MM Balance",
    amount: "Amount",
    transactionDate: "Transaction Date",
    valueDate: "Value Date",
    allocatedBy: "Allocator",
    allocationApprovedBy: "Approver",
    allocationStatus: "Allocation Status",
    transactionStatus: "Transaction Status",
    bank: "Client Bank Acount",
    sourceOfFunds: "Source Of Funds",
    reasonForNoSourceOfFunds: "Reason For No Source of Funds",
    proofOfPayment: "POP",
    reasonForNoProofOfPayment: "Reason For no POP",
    instruction: "Instruction",
    reasonForNoInstruction: "",
    isRecurring: "Recurring",
    recurringDay: "Recurring Day",
    entity: "Entity",
}

export default class ClientWithdrawalRecurringPaymentModel {
    private ClientWithdrawalRecurringPayment: IClientWithdrawalRecurringPayment;

    constructor(private store: AppStore, ClientWithdrawalRecurringPayment: IClientWithdrawalRecurringPayment) {
        makeAutoObservable(this);
        this.ClientWithdrawalRecurringPayment = ClientWithdrawalRecurringPayment;
    }

    get uploader() {
        // return this.store.company.getById(this._companyDeduction.company);
        return null
    }

    get asJson(): IClientWithdrawalRecurringPayment {
        return toJS(this.ClientWithdrawalRecurringPayment);
    }
}
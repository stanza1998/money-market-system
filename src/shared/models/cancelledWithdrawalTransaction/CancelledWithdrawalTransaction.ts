import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultCancelledWithdrawalTransaction: ICancelledWithdrawalTransaction = {
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
    whoCreated: "",
    timeCreated: "",
    whoVerified: "",
    timeVerified: "",
    whoAuthorized: "",
    timeAuthorized: "",
    whoProcessedPayment: "",
    timeProcessPayment: "",
    executionTime: "",
    previousBalance: 0,
    batchStatus: false,
    stageCancelledFrom: "",
    cancellationComment: ""
}

export interface ICancelledWithdrawalTransaction {
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
    whoCreated: string;
    timeCreated: string;
    whoVerified: string;
    timeVerified: string;
    whoAuthorized: string;
    timeAuthorized: string;
    whoProcessedPayment: string;
    timeProcessPayment: string;
    executionTime: string;
    previousBalance: number;
    batchStatus: boolean;
    stageCancelledFrom: string;
    cancellationComment: string;
    
}


export default class CancelledWithdrawalTransactionModel {
    private cancelledWithdrawalTransaction: ICancelledWithdrawalTransaction;

    constructor(private store: AppStore, cancelledWithdrawalTransaction: ICancelledWithdrawalTransaction) {
        makeAutoObservable(this);
        this.cancelledWithdrawalTransaction = cancelledWithdrawalTransaction;
    }

    get uploader() {
        // return this.store.company.getById(this._companyDeduction.company);
        return null
    }

    get asJson(): ICancelledWithdrawalTransaction {
        return toJS(this.cancelledWithdrawalTransaction);
    }
}
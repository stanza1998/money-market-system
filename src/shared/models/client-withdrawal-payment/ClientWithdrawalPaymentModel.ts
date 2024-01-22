import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultClientWithdrawalPayment: IClientWithdrawalPayment = {
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

}

export interface IClientWithdrawalPayment {
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
    accountName?: string;
    accountNumber?:string;
    branchCode?: string;
    sourceOfFunds: string,
    reasonForNoSourceOfFunds: string,
    proofOfPayment: string,
    reasonForNoProofOfPayment: string,
    instruction: string,
    reasonForNoInstruction: string,
    isRecurring: boolean,
    recurringDay: number | null,
    whoCreated?: string;
    timeCreated?: string;
    whoVerified?: string;
    timeVerified?: string;
    whoAuthorized?: string;
    timeAuthorized?: string;
    whoProcessedPayment?: string;
    timeProcessPayment?: string;
    executionTime?: string;
    previousBalance?: number;
    batchStatus?: boolean; // use for transactions in client withdrawal payments
    batchTransactionStatus?: string; //use for transactions in the batch file
    isPaymentProcessed?: boolean;
}

export const defaultClientWithdrawalPaymentColumnVisibility = {
    clientName: true,
    allocation: true,
    balance: true,
    amount: true,
    description: true,
    reference: true,
    transactionDate: true,
    valueDate: true,
    bank: true,
    accountName: true,
    accountNumber:true,
    branchCode: true,
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
    whoCreated: false,
    timeCreated: false,
    whoVerified: false,
    timeVerified: false,
    whoAuthorized: false,
    timeAuthorized: false,
    whoProcessedPayment: false,
    timeProcessPayment: false,
    executionTime: false,
    previousBalance: false,
    batchStatus: false,
    batchTransactionStatus: false,
    isPaymentProcessed: false
}

export const ClientWithdrawalPaymentColumnNames = {
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
    bank: "Client Bank Account",
    accountName: "Account Name",
    accountNumber:"Account Number",
    branchCode: "Branch Code",
    sourceOfFunds: "Source Of Funds",
    reasonForNoSourceOfFunds: "Reason For No Source of Funds",
    proofOfPayment: "POP",
    reasonForNoProofOfPayment: "Reason For no POP",
    instruction: "Instruction",
    reasonForNoInstruction: "",
    isRecurring: "Recurring",
    recurringDay: "Recurring Day",
    entity: "Entity",
    whoCreated: "Who Created",
    timeCreated: "Time Created",
    whoVerified: "Who Verified",
    timeVerified: "Time Verified",
    whoAuthorized: "Who Authorized",
    timeAuthorized: "Time Authorized",
    whoProcessedPayment: "Who Process Payment",
    timeProcessPayment: "Time Process Payment",
    executionTime: "Execution Time",
    previousBalance: "Previous Balance",
    batchStatus: "batchStatus",
    batchTransactionStatus: "batchTransactionStatus",
    isPaymentProcessed: "isPaymentProcessed"
}

export default class ClientWithdrawalPaymentModel {
    private ClientWithdrawalPayment: IClientWithdrawalPayment;

    constructor(private store: AppStore, ClientWithdrawalPayment: IClientWithdrawalPayment) {
        makeAutoObservable(this);
        this.ClientWithdrawalPayment = ClientWithdrawalPayment;
    }

    get uploader() {
        // return this.store.company.getById(this._companyDeduction.company);
        return null
    }

    get asJson(): IClientWithdrawalPayment {
        return toJS(this.ClientWithdrawalPayment);
    }
}
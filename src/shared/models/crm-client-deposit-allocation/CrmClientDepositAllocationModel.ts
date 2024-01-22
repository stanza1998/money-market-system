import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultCrmClientDepositAllocation: ICrmClientDepositAllocation = {
    id: "",
    reference: "",
    description: "",
    amount: 0,
    transactionDate: Date.now(),
    allocation: "",
    entity: "",
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
    valueDate: null

}

export interface ICrmClientDepositAllocation {
    id: string;
    reference: string;
    description: string;
    amount: number;
    transactionDate: number | null;
    valueDate: number | null;
    allocation: string;
    entity: string;
    allocatedBy: string;
    allocationApprovedBy: string;
    allocationStatus: string;
    transactionStatus: string;
    bank: string;
    sourceOfFunds: string;
    reasonForNoSourceOfFunds: string;
    proofOfPayment: string;
    reasonForNoProofOfPayment: string;
    instruction: string;
    reasonForNoInstruction: string;
    isRecurring: boolean;
    recurringDay: number | null;
    timeAllocated?: string;
    timeVerified?: string;
    whoAllocated?: string;
    whoVerified?: string;
    executionTime?: string;
    previousBalance?: number
    importType?: string;
    statementIdentifier?:string;
}

export default class CrmClientDepositAllocationModel {
    private CrmClientDepositAllocation: ICrmClientDepositAllocation;

    constructor(private store: AppStore, CrmClientDepositAllocation: ICrmClientDepositAllocation) {
        makeAutoObservable(this);
        this.CrmClientDepositAllocation = CrmClientDepositAllocation;
    }

    get uploader() {
        // return this.store.company.getById(this._companyDeduction.company);
        return null
    }

    get asJson(): ICrmClientDepositAllocation {
        return toJS(this.CrmClientDepositAllocation);
    }
}
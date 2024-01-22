import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";
import { IClientWithdrawalPayment } from "../client-withdrawal-payment/ClientWithdrawalPaymentModel";


export const defaultBatches: IBatches = {
    id: "",
    batchNumber: "",
    batchWithdrawalTransactions: [],
    whoProcessBatched: "",
    timeProcessed: 0,
    batchType: ""
}

export interface IBatches {
    id: string;
    batchNumber: string;
    batchWithdrawalTransactions: IClientWithdrawalPayment[];
    whoProcessBatched: string;
    timeProcessed: number;
    batchType:string;
}


export default class BatchesModel {
    private batches: IBatches;

    constructor(private store: AppStore, batches: IBatches) {
        makeAutoObservable(this);
        this.batches = batches;
    }

    get asJson(): IBatches {
        return toJS(this.batches);
    }
}


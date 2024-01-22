import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultSwitchTransaction: ISwitchTransaction = {
    id: "",
    switchDate: null,
    fromAccount: "",
    toAccount: "",
    amount: 0,
    switchedBy: ""
}

export interface ISwitchTransaction {
    id: string;
    switchDate: number | null,
    fromAccount: string,
    toAccount: string,
    amount: number,
    switchedBy: string,
    executionTime?: string,
    whoSwitchedAmount?: string,
    toPBalance?: number,
    fromPBalance?: number,

}

export default class SwitchTransactionModel {
    private _switchTransaction: ISwitchTransaction;

    constructor(private store: AppStore, switchTransaction: ISwitchTransaction) {
        makeAutoObservable(this);
        this._switchTransaction = switchTransaction;
    }

    get asJson(): ISwitchTransaction {
        return toJS(this._switchTransaction);
    }
}
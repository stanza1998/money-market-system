import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultCounterParty: ICounterParty = {
    id: "",
    counterpartyName: "",
    bankName: "",
    branch: "",
    accountNumber: "",
    accountHolder: ""
}

export interface ICounterParty {
    id: string;
    counterpartyName: string;
    bankName: string;
    branch: string;
    accountNumber: string;
    accountHolder: string;
}
export default class CounterPartyModel {
    private counterParty: ICounterParty;

    constructor(private store: AppStore, counterParty: ICounterParty) {
        makeAutoObservable(this);
        this.counterParty = counterParty;
    }

    get asJson(): ICounterParty {
        return toJS(this.counterParty);
    }
}
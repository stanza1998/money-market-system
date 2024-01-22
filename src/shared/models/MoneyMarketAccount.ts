import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultMoneyMarketAccount: IMoneyMarketAccount = {
    id: "",
    parentEntity: "",
    accountNumber: "",
    accountName: "",
    accountType: "",
    baseRate: 0,
    feeRate: 0,
    cession: 0,
    balance: 0,
    runningBalance: 0,
    displayOnEntityStatement: true,
    status: "Active",
    key: 0,
    monthTotalInterest: 0,
    previousBalance: 0,
    previousInterest: 0,
    previousInterestEarned: 0
}

export interface IMoneyMarketAccount {
    id: string;
    parentEntity: string ;
    accountNumber: string;
    accountName: string;
    accountType: string;
    baseRate: number;
    feeRate: number;
    cession: number;
    balance: number;
    runningBalance: number;
    displayOnEntityStatement: boolean;
    status: string;
    key?: number;
    monthTotalInterest?: number;
    previousBalance?: number;
    previousInterest?: number;
    previousInterestEarned?: number;
}

export default class MoneyMarketAccountModel {
    private account: IMoneyMarketAccount;

    constructor(private store: AppStore, account: IMoneyMarketAccount) {
        makeAutoObservable(this);
        this.account = account;
    }

    get asJson(): IMoneyMarketAccount {
        return toJS(this.account);
    }

    get accountTypeObject() {
        return this.store.product.getItemById(this.account.accountType);
    }

    static groupByParentId(accounts: MoneyMarketAccountModel[]): Record<string, MoneyMarketAccountModel[]> {
        const groupedAccounts: Record<string, MoneyMarketAccountModel[]> = {};

        for (const account of accounts) {
            const parentId = account.account.parentEntity;

            if (parentId in groupedAccounts) {
                groupedAccounts[parentId].push(account);
            } else {
                groupedAccounts[parentId] = [account];
            }
        }

        return groupedAccounts;
    }
}
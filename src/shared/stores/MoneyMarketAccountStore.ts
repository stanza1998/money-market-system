import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction } from "mobx";
import MoneyMarketAccountModel, { IMoneyMarketAccount } from "../models/MoneyMarketAccount";

export default class MoneyMarketAccountStore extends Store<IMoneyMarketAccount, MoneyMarketAccountModel> {
    items = new Map<string, MoneyMarketAccountModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IMoneyMarketAccount[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new MoneyMarketAccountModel(this.store, item))
            );
        });
    }

    allEntityAccounts(entityId: string) {
        const list = Array.from(this.items.values());
        return list.filter((item) => item.asJson.parentEntity === entityId);
    }

    allProductAccounts(accountId: string) {
        const list = Array.from(this.items.values());
        return list.filter((item) => item.asJson.accountType === accountId);
    }
}
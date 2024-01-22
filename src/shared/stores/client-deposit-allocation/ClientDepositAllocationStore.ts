import { runInAction } from "mobx";
import Store from "../Store";
import AppStore from "../AppStore";
import ClientDepositAllocationModel, { IClientDepositAllocation } from "../../models/client-deposit-allocation/ClientDepositAllocationModel";

export default class ClientDepositAllocationStore extends Store<IClientDepositAllocation, ClientDepositAllocationModel> {
    items = new Map<string, ClientDepositAllocationModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IClientDepositAllocation[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new ClientDepositAllocationModel(this.store, item))
            );
        });
    }
}
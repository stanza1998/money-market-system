import { runInAction } from "mobx";
import Store from "../Store";
import AppStore from "../AppStore";
import CrmClientDepositAllocationModel, { ICrmClientDepositAllocation } from "../../models/crm-client-deposit-allocation/CrmClientDepositAllocationModel";

export default class CrmClientDepositAllocationStore extends Store<ICrmClientDepositAllocation, CrmClientDepositAllocationModel> {
    items = new Map<string, CrmClientDepositAllocationModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: ICrmClientDepositAllocation[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new CrmClientDepositAllocationModel(this.store, item))
            );
        });
    }
}
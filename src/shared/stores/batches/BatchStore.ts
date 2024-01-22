import { runInAction } from "mobx";
import Store from "../Store";
import AppStore from "../AppStore";
import BatchesModel, { IBatches } from "../../models/batches/BatchesModel";

export default class BatchStore extends Store<IBatches, BatchesModel> {
    items = new Map<string, BatchesModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IBatches[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new BatchesModel(this.store, item))
            );
        });
    }
}
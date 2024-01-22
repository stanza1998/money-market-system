import Store from "./Store";
import AppStore from "./AppStore";
import { runInAction, toJS } from "mobx";
import ProductModel, { IProduct } from "../models/ProductModel";


export default class ProductStore extends Store<IProduct, ProductModel> {
    items = new Map<string, ProductModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IProduct[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new ProductModel(this.store, item))
            );
        });
    }

    getByItemProductId(productCode: string) {
        const list = Array.from(toJS(this.items.values()));
        return list.find((item) => item.asJson.productCode === productCode);
    }
}
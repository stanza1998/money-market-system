import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../stores/AppStore";

export const defaultProduct: IProduct = {
    id: "",
    productCode: "",
    productName: "",
    productDescription: "",
    baseRate: 0,
    dailyFlowCutOffTime: 0,
}

export interface IProduct {
    id: string;
    productCode: string;
    productName: string;
    productDescription: string;
    baseRate: number;
    dailyFlowCutOffTime: number,
}

export interface IProductUpdate {
    id: string;
    productCode: string;
    baseRate: number;
}

export default class ProductModel {
    private product: IProduct;

    constructor(private store: AppStore, product: IProduct) {
        makeAutoObservable(this);
        this.product = product;
    }

    get asJson(): IProduct {
        return toJS(this.product);
    }
}
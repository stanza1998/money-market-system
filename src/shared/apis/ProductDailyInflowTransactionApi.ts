import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { IProductDailyInflowTransaction } from "../models/ProductiDailyInflowTransactionModel";


export default class ProductDailyInflowTransactionApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private productPath(productId: string, productDailyInFlowId: string) {
        return `products/${productId}/productDailyInFlow/${productDailyInFlowId}/productDailyInFlowTransactions`;
    }

    async getAll(productId: string, productDailyInFlowId: string) {
        this.store.productDailyInFlowTransaction.removeAll();
        const path = this.productPath(productId, productDailyInFlowId);
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const productDailyInFlowTransactions: IProductDailyInflowTransaction[] = [];
                querySnapshot.forEach((doc) => {
                    productDailyInFlowTransactions.push({ id: doc.id, ...doc.data() } as IProductDailyInflowTransaction);
                });
                this.store.productDailyInFlowTransaction.load(productDailyInFlowTransactions);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(productId: string, productDailyInFlowId: string, id: string) {
        const path = this.productPath(productId, productDailyInFlowId);
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IProductDailyInflowTransaction;
            this.store.productDailyInFlowTransaction.load([item]);
        });

        return unsubscribe;
    }

    async create(productId: string, productDailyInFlowId: string, item: IProductDailyInflowTransaction) {

        const path = this.productPath(productId, productDailyInFlowId);
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async update(productId: string, productDailyInFlowId: string, item: IProductDailyInflowTransaction) {

        const path = this.productPath(productId, productDailyInFlowId);
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.productDailyInFlowTransaction.load([item]);
        } catch (error) { }
    }

    async delete(productId: string, productDailyInFlowId:string, item: IProductDailyInflowTransaction) {
        const path = this.productPath(productId, productDailyInFlowId);
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.productDailyInFlowTransaction.remove(item.id);
        } catch (error) { }
    }
}
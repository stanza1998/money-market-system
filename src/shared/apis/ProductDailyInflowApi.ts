import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { IProductDailyInflow } from "../models/ProductiDailyInflowModel";

export default class ProductDailyInflowApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private productPath(productId: string) {
        return `products/${productId}/productDailyInflows`;
    }

    async getAll(productId: string) {
        this.store.productDailyInFlow.removeAll();
        const path = this.productPath(productId);
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const productDailyInflows: IProductDailyInflow[] = [];
                querySnapshot.forEach((doc) => {
                    productDailyInflows.push({ id: doc.id, ...doc.data() } as IProductDailyInflow);
                });
                this.store.productDailyInFlow.load(productDailyInflows);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(productId: string, id: string) {
        const path = this.productPath(productId);
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IProductDailyInflow;
            this.store.productDailyInFlow.load([item]);
        });

        return unsubscribe;
    }

    async create(productId: string, item: IProductDailyInflow) {

        const path = this.productPath(productId);
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async update(productId: string, item: IProductDailyInflow) {

        const path = this.productPath(productId);
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.productDailyInFlow.load([item]);
        } catch (error) { }
    }

    async delete(productId: string, item: IProductDailyInflow) {
        const path = this.productPath(productId);
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.productDailyInFlow.remove(item.id);
        } catch (error) { }
    }
}
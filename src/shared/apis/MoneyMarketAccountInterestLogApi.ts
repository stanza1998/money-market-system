import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { IMoneyMarketAccountInterestLog } from "../models/MoneyMarketAccountInterestLog";

export default class MoneyMarketAccountInterestLogApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private categoriesPath(accountId: string) {
        return `moneyMarketAccounts/${accountId}/interestLog`;
    }

    async getAll(accountId: string) {
        this.store.mmaInterestLog.removeAll();
        const path = this.categoriesPath(accountId);
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const mmaInterestLogs: IMoneyMarketAccountInterestLog[] = [];
                querySnapshot.forEach((doc) => {
                    mmaInterestLogs.push({ id: doc.id, ...doc.data() } as IMoneyMarketAccountInterestLog);
                });
                this.store.mmaInterestLog.load(mmaInterestLogs);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(accountId: string, id: string) {

        const path = this.categoriesPath(accountId);
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IMoneyMarketAccountInterestLog;
            this.store.mmaInterestLog.load([item]);
        });

        return unsubscribe;
    }

    async create(accountId: string, item: IMoneyMarketAccountInterestLog) {

        const path = this.categoriesPath(accountId);
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async update(accountId: string, item: IMoneyMarketAccountInterestLog) {

        const path = this.categoriesPath(accountId);
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.mmaInterestLog.load([item]);
        } catch (error) {
            console.log(error);
        }
    }

    async delete(accountId: string, item: IMoneyMarketAccountInterestLog) {
        const path = this.categoriesPath(accountId);
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.mmaInterestLog.remove(item.id);
        } catch (error) { }
    }
}
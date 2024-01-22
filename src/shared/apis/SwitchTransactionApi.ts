import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { ISwitchTransaction } from "../models/SwitchTransactionModel";

export default class SwitchTransactionApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private switchPath() {
        return "switches";
    }

    async getAll() {
        this.store.switch.removeAll();
        const path = this.switchPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const switches: ISwitchTransaction[] = [];
                querySnapshot.forEach((doc) => {
                    switches.push({ id: doc.id, ...doc.data() } as ISwitchTransaction);
                });
                this.store.switch.load(switches);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(id: string) {
        const path = this.switchPath();
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as ISwitchTransaction;
            this.store.switch.load([item]);
        });

        return unsubscribe;
    }

    async create(item: ISwitchTransaction) {

        const path = this.switchPath();
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }


    async update(item: ISwitchTransaction) {

        const path = this.switchPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.switch.load([item]);
        } catch (error) { }
    }

    async updatePreviousBalance(item: ISwitchTransaction, toPBalance: number, fromPBalance: number) {
        const path = this.switchPath();
        if (!path) return;

        try {
            const updatedItem = {
                ...item,
                 toPBalance: toPBalance,
                fromPBalance: fromPBalance
            };

            await updateDoc(doc(db, path, item.id), updatedItem);
            this.store.switch.load([updatedItem]);
        } catch (error) {
            // Handle the error as needed
            console.error("Error updating balance:", error);
        }
    }

    async delete(item: ISwitchTransaction) {
        const path = this.switchPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.switch.remove(item.id);
        } catch (error) { }
    }
}
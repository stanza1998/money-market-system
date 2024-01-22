import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { ICounterParty } from "../models/CounterPartyModel";

export default class CounterPartyApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private counterParyPath() {
        return "counterParties";
    }

    async getAll() {
        this.store.counterParty.removeAll();
        const path = this.counterParyPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const parties: ICounterParty[] = [];
                querySnapshot.forEach((doc) => {
                    parties.push({ id: doc.id, ...doc.data() } as ICounterParty);
                });
                this.store.counterParty.load(parties);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(id: string) {
        const path = this.counterParyPath();
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as ICounterParty;
            this.store.counterParty.load([item]);
        });

        return unsubscribe;
    }


    async create(item: ICounterParty) {

        const path = this.counterParyPath();
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async update(item: ICounterParty) {

        const path = this.counterParyPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.counterParty.load([item]);
        } catch (error) { }
    }

    async delete(item: ICounterParty) {
        const path = this.counterParyPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.counterParty.remove(item.id);
        } catch (error) { }
    }
}
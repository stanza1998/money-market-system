import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import AppStore from "../../stores/AppStore";
import AppApi from "../AppApi";
import { IClientDepositAllocation } from "../../models/client-deposit-allocation/ClientDepositAllocationModel";

export default class ClientDepositAllocationApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private clientDepositAllocationPath() {
        return "clientDepositAllocations";
    }

    async getAll() {
        this.store.clientDepositAllocation.removeAll();
        const path = this.clientDepositAllocationPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const clientDepositAllocation: IClientDepositAllocation[] = [];
                querySnapshot.forEach((doc) => {
                    clientDepositAllocation.push({ id: doc.id, ...doc.data() } as IClientDepositAllocation);
                });
                this.store.clientDepositAllocation.load(clientDepositAllocation);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(id: string) {
        const path = this.clientDepositAllocationPath();
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IClientDepositAllocation;
            this.store.clientDepositAllocation.load([item]);
        });

        return unsubscribe;
    }

    async create(item: IClientDepositAllocation) {
        const path = this.clientDepositAllocationPath();
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async update(item: IClientDepositAllocation) {
        const path = this.clientDepositAllocationPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.clientDepositAllocation.load([item]);
        } catch (error) {
            console.log(error);
            
         }
    }

    async updateBalanceWithdraw(item: IClientDepositAllocation,  previousBalance: number) {
        const path = this.clientDepositAllocationPath();
        if (!path) return;

        try {
            const updatedItem = { ...item, previousBalance: previousBalance };

            await updateDoc(doc(db, path, item.id), updatedItem);
            this.store.clientDepositAllocation.load([updatedItem]);
        } catch (error) {
            // Handle the error as needed
            console.error("Error updating balance:", error);
        }
    }

    async delete(item: IClientDepositAllocation) {
        const path = this.clientDepositAllocationPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.clientDepositAllocation.remove(item.id);
        } catch (error) { }
    }
}
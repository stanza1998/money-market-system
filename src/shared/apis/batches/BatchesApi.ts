import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import AppStore from "../../stores/AppStore";
import AppApi from "../AppApi";
import { IBatches } from "../../models/batches/BatchesModel";

export default class BatchesApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private batchesPath() {
        return "batches";
    }

    async getAll() {
        this.store.batches.removeAll();
        const path = this.batchesPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const batches: IBatches[] = [];
                querySnapshot.forEach((doc) => {
                    batches.push({ id: doc.id, ...doc.data() } as IBatches);
                });
                this.store.batches.load(batches);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(id: string) {
        const path = this.batchesPath();
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IBatches;
            this.store.batches.load([item]);
        });

        return unsubscribe;
    }

    async create(item: IBatches) {
        const path = this.batchesPath();
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async update(item: IBatches) {
        const path = this.batchesPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.batches.load([item]);
        } catch (error) { }
    }

    async updateBatchTransactionStatus(item: IBatches, transactionId: string, status: string) {
        const path = this.batchesPath();
        if (!path) return;

        try {
            // Find the index of the transaction with the specified ID
            const transactionIndex = item.batchWithdrawalTransactions.findIndex(transaction => transaction.id === transactionId);

            // If the transaction is found, update its status
            if (transactionIndex !== -1) {
                item.batchWithdrawalTransactions[transactionIndex].batchTransactionStatus = status;

                // Update the document in Firestore
                await updateDoc(doc(db, path, item.id), {
                    ...item,
                });

                // Reload the batches in the store
                this.store.batches.load([item]);
            }
        } catch (error) {
            // Handle error
        }
    }


    async deleteBatchTransaction(item: IBatches, transactionId: string) {
        const path = this.batchesPath();
        if (!path) return;

        try {
            // Find the index of the transaction with the specified ID
            const transactionIndex = item.batchWithdrawalTransactions.findIndex(transaction => transaction.id === transactionId);

            // If the transaction is found, remove it from the array
            if (transactionIndex !== -1) {
                item.batchWithdrawalTransactions.splice(transactionIndex, 1);

                // Update the document in Firestore
                await updateDoc(doc(db, path, item.id), {
                    ...item,
                });

                // Reload the batches in the store
                this.store.batches.load([item]);
            }
        } catch (error) {
            // Handle error
        }
    }


    async delete(item: IBatches) {
        const path = this.batchesPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.batches.remove(item.id);
        } catch (error) { }
    }
}
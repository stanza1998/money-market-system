import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc, getDocs, where } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import AppStore from "../../stores/AppStore";
import AppApi from "../AppApi";
import { IClientWithdrawalPayment } from "../../models/client-withdrawal-payment/ClientWithdrawalPaymentModel";

export default class ClientWithdrawalPaymentApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private clientWithdrawalPaymentPath() {
        return "clientWithdrawalPayments";
    }

    async getAll() {
        this.store.clientWithdrawalPayment.removeAll();
        const path = this.clientWithdrawalPaymentPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const clientWithdrawalPayment: IClientWithdrawalPayment[] = [];
                querySnapshot.forEach((doc) => {
                    clientWithdrawalPayment.push({ id: doc.id, ...doc.data() } as IClientWithdrawalPayment);
                });
                this.store.clientWithdrawalPayment.load(clientWithdrawalPayment);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(id: string) {
        const path = this.clientWithdrawalPaymentPath();
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IClientWithdrawalPayment;
            this.store.clientWithdrawalPayment.load([item]);
        });

        return unsubscribe;
    }

    async create(item: IClientWithdrawalPayment) {
        const path = this.clientWithdrawalPaymentPath();
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async update(item: IClientWithdrawalPayment) {
        const path = this.clientWithdrawalPaymentPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.clientWithdrawalPayment.load([item]);
        } catch (error) { }
    }


    async updateBatchStatus(withdrawalId: string) {
        const path = this.clientWithdrawalPaymentPath();
        if (!path) return;

        try {
            const querySnapshot = await getDocs(query(collection(db, path), where('id', '==', withdrawalId)));

            if (!querySnapshot.empty) {
                const document = querySnapshot.docs[0]; // Assuming there's only one document with the given withdrawalId
                const docRef = doc(db, path, document.id);

                await updateDoc(docRef, {
                    batchStatus: true,
                });

                console.log(`Batch status updated for withdrawalId: ${withdrawalId}`);
            } else {
                console.log(`No document found for withdrawalId: ${withdrawalId}`);
            }
        } catch (error) {
            console.error('Error updating batch status:', error);
        }
    }

    async updateBatchStatusToFalse(withdrawalId: string) {
        const path = this.clientWithdrawalPaymentPath();
        if (!path) return;

        try {
            const querySnapshot = await getDocs(query(collection(db, path), where('id', '==', withdrawalId)));

            if (!querySnapshot.empty) {
                const document = querySnapshot.docs[0]; // Assuming there's only one document with the given withdrawalId
                const docRef = doc(db, path, document.id);

                await updateDoc(docRef, {
                    batchStatus: false,
                });

                console.log(`Batch status updated for withdrawalId: ${withdrawalId}`);
            } else {
                console.log(`No document found for withdrawalId: ${withdrawalId}`);
            }
        } catch (error) {
            console.error('Error updating batch status:', error);
        }
    }


    async updateProcessStatus(withdrawalId: string) {
        const path = this.clientWithdrawalPaymentPath();
        if (!path) return;

        try {
            const querySnapshot = await getDocs(query(collection(db, path), where('id', '==', withdrawalId)));

            if (!querySnapshot.empty) {
                const document = querySnapshot.docs[0]; // Assuming there's only one document with the given withdrawalId
                const docRef = doc(db, path, document.id);

                await updateDoc(docRef, {
                    isPaymentProcessed: true,
                });

                console.log(`Batch status updated for withdrawalId: ${withdrawalId}`);
            } else {
                console.log(`No document found for withdrawalId: ${withdrawalId}`);
            }
        } catch (error) {
            console.error('Error updating batch status:', error);
        }
    }

    async updateBalanceWithdraw(item: IClientWithdrawalPayment, previousBalance: number) {
        const path = this.clientWithdrawalPaymentPath();
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

    async delete(item: IClientWithdrawalPayment) {
        const path = this.clientWithdrawalPaymentPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.clientWithdrawalPayment.remove(item.id);
        } catch (error) { }
    }
}
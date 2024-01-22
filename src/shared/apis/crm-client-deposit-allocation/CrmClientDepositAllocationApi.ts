import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import AppStore from "../../stores/AppStore";
import AppApi from "../AppApi";
import { ICrmClientDepositAllocation } from "../../models/crm-client-deposit-allocation/CrmClientDepositAllocationModel";


export default class CrmClientDepositAllocationApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private crmClientDepositAllocationPath() {
        return "crmDepositAllocations";
    }

    async getAll() {
        this.store.crmClientDepositAllocation.removeAll();
        const path = this.crmClientDepositAllocationPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const crmClientDepositAllocation: ICrmClientDepositAllocation[] = [];
                querySnapshot.forEach((doc) => {
                    crmClientDepositAllocation.push({
                      id: doc.id,
                      ...doc.data(),
                    } as ICrmClientDepositAllocation);
                });
                this.store.crmClientDepositAllocation.load(
                  crmClientDepositAllocation
                );
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(id: string) {
        const path = this.crmClientDepositAllocationPath();
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as ICrmClientDepositAllocation;
            this.store.crmClientDepositAllocation.load([item]);
        });

        return unsubscribe;
    }

    async create(item: ICrmClientDepositAllocation) {
        const path = this.crmClientDepositAllocationPath();
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async update(item: ICrmClientDepositAllocation) {
        const path = this.crmClientDepositAllocationPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.crmClientDepositAllocation.load([item]);
        } catch (error) {
            console.log(error);
            
         }
    }

    async updateBalanceWithdraw(item: ICrmClientDepositAllocation,  previousBalance: number) {
        const path = this.crmClientDepositAllocationPath();
        if (!path) return;

        try {
            const updatedItem = { ...item, previousBalance: previousBalance };

            await updateDoc(doc(db, path, item.id), updatedItem);
            this.store.crmClientDepositAllocation.load([updatedItem]);
        } catch (error) {
            // Handle the error as needed
            console.error("Error updating balance:", error);
        }
    }

    async delete(item: ICrmClientDepositAllocation) {
        const path = this.crmClientDepositAllocationPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.crmClientDepositAllocation.remove(item.id);
        } catch (error) { }
    }
}
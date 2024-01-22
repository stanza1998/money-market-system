import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc, getDoc, addDoc, runTransaction } from "firebase/firestore";
import { db } from "../config/firebase-config";
import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import { IMoneyMarketAccount } from "../models/MoneyMarketAccount";
import { IClientDepositAllocation } from "../models/client-deposit-allocation/ClientDepositAllocationModel";
import { IClientWithdrawalPayment } from "../models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { IProductUpdate } from "../models/ProductModel";
import { generateNextAccountNumber } from "../functions/MyFunctions";

export interface IMoneyAccountInterestLog {
    id: string;
    interestLogDate: string;
    fee: number;
    interest: number;
    runningBalance: number;
    accountBalance: number;
}

export default class MoneyMarketAccountApi {
    constructor(private api: AppApi, private store: AppStore) { }

    private categoriesPath() {
        return "moneyMarketAccounts";
    }

    async getAll() {
        this.store.mma.removeAll();
        const path = this.categoriesPath();
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const mma: IMoneyMarketAccount[] = [];
                querySnapshot.forEach((doc) => {
                    mma.push({ id: doc.id, ...doc.data() } as IMoneyMarketAccount);
                });
                this.store.mma.load(mma);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getById(id: string) {
        const path = this.categoriesPath();
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, id), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IMoneyMarketAccount;
            this.store.mma.load([item]);
        });

        return unsubscribe;
    }

    async create(item: IMoneyMarketAccount) {

        const path = this.categoriesPath();
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async createAuto(item: IMoneyMarketAccount) {
        const path = this.categoriesPath();
        if (!path) return;

        const trackerRef = doc(db, 'accountNumberTracker', 'id');

        try {
            await runTransaction(db, async (transaction) => {
                const trackerSnapshot = await transaction.get(trackerRef);
                let currentAccountNumber = 'A000001';

                if (trackerSnapshot.exists()) {
                    const data = trackerSnapshot.data();
                    currentAccountNumber = data.accountNumber || currentAccountNumber;
                } else {
                    await transaction.set(trackerRef, { accountNumber: currentAccountNumber });
                }

                item.accountNumber = currentAccountNumber;

                const newItemRef = await addDoc(collection(db, path), item);
                const newItemId = newItemRef.id;

                await updateDoc(newItemRef, { id: newItemId });

                const nextAccountNumber = await generateNextAccountNumber(currentAccountNumber);
                await transaction.update(trackerRef, { accountNumber: nextAccountNumber });
            });

        } catch (error) {
            console.error('Error creating account:', error);
            // Handle error as needed
            throw error;
        }
    }



    async update(item: IMoneyMarketAccount) {

        const path = this.categoriesPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.mma.load([item]);
        } catch (error) {
            console.log(error);
        }
    }

    async updateBalanceStatus(item: IMoneyMarketAccount, status: string) {
        const path = this.categoriesPath();
        if (!path) return;

        try {
            const updatedItem = { ...item, status: status };

            await updateDoc(doc(db, path, item.id), updatedItem);
            this.store.mma.load([updatedItem]);
        } catch (error) {
            // Handle the error as needed
            console.error("Error updating balance:", error);
        }
    }



    async delete(item: IMoneyMarketAccount) {
        const path = this.categoriesPath();
        if (!path) return;

        try {
            await deleteDoc(doc(db, path, item.id));
            this.store.mma.remove(item.id);
        } catch (error) { }
    }

    async updateBalance(item: IMoneyMarketAccount) {

        const path = this.categoriesPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.mma.load([item]);
        } catch (error) { }
    }

    async updateBalanceDeposit(item: IMoneyMarketAccount, newBalance: number) {
        const path = this.categoriesPath();
        if (!path) return;

        try {
            const updatedItem = { ...item, balance: newBalance };

            await updateDoc(doc(db, path, item.id), updatedItem);
            this.store.mma.load([updatedItem]);
        } catch (error) {
            // Handle the error as needed
            console.error("Error updating balance:", error);
        }
    }

    async updateBalanceWithdraw(item: IMoneyMarketAccount, newBalance: number, runningBalance: number) {
        const path = this.categoriesPath();
        if (!path) return;

        try {
            let updatedItem;

            // Check if the status is "Pending"
            if (item.status === 'Pending') {
                // If yes, update both balance and status to "Closed"
                updatedItem = { ...item, balance: newBalance, status: 'Closed' };
            } else {
                // If no, update only the balance
                updatedItem = { ...item, balance: newBalance };
            }

            await updateDoc(doc(db, path, item.id), updatedItem);
            this.store.mma.load([updatedItem]);
        } catch (error) {
            // Handle the error as needed
            console.error("Error updating balance:", error);
        }
    }

    async reverseBalanceUpdate(itemId: string, amountToAdd: number) {
        const path = this.categoriesPath();
        if (!path) return;
    
        try {
            const docRef = doc(db, path, itemId);
            const docSnapshot = await getDoc(docRef);
    
            if (docSnapshot.exists()) {
                const item = docSnapshot.data() as IMoneyMarketAccount;
                const updatedItem = { ...item, balance: item.balance + amountToAdd };
    
                await updateDoc(docRef, updatedItem);
                this.store.mma.load([updatedItem]);
            } else {
                console.error(`Document with ID ${itemId} not found.`);
            }
        } catch (error) {
            // Handle the error as needed
            console.error("Error reversing balance update:", error);
        }
    }
    


    async updateBaseRate(item: IMoneyMarketAccount) {

        const path = this.categoriesPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            this.store.mma.load([item]);
        } catch (error) { }
    }

    async updateDailyPricing(item: IProductUpdate) {

        const path = this.categoriesPath();
        if (!path) return;

        try {
            await updateDoc(doc(db, path, item.id), {
                ...item,
            });
            //this.store.mma.load([item]);
        } catch (error) { }
    }

    /** Transactions on the Money Market Account */

    // deposit
    async getAllDepositTransactions(accountId: string) {
        this.store.clientDepositAllocation.removeAll();
        const path = `moneyMarketAccounts/${accountId}/deposits`;
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const deposits: IClientDepositAllocation[] = [];
                querySnapshot.forEach((doc) => {
                    deposits.push({ id: doc.id, ...doc.data() } as IClientDepositAllocation);
                });
                this.store.clientDepositAllocation.load(deposits);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getDepositTransactionById(accountId: string, depositId: string) {
        const path = `moneyMarketAccounts/${accountId}/deposits`;
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, depositId), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IClientDepositAllocation;
            this.store.clientDepositAllocation.load([item]);
        });

        return unsubscribe;
    }

    async createDepositTransaction(accountId: string, item: IClientDepositAllocation) {
        const path = `moneyMarketAccounts/${accountId}/deposits`;
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    // withdrawal
    async getAllWithdrawalTransactions(accountId: string) {
        this.store.clientWithdrawalPayment.removeAll();
        const path = `moneyMarketAccounts/${accountId}/withdrawals`;
        if (!path) return;

        const $query = query(collection(db, path));

        return await new Promise<Unsubscribe>((resolve, reject) => {
            const unsubscribe = onSnapshot($query, (querySnapshot) => {
                const withdrawals: IClientWithdrawalPayment[] = [];
                querySnapshot.forEach((doc) => {
                    withdrawals.push({ id: doc.id, ...doc.data() } as IClientWithdrawalPayment);
                });
                this.store.clientWithdrawalPayment.load(withdrawals);
                resolve(unsubscribe);
            }, (error) => {
                reject();
            });
        });
    }

    async getWithdrawalTransactionById(accountId: string, depositId: string) {
        const path = `moneyMarketAccounts/${accountId}/withdrawals`;
        if (!path) return;

        const unsubscribe = onSnapshot(doc(db, path, depositId), (doc) => {
            if (!doc.exists) return;
            const item = { id: doc.id, ...doc.data() } as IClientWithdrawalPayment;
            this.store.clientWithdrawalPayment.load([item]);
        });

        return unsubscribe;
    }

    async createWithdrawalTransaction(accountId: string, item: IClientWithdrawalPayment) {
        const path = `moneyMarketAccounts/${accountId}/withdrawals`;
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, })
        } catch (error) {
        }
    }

    async capitaliseDailyInterest(accountId: string, item: IMoneyAccountInterestLog) {
        const path = `moneyMarketAccounts/${accountId}/interestLog`
        if (!path) return;

        const itemRef = doc(collection(db, path))
        item.id = itemRef.id;

        try {
            await setDoc(itemRef, item, { merge: true, });
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }
}
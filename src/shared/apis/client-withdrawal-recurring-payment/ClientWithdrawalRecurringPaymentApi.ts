import { query, collection, updateDoc, doc, deleteDoc, onSnapshot, Unsubscribe, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import AppStore from "../../stores/AppStore";
import AppApi from "../AppApi";
import { IClientWithdrawalRecurringPayment } from "../../models/client-withdrawal-recurring-payment/ClientWithdrawalRecurringPaymentModel";
export default class ClientWithdrawalRecurringPaymentApi {
  constructor(private api: AppApi, private store: AppStore) { }

  private clientWithdrawalPaymentPath() {
    return "clientWithdrawalRecurringPayments";
  }

  async getAll() {
    this.store.clientWithdrawalRecurringPayment.removeAll();
    const path = this.clientWithdrawalPaymentPath();
    if (!path) return;

    const $query = query(collection(db, path));

    return await new Promise<Unsubscribe>((resolve, reject) => {
      const unsubscribe = onSnapshot($query, (querySnapshot) => {
        const clientWithdrawalPayment: IClientWithdrawalRecurringPayment[] = [];
        querySnapshot.forEach((doc) => {
          clientWithdrawalPayment.push({ id: doc.id, ...doc.data() } as IClientWithdrawalRecurringPayment);
        });
        this.store.clientWithdrawalRecurringPayment.load(clientWithdrawalPayment);
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
      const item = { id: doc.id, ...doc.data() } as IClientWithdrawalRecurringPayment;
      this.store.clientWithdrawalRecurringPayment.load([item]);
    });

    return unsubscribe;
  }

  async create(item: IClientWithdrawalRecurringPayment) {
    const path = this.clientWithdrawalPaymentPath();
    if (!path) return;

    const itemRef = doc(collection(db, path))
    item.id = itemRef.id;

    try {
      await setDoc(itemRef, item, { merge: true, })
    } catch (error) {
    }
  }

  async update(item: IClientWithdrawalRecurringPayment) {
    const path = this.clientWithdrawalPaymentPath();
    if (!path) return;

    try {
      await updateDoc(doc(db, path, item.id), {
        ...item,
      });
      this.store.clientWithdrawalRecurringPayment.load([item]);
    } catch (error) { }
  }

  async updateBalanceWithdraw(item: IClientWithdrawalRecurringPayment, previousBalance: number) {
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

  async delete(item: IClientWithdrawalRecurringPayment) {
    const path = this.clientWithdrawalPaymentPath();
    if (!path) return;

    try {
      await deleteDoc(doc(db, path, item.id));
      this.store.clientWithdrawalRecurringPayment.remove(item.id);
    } catch (error) { }
  }
}         
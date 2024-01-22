import { runInAction } from "mobx";
import Store from "../Store";
import AppStore from "../AppStore";
import ClientWithdrawalRecurringPaymentModel, { IClientWithdrawalRecurringPayment } from "../../models/client-withdrawal-recurring-payment/ClientWithdrawalRecurringPaymentModel";

export default class ClientWithdrawalRecurringPaymentStore extends Store<IClientWithdrawalRecurringPayment, ClientWithdrawalRecurringPaymentModel> {
    items = new Map<string, ClientWithdrawalRecurringPaymentModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IClientWithdrawalRecurringPayment[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new ClientWithdrawalRecurringPaymentModel(this.store, item))
            );
        });
    }

    // get approvedDeposits() {
    //     const list = Array.from(this.items.values());
    //     return list.filter((item) => item.asJson. === "approved");
    // }
    // get pendingDeposits() {
    //     const list = Array.from(this.items.values());
    //     return list.filter((item) => item.asJson.instrumentStatus === "pending");
    // }
}
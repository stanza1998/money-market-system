import { runInAction } from "mobx";
import Store from "../Store";
import AppStore from "../AppStore";
import ClientWithdrawalPaymentModel, { IClientWithdrawalPayment } from "../../models/client-withdrawal-payment/ClientWithdrawalPaymentModel";

export default class ClientWithdrawalPaymentStore extends Store<IClientWithdrawalPayment, ClientWithdrawalPaymentModel> {
    items = new Map<string, ClientWithdrawalPaymentModel>();

    constructor(store: AppStore) {
        super(store);
        this.store = store;
    }

    load(items: IClientWithdrawalPayment[] = []) {
        runInAction(() => {
            items.forEach((item) =>
                this.items.set(item.id, new ClientWithdrawalPaymentModel(this.store, item))
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
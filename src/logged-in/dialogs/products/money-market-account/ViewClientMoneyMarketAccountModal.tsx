import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId, {
  hideModalFromId,
} from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import {
  IMoneyMarketAccount,
  defaultMoneyMarketAccount,
} from "../../../../shared/models/MoneyMarketAccount";
import {
  currencyFormat,
} from "../../../../shared/functions/Directives";

import Modal from "../../../../shared/components/Modal";
import SwitchBetweenAccountsModal from "./SwitchBetweenAccountsModal";
import AccoutClientTranscationsDataTable from "../../../data-tables/clients/client-account-transactions/AccoutClientTranscationsDataTable";
import ViewClientMoneyMarketAccountTabs from "./ViewClientMoneyMarketAccountTabs";
import InterestDataTable from "../../../data-tables/clients/interest/InterestDataTable";



const ViewClientMoneyMarketAccountModal = observer(() => {
  const { api, store } = useAppContext();
  const [account, setAccount] = useState<IMoneyMarketAccount>({
    ...defaultMoneyMarketAccount,
  });

  const [selectedTab, setSelectedTab] = useState("transactions-tab");

  const handleSwitchBetweenAccounts = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.SWITCH_BETWEEN_ACCOUNTS_MODAL);
  };

  const getAccountTypeName = (productTypeId: string) => {
    const product = store.product.getItemById(productTypeId);
    return product?.asJson.productName;
  };

  const onCancel = () => {
    store.mma.clearSelected();
    setAccount({ ...defaultMoneyMarketAccount });
    hideModalFromId(MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL);
  };

  useEffect(() => {
    if (store.mma.selected) {
      setAccount(store.mma.selected);
    }
  }, [store.mma.selected]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await api.client.naturalPerson.getAll();
        await api.client.legalEntity.getAll();
        await api.clientDepositAllocation.getAll();
        await api.clientWithdrawalPayment.getAll();
        await api.switch.getAll();
        await api.product.getAll();
      } catch (error) { }
    };
    loadData();
  }, [
    api.client.naturalPerson,
    api.client.legalEntity,
    api.clientDepositAllocation,
    api.clientWithdrawalPayment,
    api.switch,
    api.product,
  ]);

  return (
    <div className="view-modal custom-modal-style uk-width-2-3 uk-modal-dialog uk-modal-body uk-margin-small-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={onCancel}
      ></button>
      <h3 className="uk-modal-title text-to-break">
        Money Market Account: {account.accountNumber}
      </h3>
      <div className="dialog-content uk-position-relative uk-padding-small">
        <div className="uk-grid uk-grid-small" data-uk-grid>
          <div>
            <div className="uk-grid uk-grid-small">
              {/* <button className="btn btn-primary">Deposit</button>
              <button className="btn btn-primary">Withdraw</button> */}
              {/* <button
                className="btn btn-primary"
                onClick={handleSwitchBetweenAccounts}
              >
                Switch
              </button>
              <button className="btn btn-primary">Capitalise</button> */}
            </div>
          </div>
        </div>
        <div className="uk-grid uk-grid-small">
          <div className="uk-card ijg-card uk-card-body uk-width-1-1">
            <h4>Account Overview</h4>
            <table className="uk-table uk-table-divider">
              <thead>
                <tr>
                  <th>Account No</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Fee Rate(%)</th>
                  <th>Balance</th>
                  <th>Cession</th>
                  <th>Available Balance</th>
                  <th>Display on Statement</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{account.accountNumber}</td>
                  <td>{account.accountName}</td>
                  <td>{getAccountTypeName(account.accountType)}</td>
                  <td>{account.feeRate}%</td>
                  <td>{currencyFormat(account.balance)}</td>
                  <td>{currencyFormat(account.cession)}</td>
                  <td>{currencyFormat(account.balance - account.cession)}</td>
                  <td>{account.displayOnEntityStatement ? "Yes" : "No"}</td>
                  <td>{account.status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
          <ViewClientMoneyMarketAccountTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        </div>
        <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
          <div className="uk-card ijg-card uk-card-body">
            {
              selectedTab === "transactions-tab" && <AccoutClientTranscationsDataTable account={account} />
            }

            {
              selectedTab === "interest-tab" && <InterestDataTable account={account} />
            }

          </div>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.SWITCH_BETWEEN_ACCOUNTS_MODAL}>
        <SwitchBetweenAccountsModal clientName={account.parentEntity} />
      </Modal>
    </div>
  );
});

export default ViewClientMoneyMarketAccountModal;


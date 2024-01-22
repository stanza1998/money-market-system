import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import { IMoneyMarketAccount, defaultMoneyMarketAccount } from "../../../../shared/models/MoneyMarketAccount";
import NumberInput from "../../../shared/number-input/NumberInput";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";
import { SUCCESSACTION } from "../../../../shared/models/Snackbar";
import { numberFormat } from "../../../../shared/functions/Directives";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";

const ViewMoneyMarketAccountModal = observer(() => {

  const { api, store, ui } = useAppContext();

  const [account, setAccount] = useState<IMoneyMarketAccount>({ ...defaultMoneyMarketAccount });
  const [loading, setLoading] = useState(false);

  const clients = [...store.client.naturalPerson.all, ...store.client.legalEntity.all];

  const clientOptions = clients.map((cli) => ({
    label: cli.asJson.entityId,
    value: cli.asJson.entityId,
  }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const selected = store.mma.selected;

    if (selected) await update(account);
    else await create(account);

    setLoading(false);
    onCancel();
  };

  const update = async (account: IMoneyMarketAccount) => {
    try {
      await api.mma.update(account);
      SUCCESSACTION(ui)
    } catch (error) {
    }
  };

  const create = async (account: IMoneyMarketAccount) => {
    try {
      await api.mma.create(account);
      SUCCESSACTION(ui)
    } catch (error) { }
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
      } catch (error) { }
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity]);

  return (
    <div className="custom-modal-style uk-width-3-3 uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title text-to-break">Money Market Account</h3>
      <div className="dialog-content uk-position-relative">
        <div className="uk-grid uk-grid-small uk-child-width-1-2" data-uk-grid>
          <form className="uk-form-stacked uk-grid-small" data-uk-grid
            onSubmit={handleSubmit}>
            <div className="uk-width-1-1">
              <div className="uk-margin">
                <label className="uk-form-label label" htmlFor="parentEntity">Parent Entity</label>
                <SingleSelect
                  options={clientOptions}
                  name="parentEntity"
                  value={account.parentEntity}
                  onChange={(value: string) => setAccount({ ...account, parentEntity: value })}
                  placeholder="e.g E000002"
                  required
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="accountNumber">
                Account Number
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  id="accountNumber"
                  type="text"
                  placeholder="e.g A00001"
                  value={account.accountNumber}
                  onChange={(e) =>
                    setAccount({ ...account, accountNumber: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="accountName">
                Account Name
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  id="accountName"
                  value={account.accountName}
                  onChange={(e) =>
                    setAccount({ ...account, accountName: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-width-1-2">
              <div className="uk-margin">
                <label className="uk-form-label label" htmlFor="accountType">Account Type</label>
                <select
                  className="uk-select uk-form-small"
                  value={account.accountType}
                  id="accountType"
                  onChange={(e) => setAccount({ ...account, accountType: e.target.value })}
                  required
                >
                  <option value={""} disabled>Select...</option>
                  <option value={"Individual"}>Individual</option>
                  <option value={"Corporate"}>Corporate </option>
                  <option value={"Tax Free (Institutional)"}>Tax Free (Institutional)</option>
                </select>
              </div>
            </div>
            <div className="uk-width-1-2">
              <label className="uk-form-label" htmlFor="feeRate">
                Fee Rate
              </label>
              <div className="uk-form-controls">
                <NumberInput
                  id="feeRate"
                  className="auto-save uk-input uk-form-small"
                  placeholder="-"
                  value={account.feeRate}
                  onChange={(value) =>
                    setAccount({ ...account, feeRate: Number(value) })
                  }
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="cession">
                Cession
              </label>
              <div className="uk-form-controls">
                <NumberInput
                  id="cession"
                  className="auto-save uk-input uk-form-small"
                  placeholder="-"
                  value={account.cession}
                  onChange={(value) =>
                    setAccount({ ...account, cession: Number(value) })
                  }
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="balance">
                Balance
              </label>
              <div className="uk-form-controls">
                <NumberInput
                  id="balance"
                  className="auto-save uk-input uk-form-small"
                  placeholder="-"
                  value={account.balance}
                  onChange={(value) =>
                    setAccount({ ...account, balance: Number(value) })
                  }
                />
              </div>
            </div>
            <div className="uk-width-1-1">
              <label className="uk-form-label" htmlFor="displayOnEntityStatement">Display On Entity Statement</label>
              <div className="uk-form-controls">
                <input
                  className="uk-checkbox"
                  id="displayOnEntityStatement"
                  type="checkbox"
                  checked={account.displayOnEntityStatement}
                  onChange={(e) => setAccount({ ...account, displayOnEntityStatement: e.target.checked })}
                />
              </div>
            </div>
            <div className="uk-width-1-1 uk-text-right">
              <button className="btn btn-danger" type="button" onClick={onCancel} >
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={loading} >
                Save {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </form>
          <MoneyMarketAccountHoldingItem account={account} />
        </div>
      </div>
    </div>
  );
});

export default ViewMoneyMarketAccountModal;

interface ImmaProps {
  account: IMoneyMarketAccount;
}

const MoneyMarketAccountHoldingItem = (props: ImmaProps) => {
  const { account } = props;
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const tbPurchase = store.purchase.moneyMarket.all;


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.purchase.treasuryBill.getAllFromAcount(account.id)
        setLoading(false);
      } catch (error) { }
    };
    loadData();
  }, [account.id, api.client.naturalPerson, api.client.legalEntity, api.mma, api.purchase.treasuryBill]);

  return (
    <ErrorBoundary>
      {
        !loading &&
        <div className={`page-item uk-card uk-card-body uk-card-default uk-card-small uk-margin-small-left`}>
          <h4 className="main-title-small">Account Holdings</h4>
          <table className="uk-table uk-table-striped">
            <thead className="btn-primary">
              <tr>
                <th>Nomimal</th>
                <th>Purchase Consideration</th>
                <th>Client Consideration</th>
                <th>Client Yield</th>
                <th>Purchase Yield</th>
              </tr>
            </thead>
            <tbody>
              {tbPurchase.map(tbPurchase => (
                <tr key={tbPurchase.asJson.id}>
                  <td>{tbPurchase.asJson.newNominal}</td>
                  <td>{tbPurchase.asJson.considerationBON}</td>
                  <td> {tbPurchase.asJson.considerationClient}</td>
                  <td>{tbPurchase.asJson.clientRate}</td>
                  <td>{numberFormat(tbPurchase.asJson.tenderRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    </ErrorBoundary>
  );
};

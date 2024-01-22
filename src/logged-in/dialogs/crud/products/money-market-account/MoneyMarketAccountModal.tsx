import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../ModalName";
import {
  IMoneyMarketAccount,
  defaultMoneyMarketAccount,
} from "../../../../../shared/models/MoneyMarketAccount";
import NumberInput from "../../../../shared/number-input/NumberInput";
import SingleSelect from "../../../../../shared/components/single-select/SingleSelect";
import { SUCCESSACTION } from "../../../../../shared/models/Snackbar";
import {
  findLatestAccount,
  getMMADocId,
} from "../../../../../shared/functions/MyFunctions";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const MoneyMarketAccountModal = observer(() => {
  const { api, store, ui } = useAppContext();
  const navigate = useNavigate();

  const [account, setAccount] = useState<IMoneyMarketAccount>({
    ...defaultMoneyMarketAccount,
  });
  const [loading, setLoading] = useState(false);

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];
  const products = store.product.all;

  const getClientName = (parentEntityId: string) => {
    const client = clients.find(
      (client) => client.asJson.entityId === parentEntityId
    );
    if (client) {
      return client.asJson.entityDisplayName;
    }
    return "";
  };

  const baseRate = store.product.all.find(
    (b) => b.asJson.id === account.accountType
  )?.asJson.baseRate;

  const clientOptions = clients.map((cli) => ({
    label: cli.asJson.entityDisplayName,
    value: cli.asJson.entityId,
  }));

  const productionOptions = products.map((product) => ({
    label: product.asJson.productName,
    value: product.asJson.id,
  }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (account.feeRate === 0) {
      swal({
        icon: "error",
        title: "Oops...",
        text: "The fee rate should not be 0!",
      });
      return;
    }
    setLoading(true);

    const selected = store.mma.selected;

    account.baseRate = baseRate || 0;

    if (selected) await update(account);
    else {
      await create(account);
    }

    setLoading(false);
    onCancel();
  };

  const update = async (account: IMoneyMarketAccount) => {
    try {
      await api.mma.update(account);
      SUCCESSACTION(ui);
    } catch (error) {}
  };

  const create = async (account: IMoneyMarketAccount) => {
    try {
      await api.mma.createAuto(account);
      SUCCESSACTION(ui);
      await api.mma.getAll();
      const latestAccount = findLatestAccount(
        store.mma.all.map((a) => {
          return a.asJson;
        })
      );
      const docId = getMMADocId(latestAccount?.accountNumber, store);
      navigate(`/c/accounts/${docId}`);
    } catch (error) {}
  };

  const onCancel = () => {
    store.mma.clearSelected();
    setAccount({
      ...defaultMoneyMarketAccount,
      parentEntity: "",
      accountType: "",
      displayOnEntityStatement: false, // Update this field
    });
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
        await api.product.getAll();
        await api.mma.getAll();
      } catch (error) {}
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.product, api.mma]);

  return (
    <div className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        onClick={onCancel}
        className="uk-modal-close-default"
        type="button"
        disabled={loading}
        data-uk-close
      ></button>
      <h3 className="uk-modal-title text-to-break">Money Market Account</h3>
      <div className="dialog-content uk-position-relative">
        <form
          className="uk-form-stacked uk-grid-small"
          data-uk-grid
          onSubmit={handleSubmit}
        >
          <div className="uk-width-1-1">
            <div className="uk-margin">
              <label
                className="uk-form-label label required"
                htmlFor="parentEntity"
              >
                Parent Entity
              </label>
              {store.mma.selected && (
                <input
                  type="text"
                  className="uk-input uk-form-small"
                  value={`${account.parentEntity} - ${getClientName(
                    account.parentEntity
                  )}`}
                  disabled
                />
              )}

              {!store.mma.selected && (
                <SingleSelect
                  options={clientOptions}
                  name="parentEntity"
                  value={account.parentEntity}
                  onChange={(value: string) =>
                    setAccount({ ...account, parentEntity: value })
                  }
                  placeholder="e.g E000002"
                  required
                />
              )}
            </div>
          </div>
          {/* <div className="uk-width-1-1">
            <label className="uk-form-label required" htmlFor="accountNumber">
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
                disabled={store.mma.selected ? true : false}
              />
            </div>
          </div> */}
          <div className="uk-width-1-1">
            <label className="uk-form-label required" htmlFor="accountName">
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
              <label className="uk-form-label required" htmlFor="accountType">
                Account Type
              </label>
              <SingleSelect
                options={productionOptions}
                name="product-type"
                value={account.accountType}
                onChange={(value: string) =>
                  setAccount({ ...account, accountType: value })
                }
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="uk-width-1-2">
            <label className="uk-form-label required" htmlFor="feeRate">
              Rate (%)
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
            <label className="uk-form-label" htmlFor="displayOnEntityStatement">
              Display On Entity Statement
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-checkbox"
                id="displayOnEntityStatement"
                type="checkbox"
                checked={account.displayOnEntityStatement}
                onChange={(e) =>
                  setAccount({
                    ...account,
                    displayOnEntityStatement: e.target.checked,
                  })
                }
              />
            </div>
          </div>
          <div className="uk-width-1-1 uk-text-right">
            <button className="btn btn-danger" type="button" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
            {/* <button
              onClick={() => setAccount({ ...account, parentEntity: "" })}
            >
              Clear Parent Entity
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
});

export default MoneyMarketAccountModal;

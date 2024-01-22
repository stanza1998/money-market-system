import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import {
  hideModalFromId,
} from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import MoneyMarketAccountModel, {
  IMoneyMarketAccount,
  defaultMoneyMarketAccount,
} from "../../../../shared/models/MoneyMarketAccount";

import ProductMoneyMarketAccounts from "../../../data-tables/products/all-product-money-market-accounts/ProductMoneyMarketAccounts";

interface IProps{
  accounts: MoneyMarketAccountModel[];
}

const AllProductMoneyMarketAccountsModal = observer((props: IProps) => {

  const { api, store } = useAppContext();
  const {accounts} = props;

  const [account, setAccount] = useState<IMoneyMarketAccount>({
    ...defaultMoneyMarketAccount,
  });

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
        await api.product.getAll();
      } catch (error) { }
    };
    loadData();
  }, [
    api.product,
  ]);

  return (
    <div className="view-modal custom-modal-style uk-width-1-1 uk-modal-dialog uk-modal-body uk-margin-small-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
        onClick={onCancel}
      ></button>
      <h3 className="uk-modal-title text-to-break">
        Money Market Account: {account.accountNumber}
      </h3>
      <div className="dialog-content uk-position-relative">
        <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
            <ProductMoneyMarketAccounts accounts={accounts} />
        </div>
      </div>
    </div>
  );
});

export default AllProductMoneyMarketAccountsModal;


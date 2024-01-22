import { observer } from "mobx-react-lite";

import MoneyMarketAccountDataTable from "../../../data-tables/products/all-money-market-accounts/MoneyMarketAccounts";
import Toolbar from "../../../shared/toolbar/Toolbar";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import showModalFromId from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../dialogs/ModalName";
import { useAppContext } from "../../../../shared/functions/Context";

const MoneyMarketAccounts = observer(() => {
  const handleNewAccount = () => {
    showModalFromId(MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL);
  };

  const importAccounts = () => {
    showModalFromId(MODAL_NAMES.DATA_MIGRATION.IMPORT_CLIENT_ACCOUNTS_MODAL);
  };
  const importTransaction = () => {
    showModalFromId(MODAL_NAMES.DATA_MIGRATION.IMPORT_TRANSACTION_MODAL);
  };

  const { store } = useAppContext();
  const user = store.auth.meJson;
  const hasMoneyMarketAccountManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Money Market Account Management" &&
      feature.create === true
  );
  return (
    <div className="page uk-section uk-section-small">
      <div className="uk-container uk-container-expand">
        <div className="sticky-top">
          <Toolbar
            title="Money Market Accounts"
            rightControls={
              <div className="">
                {hasMoneyMarketAccountManagementPermission && (
                  <>
                    {" "}
                    <button
                      className="btn btn-primary"
                      onClick={handleNewAccount}
                    >
                      <FontAwesomeIcon
                        className="uk-margin-small-right"
                        icon={faPlusCircle}
                      />{" "}
                      Accounts
                    </button>
                    <button
                      className="btn btn-text"
                      onClick={importAccounts}
                      type="button"
                    >
                      <span data-uk-icon="icon: user-plus-circle; ratio:.8"></span>{" "}
                      Import from Tasman
                    </button>
                    <button
                      className="btn btn-text"
                      onClick={importTransaction}
                      type="button"
                    >
                      <span data-uk-icon="icon: user-plus-circle; ratio:.8"></span>{" "}
                      Import Transactions
                    </button>
                  </>
                )}
              </div>
            }
          />
          <hr />
        </div>

        <div className="page-main-card uk-card uk-card-default uk-card-body">
          <MoneyMarketAccountDataTable />
        </div>
      </div>
    </div>
  );
});

export default MoneyMarketAccounts;

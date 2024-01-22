import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { MoneyMarketGrid } from "./DataTable";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../../shared/components/loading/Loading";
import MODAL_NAMES from "../../../dialogs/ModalName";
import Modal from "../../../../shared/components/Modal";
import MoneyMarketAccountModal from "../../../dialogs/crud/products/money-market-account/MoneyMarketAccountModal";

import ViewClientMoneyMarketAccountModal from "../../../dialogs/products/money-market-account/ViewClientMoneyMarketAccountModal";
import AccountImportModal from "../../../dialogs/crud/products/money-market-account/import-client-accounts/AccountImportModal";
import TransactionImportForm from "../../../dialogs/client-account-transactions/import-natural-person/TransactionImportForm";
import TransactionsImportModal from "../../../dialogs/client-account-transactions/import-natural-person/TransactionsImportModal";

const MoneyMarketAccounts = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const moneyMarketAccounts = store.mma.all.map((mma) => mma.asJson);

  const sortedMoneyMarketAccounts = moneyMarketAccounts.sort((a, b) => {
    const accountNumberA = parseInt(a.accountNumber.slice(1), 10);
    const accountNumberB = parseInt(b.accountNumber.slice(1), 10);

    return accountNumberA - accountNumberB;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        // Use Promise.all to fetch data concurrently
        await Promise.all([
          api.client.legalEntity.getAll(),
          api.client.naturalPerson.getAll(),
          api.mma.getAll(),
          api.product.getAll(),
        ]);

        // Data has been loaded successfully
        // Perform any additional actions after data loading
      } catch (error) {
        // Handle errors if needed
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.product, api.mma]);

  return (
    <ErrorBoundary>
      {loading ? (
        <LoadingEllipsis />
      ) : (
        <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
          <MoneyMarketGrid data={sortedMoneyMarketAccounts} />
        </div>
      )}
      <Modal modalId={MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL}>
        <MoneyMarketAccountModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.ADMIN.VIEW_MONEY_MARKET_ACCOUNT_MODAL}>
        <ViewClientMoneyMarketAccountModal />
      </Modal>

      <Modal modalId={MODAL_NAMES.DATA_MIGRATION.IMPORT_CLIENT_ACCOUNTS_MODAL}>
        <AccountImportModal />
      </Modal>

      <Modal modalId={MODAL_NAMES.DATA_MIGRATION.IMPORT_TRANSACTION_MODAL}>
        <TransactionsImportModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default MoneyMarketAccounts;

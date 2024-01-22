// react
import { useState, useEffect } from 'react';

// state management
import { observer } from 'mobx-react-lite';

// custom hooks
import { useAppContext } from '../../../../shared/functions/Context';

// DataTable components
import { DataTable } from './DataTable';
import { Column } from '../../../../shared/components/react-ts-datatable/DataTableTypes';

import ErrorBoundary from '../../../../shared/components/error-boundary/ErrorBoundary';

import { useExcelLikeFilters } from '../../../../shared/functions/AdvancedFilter';
import Toolbar from '../../../shared/toolbar/Toolbar';
import showModalFromId from '../../../../shared/functions/ModalShow';
import MODAL_NAMES from '../../../dialogs/ModalName';
import { currencyFormat } from '../../../../shared/functions/Directives';
import { IMoneyMarketAccount } from '../../../../shared/models/MoneyMarketAccount';

import { dateFormat_YY_MM_DD_NEW, dateFormat_YY_MM_DD } from '../../../../shared/utils/utils';
import { LoadingEllipsis } from '../../../../shared/components/loading/Loading';

const columns: Column[] = [
  { id: "transactionDate", displayText: "Transaction Date" },
  { id: "valueDate", displayText: "Value Date" },
  { id: "transaction", displayText: "Transaction" },
  { id: "amount", displayText: "Transaction Amount"},
  { id: "runningBalance", displayText: "Running Balance"},

];

interface Transaction {
  valueDate: string;
  transactionDate: string
  transaction: string;
  amount: string;
  runningBalance: string;
}

interface IProps {
  account: IMoneyMarketAccount
}

const AccountClientTransactionsDataTable = observer((props: IProps) => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { account } = props

  const { filters, handleClearFilters } = useExcelLikeFilters();

  const combinedData: Transaction[] = [];
  const deposits = store.clientDepositAllocation.all;
  const withdrawals = store.clientWithdrawalPayment.all;
  const switchTransactions = store.switch.all;

  const accountDeposits = deposits
    .filter(
      (transaction) => transaction.asJson.allocation === account.accountNumber && transaction.asJson.transactionStatus === "verified"
    )
    .map((transaction) => transaction.asJson);

  const accountWithdrawals = withdrawals
    .filter(
      (transaction) => transaction.asJson.allocation === account.accountNumber && transaction.asJson.transactionStatus === "verified"
    )
    .map((transaction) => transaction.asJson);

  const accountSwitchesFrom = switchTransactions
    .filter(
      (transaction) => transaction.asJson.fromAccount === account.accountNumber
    )
    .map((transaction) => transaction.asJson);

  const accountSwitchesTo = switchTransactions
    .filter(
      (transaction) => transaction.asJson.toAccount === account.accountNumber
    )
    .map((transaction) => transaction.asJson);

  accountDeposits.forEach((transaction) => {
    combinedData.push({
      valueDate: dateFormat_YY_MM_DD_NEW(transaction.transactionDate),
      transactionDate: dateFormat_YY_MM_DD_NEW(transaction.transactionDate ),
      transaction: transaction.description,
      amount: currencyFormat(transaction.amount) || "",
      runningBalance: currencyFormat(transaction.amount) || ""
    });
  });

  accountWithdrawals.forEach((transaction) => {
    combinedData.push({
      valueDate: dateFormat_YY_MM_DD_NEW(transaction.transactionDate),
      transactionDate: dateFormat_YY_MM_DD_NEW(transaction.transactionDate),
      transaction: transaction.description,
      amount: currencyFormat(transaction.amount) || "",
      runningBalance: currencyFormat(transaction.amount) || ""
    });
  });

  accountSwitchesFrom.forEach((transaction) => {
    combinedData.push({
      valueDate: dateFormat_YY_MM_DD(transaction.switchDate) || "",
      transactionDate: dateFormat_YY_MM_DD(transaction.switchDate) || "",
      transaction: `Switch From (${transaction.fromAccount})`,
      amount: currencyFormat(transaction.amount) || "",
      runningBalance: currencyFormat(transaction.amount) || ""
    });
  });

  accountSwitchesTo.forEach((transaction) => {
    combinedData.push({
      valueDate: dateFormat_YY_MM_DD(transaction.switchDate) || "",
      transactionDate: dateFormat_YY_MM_DD(transaction.switchDate) || "",
      transaction: `Switch To (${transaction.toAccount})`,
      amount: currencyFormat(transaction.amount),
      runningBalance: currencyFormat(transaction.amount)
    });
  });


  const naturalPersonEntitiesFiltered = combinedData.filter((naturalPersonEntity) => {
    let filtered = true;
    if (filters.stringValueA && !naturalPersonEntity.transaction.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  const newEntity = () => {
    showModalFromId(MODAL_NAMES.ADMIN.ENTITY_TYPE_MODAL);
  };


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.client.legalEntity.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.client.legalEntity]);

  if (loading) return (
    <LoadingEllipsis />
  )

  return (
    <ErrorBoundary>
      {/** Toolbar starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        <Toolbar
          rightControls={
            <>
            </>
          }
          leftControls={
            <div>
              <h4 className="main-title-small">Account Transactions</h4>
              <button className="btn btn-primary" onClick={newEntity} type="button" disabled>
                <span data-uk-icon="icon: user-plus-circle; ratio:.8"></span>{" "}
                Export Statement
              </button>
            </div>
          }
        />
      </div>
      {/** Toolbar ends here */}
      {/** DataTable starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        {
          naturalPersonEntitiesFiltered &&
          <DataTable columns={columns} data={naturalPersonEntitiesFiltered} />
        }
      </div>
      {/** DataTable ends here */}
    </ErrorBoundary>
  );

});

export default AccountClientTransactionsDataTable;
// react
import { useState, useEffect } from "react";

// state management
import { observer } from "mobx-react-lite";

// custom hooks
import { useAppContext } from "../../../../shared/functions/Context";

// DataTable components
import { DataTable } from "./DataTable";
import { Column } from "../../../../shared/components/react-ts-datatable/DataTableTypes";

import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";

import { LoadingEllipsis } from "../../../../shared/components/loading/Loading";
import { useExcelLikeFilters } from "../../../../shared/functions/AdvancedFilter";
import Toolbar from "../../../shared/toolbar/Toolbar";
import { IMoneyMarketAccount } from "../../../../shared/models/MoneyMarketAccount";
import { InterestDataGrid } from "./interest-grid/DailyInterestGrid";
import { numberFormat } from "../../../../shared/functions/Directives";

export interface IMoneyMarketAccountInterestLog {
  interestLogDate: number;
  interest: string;
  fee: number;
  runningBalance: string;
  accountBalance: string;
}

interface IProps {
  account: IMoneyMarketAccount;
}

const InterestDataTable = observer((props: IProps) => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const { account } = props;

  const { filters, handleClearFilters } = useExcelLikeFilters();

  const accountInterestLog = store.mmaInterestLog.all;

  const accountInterestLogFiltered = accountInterestLog.filter((account) => {
    let filtered = true;
    //if (filters.stringValueA && !naturalPersonEntity.transaction.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  const dailyInterest: IMoneyMarketAccountInterestLog[] =
    accountInterestLog.map((log) => ({
      key: log.asJson.id,
      interestLogDate: log.asJson.interestLogDate,
      fee: log.asJson.fee,
      interest: log.asJson.interest.toFixed(2),
      runningBalance: log.asJson.runningBalance.toFixed(2),
      accountBalance: numberFormat(log.asJson.accountBalance),
    }));

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.mmaInterestLog.getAll(account.id);
        setLoading(false);
      } catch (error) { }
    };
    loadData();
  }, [account.id, api.mmaInterestLog]);

  if (loading) return <LoadingEllipsis />;

  return (
    <ErrorBoundary>
      {/** Toolbar starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        <InterestDataGrid data={dailyInterest} />
      </div>
    </ErrorBoundary>
  );
});

export default InterestDataTable;

import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Loading from "./shared/components/loading/Loading";
import SnackbarManager from "./shared/components/snackbar/SnackbarManager";
import { AppContext, useAppContext } from "./shared/functions/Context";
import PrivateRoute from "./shared/functions/PrivateRoute";
import { MainApp } from "./shared/models/App";
import { observer } from "mobx-react-lite";

import LoggedOut from "./logged-out/LoggedOut";

import Instruments from "./logged-in/system-modules/products/instruments/Instruments";

import AdminSettings from "./logged-in/system-modules/settings/AdminSettings";

import Clients from "./logged-in/system-modules/clients/entities/Clients";
import TreasuryBills from "./logged-in/data-tables/products/all-instruments/treasury-bills/TreasuryBills";
import Bonds from "./logged-in/data-tables/products/all-instruments/bonds/Bonds";
import FixedDeposits from "./logged-in/data-tables/products/all-instruments/fixed-deposits/FixedDeposits";
import Equities from "./logged-in/data-tables/products/all-instruments/equities/Equities";
import UnitTrusts from "./logged-in/data-tables/products/all-instruments/unit-trusts/UnitTrusts";
import ClientDepositAllocation from "./logged-in/system-modules/products/money-market-transactions/client-deposit-allocation/ClientDepositAllocation";
import TransactionProcessing from "./logged-in/system-modules/instrument-transactions/processing/TransactionProcessing";

import ClientWithdrawalPayment from "./logged-in/system-modules/products/money-market-transactions/client-withdrawal-payment/ClientWithdrawalPayment";
import SwitchBetweenAccounts from "./logged-in/system-modules/products/money-market-transactions/switch-between-accounts/SwitchBetweenAccounts";
import ViewClient from "./logged-in/dialogs/client-views/natural-person-entity/ViewClient";
import DocFox from "./logged-in/DocFox";

import TreasuryBillPurchase from "./logged-in/system-modules/instrument-transactions/purchase/treasury-bills/TreasuryBillPurchase";

import CounterPartyList from "./logged-in/system-modules/counter-party/CounterPartyList";

import TreasuryBillPurchaseProcessingSheet from "./logged-in/system-modules/instrument-transactions/processing/TreasuryBillPurchaseProcessingSheet";

import TreasuryBillPurchasePage from "./logged-in/system-modules/instrument-transactions/purchase/treasury-bills/TreasuryBillPurchasePage";

import TreasuBillPurchaseSubmitted from "./logged-in/system-modules/instrument-transactions/purchase/treasury-bills/TreasuBillPurchaseSubmitted";

import { InstrumentPurchaseCategory } from "./logged-in/system-modules/instrument-transactions/purchase/InstrumentPurchaseCategory";

import ClientWithdrawalAllocation from "./logged-in/system-modules/products/money-market-transactions/client-withdrawal-payment/allocation-process/ClientWithdrawalAllocation";

import AssetManagerFlows from "./logged-in/system-modules/products/money-market-transactions/asset-manager-flows/AssetManagerFlows";

import DailyPricing from "./logged-in/system-modules/products/daily-pricing/DailyPricing";

import Products from "./logged-in/system-modules/products/Products";

import MoneyMarketAccounts from "./logged-in/system-modules/products/money-market-account/MoneyMarketAccounts";

import BankRecon from "./logged-in/system-modules/products/money-market-transactions/bank-rocons/BankRecons";

import ClientPayments from "./logged-in/system-modules/products/money-market-transactions/client-withdrawal-payment copy/ClientPayments";

import ViewClientMoneyMarketAccount from "./logged-in/system-modules/products/money-market-account/view-client-money-market-account/ViewClientMoneyMarketAccount";

import useNetwork from "./shared/hooks/useNetwork";
import { USER_ROLES } from "./shared/functions/CONSTANTS";
import Client from "./crm/modules/dashboard/CrmDashboard";

import Crm from "./crm/Crm";
import Dashboard from "./logged-in/system-modules/dashboard/Dashboard";
import CrmDashboard from "./crm/modules/dashboard/CrmDashboard";
import Deposit from "./crm/modules/deposit/Deposit";
import Withdraw from "./crm/modules/withdrawal/Withdraw";
import { TransactionsOverview } from "./logged-in/system-modules/products/money-market-transactions/transactions-overview/TransactionsOverview";
import { ClientRecurringWithdrawalPayment } from "./logged-in/system-modules/products/money-market-transactions/client-withdrawal-payment/RecurringWithdrawals";
import { ClientOverview } from "./logged-in/system-modules/clients/entities/ClientOverview";
import BondPurchasePage from "./logged-in/system-modules/instrument-transactions/purchase/bonds/BondPurchasePage";
import FixedDepositPurchasePage from "./logged-in/system-modules/instrument-transactions/purchase/fixed-deposit/FixedDepositPurchasePage";
import EquityPurchasePage from "./logged-in/system-modules/instrument-transactions/purchase/equity/EquityPurchasePage";
import CallDepositPurchasePage from "./logged-in/system-modules/instrument-transactions/purchase/call-deposit/CallDepositPurchasePage";
import UnitTrustPurchasePage from "./logged-in/system-modules/instrument-transactions/purchase/unit-trust/UnitTrustPurchasePage";
import BondPurchase from "./logged-in/system-modules/instrument-transactions/purchase/bonds/BondPurchase";
import ViewLegalClient from "./logged-in/dialogs/client-views/legal-person-entity/ViewClient";
import TestAccrualFunction from "./logged-out/TestAccrualFunction";
import DailyTransactionReport from "./logged-in/system-modules/reports/transactions/DailyTransactionReport";
import TestFile from "./logged-out/TestFile";
import ScrollToTop from "./shared/components/NavScrollTop/NavScrollTop";
import { DepositNotices } from "./logged-in/system-modules/products/money-market-transactions/deposit-notices/DepositNotices";

// import DynamicTable from "./logged-out/DynamicTable";

const LoggedIn = lazy(() => import("./logged-in/LoggedIn"));

const PrivateLoggedIn = () => (
  <PrivateRoute>
    <Suspense fallback={<Loading fullHeight={true} />}>
      <LoggedIn />
    </Suspense>
  </PrivateRoute>
);
const ROUTES = () => {
  // ! Check all the routes and remove the ones that are no longer in use
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="c" element={<PrivateLoggedIn />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="docfox" element={<DocFox />} />

          <Route path="products" element={<Products />} />
          <Route path="pricing" element={<DailyPricing />} />

          <Route path="instruments" element={<Instruments />} />
          <Route
            path="daily-transaction-report"
            element={<DailyTransactionReport accounts={[]} />}
          />
          <Route path="instruments/tbill" element={<TreasuryBills />} />
          <Route path="instruments/bond" element={<Bonds />} />
          <Route path="instruments/fd" element={<FixedDeposits />} />
          <Route path="instruments/equities" element={<Equities />} />
          <Route path="instruments/ut" element={<UnitTrusts />} />
          <Route path="instruments/cd" element={<UnitTrusts />} />
          <Route path="bank-recon" element={<BankRecon />} />
          <Route
            path="transactions-overview"
            element={<TransactionsOverview />}
          />
          <Route
            path="client-deposit-allocation"
            element={<ClientDepositAllocation />}
          />
          <Route path="client-deposit-notices" element={<DepositNotices />} />
          <Route
            path="client-withdrawal-payment"
            element={<ClientWithdrawalPayment />}
          />
          <Route
            path="client-withdrawal-recurring-payment"
            element={<ClientRecurringWithdrawalPayment />}
          />
          <Route path="client-payment" element={<ClientPayments />} />
          <Route
            path="transactions/withdrawals/batch-file"
            element={<ClientWithdrawalAllocation />}
          />
          <Route path="switch" element={<SwitchBetweenAccounts />} />

          {/* <Route path="purchases" element={<Purchases />} /> */}
          <Route path="purchases" element={<InstrumentPurchaseCategory />} />
          <Route
            path="purchase/instrument/Treasury Bill"
            element={<TreasuryBillPurchasePage />}
          />

          <Route
            path="purchase/instrument/Equity"
            element={<EquityPurchasePage />}
          />
          <Route
            path="purchase/instrument/Bonds"
            element={<BondPurchasePage />}
          />

          <Route
            path="purchase/instrument/Fixed Deposit"
            element={<FixedDepositPurchasePage />}
          />
          <Route
            path="purchase/instrument/Unit Trust"
            element={<UnitTrustPurchasePage />}
          />
          <Route
            path="purchase/instrument/Call Deposit"
            element={<CallDepositPurchasePage />}
          />

          <Route
            path="purchases/allocation-treasury-bill/:purchaseId"
            element={<TreasuryBillPurchase />}
          />

          <Route
            path="purchases/allocation-fixed-deposit/:purchaseId"
            element={<TreasuryBillPurchase />}
          />
          <Route
            path="purchases/allocation-bonds/:purchaseId"
            element={<BondPurchase />}
          />

          <Route
            path="purchases/submitted/:purchaseId"
            element={<TreasuBillPurchaseSubmitted />}
          />
          <Route
            path="purchases/processing/:purchaseId"
            element={<TreasuryBillPurchaseProcessingSheet />}
          />

          {/** Back Office Routes */}
          <Route
            path="transaction-processing"
            element={<TransactionProcessing />}
          />
          <Route path="asset-manager-flows" element={<AssetManagerFlows />} />

          <Route path="counterparty" element={<CounterPartyList />} />

          <Route path="client-intelligence" element={<ClientOverview />} />
          <Route path="clients" element={<Clients />} />
          <Route
            path="clients/natural-person/:entityId"
            element={<ViewClient />}
          />
          <Route
            path="clients/legal-entity/:entityId"
            element={<ViewLegalClient />}
          />

          <Route path="accounts" element={<MoneyMarketAccounts />} />
          <Route
            path="accounts/:accountId"
            element={<ViewClientMoneyMarketAccount />}
          />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/c" />} />
        </Route>
        <Route path="/" element={<LoggedOut />} />
        <Route path="/test" element={<TestFile />} />
        <Route path="/command" element={<TestAccrualFunction />} />
        {/* <Route path="/docfox-test" element={<TestDocFoxApi />} /> */}
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

const CLIENT_ROUTES = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/l" element={<Crm />}>
          {/* Make "/l" route default to "/l/dashboard" */}
          <Route index element={<CrmDashboard />} />
          <Route path="dashboard" element={<CrmDashboard />} />
          <Route path="deposit" element={<Deposit />} />
          <Route path="withdraw" element={<Withdraw />} />
        </Route>
        <Route path="/*" element={<Navigate to="l" />} />
      </Routes>
    </BrowserRouter>
  );
};

const MainRoutes = observer(() => {
  const { store } = useAppContext();
  const role = store.auth.role;

  useNetwork();

  const DEV_MODE =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";

  switch (role) {
    case USER_ROLES.CLIENT_USER:
      return <CLIENT_ROUTES />;

    default:
      return <ROUTES />;
  }
});

const App = observer(() => {
  const app = new MainApp();
  const { store, api, ui } = app;

  return (
    <div className="app">
      <AppContext.Provider value={{ store, api, ui }}>
        <MainRoutes />
        <SnackbarManager />
      </AppContext.Provider>
    </div>
  );
});
export default App;

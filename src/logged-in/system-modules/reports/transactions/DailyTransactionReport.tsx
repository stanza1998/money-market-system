import { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import Toolbar from "../../../shared/toolbar/Toolbar";
import { observer } from "mobx-react-lite";
import { dateFormat_YY_MM_DD } from "../../../../shared/utils/utils";
import { DepositsGrid } from "./daily-report-grids/DepositsGrid";
import { WithdrawalsGrid } from "./daily-report-grids/WithdrawalsGrid";
import { SwitchesGrid } from "./daily-report-grids/SwitchesGrid";
import { Column } from "../../../../shared/components/react-ts-datatable/DataTableTypes";
import MoneyMarketAccountModel, { IMoneyMarketAccount } from "../../../../shared/models/MoneyMarketAccount";
import { useExcelLikeFilters } from "../../../../shared/functions/AdvancedFilter";
import { currencyFormat } from "../../../../shared/functions/Directives";
import { LoadingEllipsis } from "../../../../shared/components/loading/Loading";


const columns: Column[] = [
    { id: 'accountNumber', displayText: 'Account Number' },
    // { id: 'accountName', displayText: 'Account Name' },
    { id: 'parentEntity', displayText: 'Entity ID' },
    { id: 'clientName', displayText: 'Client Name' },
    // { id: 'accountType', displayText: 'Account Type' },
    { id: 'feeRate', displayText: 'Fee Rate' },
    // { id: 'cessionDisplay', displayText: 'Cession' },
    // { id: 'balanceDisplay', displayText: 'Balance' },
    // { id: 'displayOnEntityStatement', displayText: 'Appears on Statement' },
  ];
  
  interface IMoneyMarketAcountTable {
    key: string;
    clientName: string;
    parentEntity: string;
    accountNumber: string;
    accountName: string;
    accountType: string;
    feeRate: number;
    cession: number;
    cessionDisplay: string;
    balance: number;
    balanceDisplay: string;
    displayOnEntityStatement: string;
  }
  
  interface IProps{
    accounts: IMoneyMarketAccount[]
  }
  

const DailyTransactionReport = observer((props:IProps) => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const todaysDate = Date.now();  
 // const {accounts} = props;
  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const clients = [...store.client.naturalPerson.all.map((client)=>{return client.asJson}), ...store.client.legalEntity.all.map((client)=>{return client.asJson})];
  const products = store.product.all.map((product)=>{return product.asJson});
  const accounts = store.mma.all.map((account)=>{return account.asJson});
  const getClientName = (parentEntityId: string) => {
    const client = clients.find(client => client.entityId === parentEntityId)
    if (client) {
      return client.entityDisplayName
    }
    return "";
  }

  const getProductName = (productId: string) => {
    const product = products.find(product => product.id === productId)
    if (product) {
      return product.productName;
    }
    return "";
  }

  const moneyMarketAcounts: IMoneyMarketAcountTable[] = accounts.map((mma) => {
    const mappedItem = {
      key: mma.id,
      parentEntity: mma.parentEntity,
      clientName: getClientName(mma.parentEntity),
      accountNumber: mma.accountNumber,
      accountName: mma.accountName,
      accountType: getProductName(mma.accountType) ,
      feeRate: mma.feeRate,
      cession: mma.cession,
      cessionDisplay: currencyFormat(mma.cession),
      balance: mma.balance,
      balanceDisplay: currencyFormat(mma.balance),
      displayOnEntityStatement: mma.displayOnEntityStatement ? "Yes" : "No",
    };  
    return mappedItem;
  });

  //console.log("Money Market Accounts", moneyMarketAcounts);

  const moneyMarketAcountsFiltered = moneyMarketAcounts.filter((moneyMarketAcount) => {
    let filtered = true;
    if (filters.stringValueA && !moneyMarketAcount.clientName?.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  const individualAccounts = moneyMarketAcounts.filter((acounts)=>acounts.accountType === "IJG Individual Money Market Solution");
  const taxAccounts = moneyMarketAcounts.filter((acounts)=>acounts.accountType === "Tax Free Account");
  const corporateAccounts = moneyMarketAcounts.filter((acounts)=>acounts.accountType === "Corporate");
  console.log("INdDEPOSIT",individualAccounts);
// !find solution for hardcoded products
/**INDIVIDUAL***/
  //DEPOSITS
  const individualDeposits = store.clientDepositAllocation.all
  .filter((verified) => {
    const matchingAccounts = individualAccounts
      .some((depTransaction) => depTransaction.accountNumber === verified.asJson.allocation);
    return verified.asJson.transactionStatus === "verified" && matchingAccounts;
  })
  .map((accounts) => accounts.asJson);
  const todayDepositTransactions = individualDeposits.filter(
    (today) =>
      dateFormat_YY_MM_DD(today.transactionDate) ==
      dateFormat_YY_MM_DD(todaysDate)
  )
  const todayDepositsBalance = todayDepositTransactions
  .filter((balances) => balances.amount)
  .reduce((total, transaction) => total + transaction.amount, 0);
  //WITHDRAWALS 
  const individualWithdrawals = store.clientWithdrawalPayment.all
  .filter((verified) => {
    const matchingAccounts = individualAccounts
      .some((depTransaction) => depTransaction.accountNumber === verified.asJson.allocation);
    return verified.asJson.isPaymentProcessed === true && matchingAccounts;
  })
  .map((accounts) => accounts.asJson);
  const todayWithdrawalTransactions = individualWithdrawals.filter(
    (today) =>
      dateFormat_YY_MM_DD(today.transactionDate) ==
      dateFormat_YY_MM_DD(todaysDate)
  );
  const todayWithdrawalsBalance = todayWithdrawalTransactions
  .filter((balances) => balances.amount)
  .reduce((total, transaction) => total + transaction.amount, 0);
  //SWITCHES
  const switches = store.switch.all
  .filter((verified) => {
    const matchingAccounts = individualAccounts
      .some((depTransaction) => depTransaction.accountNumber === verified.asJson.fromAccount);
    return verified.asJson && matchingAccounts;
  })
  .map((accounts) => accounts.asJson);
  const todaySwitchTransactions = switches.filter(
    (today) =>
      dateFormat_YY_MM_DD(today.switchDate) ==
      dateFormat_YY_MM_DD(todaysDate)
  );
  const netIndividuals = todayDepositsBalance - todayWithdrawalsBalance;
  const todaySwitchBalance = todaySwitchTransactions
  .filter((balances) => balances.amount)
  .reduce((total, transaction) => total + transaction.amount, 0);

/**CORPORATE****/
 //DEPOSITS
 const corporateDeposits = store.clientDepositAllocation.all
 .filter((verified) => {
   const matchingAccounts = corporateAccounts
     .some((depTransaction) => depTransaction.accountNumber === verified.asJson.allocation);
   return verified.asJson.transactionStatus === "verified" && matchingAccounts;
 })
 .map((accounts) => accounts.asJson);
 const todayCorporateDepositTransactions = corporateDeposits.filter(
   (today) =>
     dateFormat_YY_MM_DD(today.transactionDate) ==
     dateFormat_YY_MM_DD(todaysDate)
 );
 const todayCorporateDepositsBalance = todayCorporateDepositTransactions
 .filter((balances) => balances.amount)
 .reduce((total, transaction) => total + transaction.amount, 0);
 //WITHDRAWALS 
 const corporateWithdrawals = store.clientWithdrawalPayment.all
 .filter((verified) => {
   const matchingAccounts = corporateAccounts
     .some((depTransaction) => depTransaction.accountNumber === verified.asJson.allocation);
   return verified.asJson.isPaymentProcessed === true && matchingAccounts;
 })
 .map((accounts) => accounts.asJson);
 const todayCorporateWithdrawalTransactions = corporateWithdrawals.filter(
   (today) =>
     dateFormat_YY_MM_DD(today.transactionDate) ==
     dateFormat_YY_MM_DD(todaysDate)
 );
 const todayCorporateWithdrawalsBalance = todayCorporateWithdrawalTransactions
 .filter((balances) => balances.amount)
 .reduce((total, transaction) => total + transaction.amount, 0);
 //SWITCHES
 const corporateSwitches = store.switch.all
 .filter((verified) => {
   const matchingAccounts = corporateAccounts
     .some((depTransaction) => depTransaction.accountNumber === verified.asJson.fromAccount);
   return verified.asJson && matchingAccounts;
 })
 .map((accounts) => accounts.asJson);
 const todayCorporateSwitchTransactions = corporateSwitches.filter(
   (today) =>
     dateFormat_YY_MM_DD(today.switchDate) ==
     dateFormat_YY_MM_DD(todaysDate)
 );
 const netCorporate = todayCorporateDepositsBalance - todayCorporateWithdrawalsBalance;
  /**TAX****/
   //DEPOSITS
   const taxDeposits = store.clientDepositAllocation.all
   .filter((verified) => {
     const matchingAccounts = taxAccounts
       .some((depTransaction) => depTransaction.accountNumber === verified.asJson.allocation);
     return verified.asJson.transactionStatus === "verified" && matchingAccounts;
   })
   .map((accounts) => accounts.asJson);
   const todayTaxDepositTransactions = taxDeposits.filter(
     (today) =>
       dateFormat_YY_MM_DD(today.transactionDate) ==
       dateFormat_YY_MM_DD(todaysDate)
   );
   const todayTaxDepositsBalance = todayTaxDepositTransactions
   .filter((balances) => balances.amount)
   .reduce((total, transaction) => total + transaction.amount, 0);
   //WITHDRAWALS 
   const taxWithdrawals = store.clientWithdrawalPayment.all
   .filter((verified) => {
     const matchingAccounts = taxAccounts
       .some((depTransaction) => depTransaction.accountNumber === verified.asJson.allocation);
     return verified.asJson.isPaymentProcessed === true && matchingAccounts;
   })
   .map((accounts) => accounts.asJson);
   const todayTaxWithdrawalTransactions = taxWithdrawals.filter(
     (today) =>
       dateFormat_YY_MM_DD(today.transactionDate) ==
       dateFormat_YY_MM_DD(todaysDate)
   );
   const todayTaxWithdrawalsBalance = todayTaxWithdrawalTransactions
   .filter((balances) => balances.amount)
   .reduce((total, transaction) => total + transaction.amount, 0);
   //SWITCHES
   const taxSwitches = store.switch.all
   .filter((verified) => {
     const matchingAccounts = taxAccounts
       .some((depTransaction) => depTransaction.accountNumber === verified.asJson.fromAccount);
     return verified.asJson && matchingAccounts;
   })
   .map((accounts) => accounts.asJson);
   const todayTaxSwitchTransactions = taxSwitches.filter(
     (today) =>
       dateFormat_YY_MM_DD(today.switchDate) ==
       dateFormat_YY_MM_DD(todaysDate)
   );
   const netTax = todayTaxDepositsBalance - todayTaxWithdrawalsBalance;
   const totalNet = netIndividuals + netCorporate + netTax;
  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await api.clientDepositAllocation.getAll();
        await api.clientWithdrawalPayment.getAll();
        await api.switch.getAll();
        await api.client.legalEntity.getAll();
        await api.client.naturalPerson.getAll();
        await api.product.getAll();
        await api.mma.getAll();
        setLoading(false);
      } catch (error) {}
      setLoading(false);
    };
    loadAll();
  }, [
    api.clientDepositAllocation,
    api.clientWithdrawalPayment,
    api.client.legalEntity,
    api.client.naturalPerson,
    api.product,
    api.mma,
    api.switch,
    store.mma,
  ]);
  if (loading) return (
    <LoadingEllipsis />
  )
  return (
    <div className="page uk-section uk-section-small">
      <div className="uk-container uk-container-expand">
        <div className="sticky-top">
          <Toolbar
            title="Daily Transaction Report"
            rightControls={
              <>
                {/* <button className="btn btn-primary" onClick={handleExport}>Export</button> */}
              </>
            }
          />
          <hr />
        </div>

        <div className="page-main-card uk-card uk-card-default uk-card-body">
          <div className="uk-grid uk-width-1-1">
            <div className="uk-width-1-1" style={{marginLeft:"40px"}}>
              <div>
                <h2 className="main-title-lg instrument-card">Individual Money Market</h2>
                <div className="ip">
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <h4 className="main-title-small">Deposits</h4>
                      <h4 className="main-title-small" style={{marginTop:"0px"}}>Balance N$ {todayDepositsBalance}</h4>
                    </div>
                    <DepositsGrid data={todayDepositTransactions} />
                    {/* <h3>Balance: {220000}</h3> */}
                  </div>
                  
                  {/* <h2 className="uk-modal-title">Withdrawals</h2> */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"}}>
                      <h4 className="main-title-small">Withdrawals</h4>
                      <h4 className="main-title-small" style={{marginTop:"0px"}}>Balance N$ {todayWithdrawalsBalance}</h4>
                    </div>
                  <WithdrawalsGrid data={todayWithdrawalTransactions} />
                  {/* <h3>Balance: {220000}</h3> */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"}}>
                      <h4 className="main-title-small">Switches</h4>
                      <h4 className="main-title-small" style={{marginTop:"0px"}}>Balance N$ 0</h4>
                    </div>
                  {/* <h2 className="uk-modal-title">Switches</h2> */}
                  <SwitchesGrid data={todaySwitchTransactions} />
                </div>
                <h2 className="main-title-small"> {netIndividuals < 0 ? "Net Cancellation:  " : "Net Creation:  "}
                <span style={{border:"2px solid blue",padding:"4px"}}>N${netIndividuals}</span></h2>
              </div>
              <div style={{marginTop:"20px"}}>
                <h2 className="main-title-lg instrument-card">Corporate</h2>
                <div className="Corporate">
                  <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <h4 className="main-title-small">Deposits</h4>
                      <h4 className="main-title-small" style={{marginTop:"0px"}}>Balance N$ {todayCorporateDepositsBalance}</h4>
                    </div>
                    <hr />
                    <DepositsGrid data={todayCorporateDepositTransactions} />
                    {/* <h3>Balance: {220000}</h3> */}
                  </div>

                  {/* <h2 className="uk-modal-title">Withdrawals</h2> */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"}}>
                      <h4 className="main-title-small">Withdrawals</h4>
                      <h4 className="main-title-small" style={{marginTop:"0px"}}>Balance N$ {todayCorporateWithdrawalsBalance}</h4>
                    </div>
                  <WithdrawalsGrid data={todayCorporateWithdrawalTransactions} />
                  {/* <h3>Balance: {220000}</h3> */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"}}>
                      <h4 className="main-title-small">Switches</h4>
                      <h4 className="main-title-small" style={{marginTop:"0px"}}>Balance N$ 0</h4>
                    </div>
                  {/* <h2 className="uk-modal-title">Switches</h2> */}
                  <SwitchesGrid data={todayCorporateSwitchTransactions} />
                </div>
                <h2 className="main-title-small"> {netCorporate < 0 ? "Net Cancellation:  " : "Net Creation:  "}
                <span style={{border:"2px solid blue",padding:"4px"}}>N${netCorporate}</span></h2>
                {/* only a creation if its negative value, and only a creation if its positive */}
              </div>
              <div style={{marginTop:"20px"}}>
                <h2 className="main-title-lg instrument-card">Tax</h2>
                <div className="tax">
                  <div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"}}>
                      <h4 className="main-title-small">Deposits</h4>
                      <h4 className="main-title-small" style={{marginTop:"0px"}}>Balance N$ {todayTaxDepositsBalance}</h4>
                    </div>
                    <hr />
                    <DepositsGrid data={todayTaxDepositTransactions} />
                    {/* <h3>Balance: {220000}</h3> */}
                  </div>
                  {/* <h2 className="uk-modal-title">Withdrawals</h2> */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"}}>
                      <h4 className="main-title-small">Withdrawals</h4>
                      <h4 className="main-title-small" style={{marginTop:"0px"}}>Balance N$ {todayTaxWithdrawalsBalance}</h4>
                    </div>
                  <WithdrawalsGrid data={todayTaxWithdrawalTransactions} />
                  {/* <h3>Balance: {220000}</h3> */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"20px"}}>
                      <h4 className="main-title-small">Switches</h4>
                      <h4 className="main-title-small" style={{marginTop:"0px"}}>Balance N$ 0</h4>
                    </div>
                  {/* <h2 className="uk-modal-title">Switches</h2> */}
                  <SwitchesGrid data={todayTaxSwitchTransactions} />
                </div>
                <h2 className="main-title-small"> {netTax < 0 ? "Net Cancellation:  " : "Net Creation:  "}
                <span style={{border:"2px solid blue",padding:"4px"}}>N${netTax}</span></h2>
              </div>
              <h1 className="main-title-lg" style={{border:"2px solid blue",padding:"4px"}}>{totalNet < 0 ? "Total Cancellation:  " : "Total Creation:  "} N${totalNet}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default DailyTransactionReport;

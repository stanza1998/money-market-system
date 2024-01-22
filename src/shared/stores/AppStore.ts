//TODO: Check all the stores and clean up
import AuthStore from "./AuthStore";
import UserStore from "./UserStore";
import { MainApp } from "../models/App";
// import InstrumentStore from "./InstrumentStore";
import InstrumentCategoryStore from "./InstrumentCategoryStore";
import IssuerStore from "./IssuerStore";
import InstrumentsStore from "./InstrumentsStore";
import CounterPartyStore from "./CounterPartyStore";
import PurchasesStore from "./purchasesStore";
import SalesStore from "./SalesStore";
import ClientsStore from "./ClientsStore";
import EntityIdStore from "./EntityIdStore";
import MoneyMarketAccountStore from "./MoneyMarketAccountStore";
import FolderFileStore from "./FolderFileStore";
import ClientDepositAllocationStore from "./client-deposit-allocation/ClientDepositAllocationStore";
import TransactionInflowStore from "./TransactionInflowStore";
import ClientWithdrawalPaymentStore from "./client-withdrawal-payment/ClientWithdrawalPaymentStore";
import TransactionOutflowStore from "./TransactionOutflowStore";
import SwitchTransactionStore from "./SwitchTransaction";
import ProductStore from "./ProductStore";
import DocFoxNaturalPersonStore from "./DocFoxNaturalPersonStore";
import DocFoxApplicationStore from './DocFoxApplicationsStore';
import DocFoxProfileNamesStore from "./DocFoxProfileNamesStore";
import DocFoxProfileContactsStore from "./docfox-profile/DocFoxProfileContactsStore";
import DocFoxProfileNumbersStore from "./docfox-profile/DocFoxProfileNumbersStore";
import DocFoxProfileAdditionalDetailsStore from "./docfox-profile/DocFoxProfileAdditionalDetailsStore";
import DocFoxProfileAddressesStore from "./docfox-profile/DocFoxProfileAddressesStore";
import AssetManagerFlowStore from "./AssetManagerFlowStore";
import ClientWithdrawalRecurringPaymentStore from "./client-withdrawal-recurring-payment/ClientWithdrawalRecurringPaymentStore";
import ProductDailyInflowStore from "./ProductDailyInflowStore";
import ProductDailyInflowTransactionStore from "./ProductDailyInflowTransactionStore";
import MoneyMarketAccountInterestLogStore from "./MoneyMarketAccountInterestLogStore";
import ProductDailyPricingStore from "./ProductDailyPricingStore";
import HashCodeStore from "./hash-code-store/HashCodeStore";
import DocFoxApplicationRiskRatingsStore from "./DocFoxApplicationRiskRatingsStore";
import BatchStore from "./batches/BatchStore";
import CancelledWithdrawalTransactionStore from "./cancelled-withdrawal-transaction/CancelledWithdrawalTransactionStore";
import crmClientDepositAllocationStore from "./crm-client-deposit-allocation/CrmClientDepositAllocationStore";

export default class AppStore {
  app: MainApp;

  //! Started by Werner, but not fully tested
  auth = new AuthStore(this);
  user = new UserStore(this);
  category = new InstrumentCategoryStore(this);
  issuer = new IssuerStore(this);
  instruments = new InstrumentsStore(this);
  purchase = new PurchasesStore(this);
  client = new ClientsStore(this);
  counterParty = new CounterPartyStore(this);
  entityId = new EntityIdStore(this);

  folderFile = new FolderFileStore(this);

  //! Started by Werner, but not done
  sale = new SalesStore(this);

  //* What I added
  product = new ProductStore(this);
  productDailyPricing = new ProductDailyPricingStore(this);
  productDailyInFlow = new ProductDailyInflowStore(this);
  productDailyInFlowTransaction = new ProductDailyInflowTransactionStore(this);

  mma = new MoneyMarketAccountStore(this);
  mmaInterestLog = new MoneyMarketAccountInterestLogStore(this);

  clientDepositAllocation = new ClientDepositAllocationStore(this);
// Crm Store
  crmClientDepositAllocation = new crmClientDepositAllocationStore(this);


  clientWithdrawalPayment = new ClientWithdrawalPaymentStore(this);
  clientWithdrawalRecurringPayment = new ClientWithdrawalRecurringPaymentStore(
    this
  );
  batches = new BatchStore(this);

  inflow = new TransactionInflowStore(this);
  outflow = new TransactionOutflowStore(this);

  switch = new SwitchTransactionStore(this);

  docFoxApplication = new DocFoxApplicationStore(this);
  docFoxApplicationRiskRating = new DocFoxApplicationRiskRatingsStore(this);

  docFoxProfile = new DocFoxProfileNamesStore(this);
  docFoxProfileContacts = new DocFoxProfileContactsStore(this);
  docFoxProfileNumbers = new DocFoxProfileNumbersStore(this);
  docFoxProfileAdditionalDetails = new DocFoxProfileAdditionalDetailsStore(
    this
  );
  docFoxProfileAddresses = new DocFoxProfileAddressesStore(this);

  docFox = new DocFoxNaturalPersonStore(this);

  assetManager = new AssetManagerFlowStore(this);

  //cancelled Withdrawal Transactions
  cancelledWithdrawal = new CancelledWithdrawalTransactionStore(this);

  //hash code for csv files uploaded to hanlde constraints on uploading the same file (stanza)
  hashCode = new HashCodeStore(this);

  constructor(app: MainApp) {
    this.app = app;
  }
}

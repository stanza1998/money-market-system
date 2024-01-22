import AppStore from "../stores/AppStore";
import MailApi from "./MailApi";

import { mailApiEndpoint } from "../config/mail-api-config";

import AuthApi from "./AuthApi";
import UserApi from "./UserApi";
import InstrumentCategoryApi from "./InstrumentCategoryApi";
import IssuerApi from "./IssuerApi";
import InstrumentsApi from "./InstrumentsApi";
import CounterPartyApi from "./CounterPartyApi";
import PurchasesApi from "./PurchasesApi";
import SalesApi from "./SalesApi";
import ClientsApi from "./ClientsApi";
import MoneyMarketAccountApi from "./MoneyMarketAccountApi";
import ClientDepositAllocationApi from "./client-deposit-allocation/ClientDepositAllocationApi";
import TransactionInflowApi from "./TransactionInflowApi";
import ClientWithdrawalPaymentApi from "./client-withdrawal-payment/ClientWithdrawalPaymentApi";

import TransactionOutflowApi from "./TransactionOutflowApi";
import SwitchTransactionApi from "./SwitchTransactionApi";
import ProductApi from "./ProductApi";
import DocFoxApi from './clients/DocFoxApi';
import AssetMangerFlowApi from "./AssetMangerFlowApi";
import ClientWithdrawalRecurringPaymentApi from "./client-withdrawal-recurring-payment/ClientWithdrawalRecurringPaymentApi";
import ProductDailyInflowApi from "./ProductDailyInflowApi";
import ProductDailyInflowTransactionApi from "./ProductDailyInflowTransactionApi";
import MoneyMarketAccountInterestLogApi from "./MoneyMarketAccountInterestLogApi";
import ProductDailyPricingApi from "./ProductDailyPricingApi";
import HashCodeApi from "./hash-code-api/HashCodeApi";
import BatchesApi from "./batches/BatchesApi";
import CancelledWithdrawalTransactionApi from "./cancellWithdrawalTransaction/CancelWithdrawalTransactionApi";
import CrmClientDepositAllocationApi from "./crm-client-deposit-allocation/CrmClientDepositAllocationApi";

export default class AppApi {
  /**
   * ! added by Werner, not fully tested
   * */

  mail: MailApi;
  auth: AuthApi;
  user: UserApi;
  docfox: DocFoxApi;
  category: InstrumentCategoryApi;
  issuer: IssuerApi;
  instruments: InstrumentsApi;
  purchase: PurchasesApi;
  counterParty: CounterPartyApi;
  sale: SalesApi;
  client: ClientsApi;
  hashCode: HashCodeApi; //stanza

  mma: MoneyMarketAccountApi;
  mmaInterestLog: MoneyMarketAccountInterestLogApi;

  // * I added this
  product: ProductApi;
  productDailyPricing: ProductDailyPricingApi;
  productDailyInFlow: ProductDailyInflowApi;
  productDailyInFlowTransactions: ProductDailyInflowTransactionApi;

  //Crm deposit allocation Api
  crmClientDepositAllocation: CrmClientDepositAllocationApi;
  clientDepositAllocation: ClientDepositAllocationApi;
  clientWithdrawalPayment: ClientWithdrawalPaymentApi;
  clientWithdrawalRecurringPayment: ClientWithdrawalRecurringPaymentApi;
  batches: BatchesApi;

  inflow: TransactionInflowApi;
  outflow: TransactionOutflowApi;
  switch: SwitchTransactionApi;

  assetManager: AssetMangerFlowApi;

  cancelledWithdrawals: CancelledWithdrawalTransactionApi;

  constructor(store: AppStore) {
    /**
     * ! added by Werner, not fully tested
     * */

    this.mail = new MailApi(this, store, mailApiEndpoint);
    this.auth = new AuthApi(this, store);

    this.user = new UserApi(this, store);
    this.category = new InstrumentCategoryApi(this, store);
    this.issuer = new IssuerApi(this, store);
    this.instruments = new InstrumentsApi(this, store);
    this.counterParty = new CounterPartyApi(this, store);
    this.purchase = new PurchasesApi(this, store);
    this.sale = new SalesApi(this, store);
    this.client = new ClientsApi(this, store);

    // * I added this
    this.product = new ProductApi(this, store);
    this.productDailyPricing = new ProductDailyPricingApi(this, store);
    this.productDailyInFlow = new ProductDailyInflowApi(this, store);
    this.productDailyInFlowTransactions = new ProductDailyInflowTransactionApi(
      this,
      store
    );

    this.mma = new MoneyMarketAccountApi(this, store);
    this.mmaInterestLog = new MoneyMarketAccountInterestLogApi(this, store);

    this.clientDepositAllocation = new ClientDepositAllocationApi(this, store);


    // crm deposit allocation
    this.crmClientDepositAllocation = new CrmClientDepositAllocationApi(this, store);

    
    this.clientWithdrawalPayment = new ClientWithdrawalPaymentApi(this, store);
    this.clientWithdrawalRecurringPayment =
      new ClientWithdrawalRecurringPaymentApi(this, store);

    this.batches = new BatchesApi(this, store);

    this.inflow = new TransactionInflowApi(this, store);
    this.outflow = new TransactionOutflowApi(this, store);
    this.switch = new SwitchTransactionApi(this, store);

    this.docfox = new DocFoxApi(this, store);

    this.assetManager = new AssetMangerFlowApi(this, store);

    this.hashCode = new HashCodeApi(this, store);

    this.cancelledWithdrawals = new CancelledWithdrawalTransactionApi(
      this,
      store
    );
  }
}

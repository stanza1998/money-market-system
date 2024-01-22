const MODAL_NAMES = {
  ADMIN: {
    PRODUCT_MODAL: "product-modal",
    USER_MODAL: "user-modal",
    CLIENT_MODAL: "client-modal",
    CATEGORY_MODAL: "category-modal",
    //
    INSTRUMENT_MODAL: "instrument-modal",
    VIEW_INSTRUMENT_MODAL: "view-instrument-modal",
    INSTRUMENT_CATEGOORY_MODAL: "instrument-category-modal",
    ISSURE_MODAL: "issuer-modal",

    VIEW_DETAIL_BATCHES: "view-details-batches",
    COUNT_BATCHES: "count-batches",
    CANCEL_TRANSACTION_MODAL: "cancel-transaction-modal",

    // instruments
    FIXED_DEPOSIT_MODAL: "fixed-deposit-modal",
    EQUITY_MODAL: "equity-modal",
    UNIT_TRUST_MODAL: "unit-trust-modal",
    TREASURY_BILL_MODAL: "treasury-bill-modal",
    TREASURY_BILL_REPLACEMENT_MODAL: "treasury-bill-replacement-modal",
    BOND_REPLACEMENT_MODAL: "bond-replacement-modal",
    FIXED_DEPOSIT_REPLACEMENT_MODAL: "fixed-deposit-replacement-modal",
    BOND_MODAL: "bond-modal",

    // views
    VIEW_FIXED_DEPOSIT_MODAL: "view-fixed-deposit-modal",
    VIEW_EQUITY_MODAL: "view-equity-modal",
    VIEW_UNIT_TRUST_MODAL: "view-unit-trust-modal",
    VIEW_TREASURY_BILL_MODAL: "view-treasury-bill-modal",
    VIEW_BOND_MODAL: "view-bond-modal",

    // instrumemnt holdings
    TREASURY_BILL_HOLDINGS_MODAL: "treasury-bill-holdings-modal",

    // Purchases
    PURCHASE_FIXED_DEPOSIT_MODAL: "purchase-fixed-deposit-modal",
    PURCHASE_EQUITY_MODAL: "purchase-equity-modal",
    PURCHASE_UNIT_TRUST_MODAL: "purchase-unit-trust-modal",
    PURCHASE_TREASURY_BILL_MODAL: "purchase-treasury-bill-modal",
    PURCHASE_BOND_MODAL: "purchase-bond-modal",

    // sales
    SALE_FIXED_DEPOSIT_MODAL: "sale-fixed-deposit-modal",
    SALE_EQUITY_MODAL: "sale-equity-modal",
    SALE_UNIT_TRUST_MODAL: "sale-unit-trust-modal",
    SALE_TREASURY_BILL_MODAL: "sale-treasury-bill-modal",
    SALE_BOND_MODAL: "sale-bond-modal",
    //
    COUNTER_PARTY_MODAL: "counter-party-modal",

    // clients
    ENTITY_TYPE_MODAL: "entity-type-modal",
    NATURAL_PERSON_MODAL: "natural-person-entity-modal",
    LEGAL_ENTITY_MODAL: "legal-entity-modal",

    VIEW_NATURAL_PERSON_MODAL: "view-natural-person-modal",
    VIEW_LEGAL_ENTITY_MODAL: "view-legal-entity-modal",

    // accounts
    MONEY_MARKET_ACCOUNT_MODAL: "money-market-account-modal",
    VIEW_MONEY_MARKET_ACCOUNT_MODAL: "view-money-market-account-modal",

    //
    FILE_READER_MODAL: "file-reader-modal",
  },
  BACK_OFFICE: {
    //Products
    ALL_PRODUCT_ACCOUNTS_MODAL: "all-products-accounts",
    UPDATE_PRODUCT_BASE_RATE_MODAL: "update-product-base-rate-modal",
    UPLOAD_DAILY_PRICING_MODAL: "upload-daily-pricing-modal",

    // clients
    DOC_FOX_ENTITY_TYPE_MODAL: "docfox-entity-type-modal",
    DOC_FOX_NATURAL_PERSON_MODAL: "docfox-natural-person-entity-modal",
    DOC_FOX_LEGAL_ENTITY_MODAL: "docfox-legal-entity-modal",
    DOC_FOX_SELECT_NATURAL_PERSON_MODAL: "docfox-select-natural-person-modal",

    //
    SBN_BANK_STATEMENT_UPLOAD_MODAL: "sbn-bank-statement-upload-modal",
    NBN_BANK_STATEMENT_UPLOAD_MODAL: "nbn-bank-statement-upload-modal",
    RECORD_DEPOSIT_MODAL: "record-deposit-modal",
    RECORD_UPLOAD_MODAL: "record-upload-modal",
    MANUAL_DEPOSIT_ALLOCATION_MODAL: "manual-deposit-alllocation-modal",
    TRANSACTIONS: {
      EDIT_TRANSACTION_MODAL: "edit-transaction-modal",
      ALLOCATE_TRANSACTION_MODAL: "allocation-transaction-modal",
    },

    //
    RECORD_WITHDRAWAL_MODAL: "record-withdrawal-modal",
    RECORD_WITHDRAWAL_RECURRING_MODAL: "record-withdrawal-recurring-modal",
    RECORD_RECURRING_WITHDRAWAL_MODAL: "record-recurring-withdrawal-modal",

    EDIT_WITHDRAWAL_MODAL: "edit-withdrawal-modal",
    EDIT_WITHDRAWAL_RECURRING_MODAL: "edit-withdrawal-recurring-modal",
    VERIFY_WITHDRAWAL_MODAL: "verify-withdrawal-modal",
    VERIFY_WITHDRAWAL_RECURRING_MODAL: "verify-withdrawal-recurring-modal",
    AUTHORIZE_WITHDRAWAL_MODAL: "authorize-withdrawal-modal",
    TRANSACTION_WITHDRAWAL_MODAL: "transaction-withdrawal-modal",

    //
    TREASURY_BILL_PURCHASE_PROCESSING_MODAL:
      "treasury-bill-purchase-processing-modal",

    SWITCH_BETWEEN_ACCOUNTS_MODAL: "switch-between-accounts-modal",

    //new(stanza)
    VIEW_DEPOSIT_TRANSACTION: "view-deposit-transaction",
    VIEW_WITHDRAWAL_TRANSACTION: "view-withdrawal-transaction",
    CLOSE_MM_ACCOUNT: "close-mm-account",
    EXPORT_REPORT_DATA: "export-report-data",
    //new(stanza)

    DEPOSIT_TO_ASSET_MANAGER: {
      INDIVIDUAL_CORPORATE_MODAL: "deposit-individual-corporate-modal",
      CORPORATE_MODAL: "deposit-corporate-modal",
      TAX_FREE_MODAL: "deposit-individual-corporate-modal",
    },

    WITHDRAW_FROM_ASSET_MANAGER: {
      INDIVIDUAL_CORPORATE_MODAL: "withdraw-individual-corporate-modal",
      CORPORATE_MODAL: "corporate-modal",
      TAX_FREE_MODAL: "withdraw-individual-corporate-modal",
    },

    VIEW_DAILY_FLOWS_MODAL: "view-asset-manager-daily-flows-modal",
  },

  INFLOWS: {
    INDIVIDUAL_INFLOW_TRANSACTIONS_MODAL: "individual-inflow-transaction-modal",
    CORPORATE_INFLOW_TRANSACTIONS_MODAL: "corporate-inflow-transaction-modal",
    TAX_FREE_INFLOW_TRANSACTIONS_MODAL: "tax-free-inflow-transaction-modal",
  },

  OUTFLOWS: {
    INDIVIDUAL_OUTFLOW_TRANSACTIONS_MODAL:
      "individual-outflow-transaction-modal",
    CORPORATE_OUTFLOW_TRANSACTIONS_MODAL: "corporate-outflow-transaction-modal",
    TAX_FREE_OUTFLOW_TRANSACTIONS_MODAL: "tax-free-outflow-transaction-modal",
  },

  DATA_MIGRATION: {
    IMPORT_CLIENT_ENTITY_MODAL: "import-client-entity-modal",
    IMPORT_CLIENT_ACCOUNTS_MODAL: "import-client-accounts-modal",
    IMPORT_TRANSACTION_MODAL: "import-transactions-modal",
  },
};

export default MODAL_NAMES;
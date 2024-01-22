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
import { faFilter, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LoadingEllipsis } from '../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../shared/functions/AdvancedFilter';
import Toolbar from '../../../shared/toolbar/Toolbar';
import showModalFromId from '../../../../shared/functions/ModalShow';
import MODAL_NAMES from '../../../dialogs/ModalName';
import Modal from '../../../../shared/components/Modal';
import MoneyMarketAccountModal from '../../../dialogs/crud/products/money-market-account/MoneyMarketAccountModal';
import ViewMoneyMarketAccountModal from '../../../dialogs/products/money-market-account/ViewMoneyMarketAccountModal';
import { currencyFormat } from '../../../../shared/functions/Directives';
import AccountImportModal from '../../../dialogs/products/money-market-account/import-client-accounts/AccountImportModal';

const columns: Column[] = [
  { id: 'accountNumber', displayText: 'Account Number' },
  { id: 'accountName', displayText: 'Account Name' },
  { id: 'clientName', displayText: 'Client Name' },
  { id: 'parentEntity', displayText: 'Entity ID' },
  { id: 'accountType', displayText: 'Account Type' },
  { id: 'feeRate', displayText: 'Fee Rate' },
  // { id: 'cessionDisplay', displayText: 'Cession' },
  // { id: 'balanceDisplay', displayText: 'Balance' },
  { id: 'displayOnEntityStatement', displayText: 'Appears on Statement' },
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

const ClientMoneyMarketAccounts = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const clients = [...store.client.naturalPerson.all, ...store.client.legalEntity.all];
  const products = store.product.all;

  const handleNewAccount = () => {
    showModalFromId(MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL);
  };

  const importAccounts = () => {
    showModalFromId(MODAL_NAMES.DATA_MIGRATION.IMPORT_CLIENT_ACCOUNTS_MODAL);
  };

  const getClientName = (parentEntityId: string) => {
    const client = clients.find(client => client.asJson.entityId === parentEntityId)
    if (client) {
      return client.asJson.entityDisplayName
    }
    return "";
  }

  const getProductName = (productId: string) => {
    const product = products.find(product => product.asJson.id === productId)
    if (product) {
      return product.asJson.productName
    }
    return "";
  }

  const moneyMarketAcounts: IMoneyMarketAcountTable[] = store.mma.all.map((mma) => ({
    key: mma.asJson.id,
    parentEntity: mma.asJson.parentEntity,
    clientName: getClientName(mma.asJson.parentEntity),
    accountNumber: mma.asJson.accountNumber,
    accountName: mma.asJson.accountName,
    accountType: getProductName(mma.asJson.accountType),
    feeRate: mma.asJson.feeRate,
    cession: mma.asJson.cession,
    cessionDisplay: currencyFormat(mma.asJson.cession),
    balance: mma.asJson.balance,
    balanceDisplay: currencyFormat(mma.asJson.balance),
    displayOnEntityStatement: mma.asJson.displayOnEntityStatement ? "Yes" : "No",
  }));

  const moneyMarketAcountsFiltered = moneyMarketAcounts.filter((moneyMarketAcount) => {
    let filtered = true;
    if (filters.stringValueA && !moneyMarketAcount.clientName?.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.client.legalEntity.getAll();
        await api.client.naturalPerson.getAll();
        await api.mma.getAll();
        await api.issuer.getAll();
        await api.product.getAll();
      } catch (error) { }
      setLoading(false);
    };
    loadData();

  }, [api.client.naturalPerson, api.client.legalEntity, api.issuer, api.mma, api.product]);

  if (loading) return (
    <LoadingEllipsis />
  )

  return (
    <ErrorBoundary>
      <div className="page uk-section uk-section-small">
        <div className="uk-container uk-container-expand">
          <div className="page-main-card uk-card ">
            {/** Toolbar starts here */}
            <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
              <Toolbar
                rightControls={
                  <div className="filter">
                    <div className="uk-flex">
                      <button className="btn btn-text btn-small" type="button" data-uk-toggle="target: #offcanvas-flip">Filter <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon> </button>
                      <button className="btn btn-danger btn-small" onClick={handleClearFilters}>Clear</button>
                    </div>
                    <div id="offcanvas-flip" data-uk-offcanvas="flip: true; overlay: true">
                      <div className="uk-offcanvas-bar">
                        <button className="uk-offcanvas-close" type="button" data-uk-close></button>
                        <h3 className="main-title-small">Filter</h3>
                        <hr />
                        <div className="uk-grid uk-grid-small" data-uk-grid>
                          <div className="uk-width-large">
                            <div className="uk-grid" data-uk-grid>
                              <div className="uk-width-1-1">
                                <label htmlFor="">Client Type</label>
                                <select className="uk-select uk-form-small" onChange={(e) => handleFilterChange('stringValueA', e.target.value)}>
                                  <option value="">Display All Entity Types</option>
                                  <option value="Natural">Display Natural Person Entities</option>
                                  <option value="Legal">Display Legal Entities</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="uk-divider-horizontal uk-margin-left" />
                        <button className="btn btn-small btn-danger uk-margin-top" onClick={handleClearFilters}>Clear filters</button>
                      </div>
                    </div>
                  </div>
                }
                leftControls={
                  <div className="">
                    <h4 className="main-title-small">Account List</h4>
                    <button className="btn btn-primary" onClick={handleNewAccount}>
                      <FontAwesomeIcon className="uk-margin-small-right" icon={faPlusCircle} /> Account
                    </button>
                    <button className="btn btn-text" onClick={importAccounts} type="button" >
                      <span data-uk-icon="icon: user-plus-circle; ratio:.8"></span>{" "}
                      Import from Tasman
                    </button>
                  </div>
                }
              />
            </div>
            {/** Toolbar ends here */}
            {/** DataTable starts here */}
            <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
              {
                moneyMarketAcountsFiltered &&
                <DataTable columns={columns} data={moneyMarketAcountsFiltered} />
              }

            </div>
            {/** DataTable ends here */}
          </div>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL}>
        <MoneyMarketAccountModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.ADMIN.VIEW_MONEY_MARKET_ACCOUNT_MODAL}>
        <ViewMoneyMarketAccountModal />
      </Modal>

      <Modal modalId={MODAL_NAMES.DATA_MIGRATION.IMPORT_CLIENT_ACCOUNTS_MODAL}>
        <AccountImportModal />
      </Modal>
    </ErrorBoundary>
  );

});

export default ClientMoneyMarketAccounts;
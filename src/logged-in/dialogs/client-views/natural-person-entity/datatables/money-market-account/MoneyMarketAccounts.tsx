// react
import { useState, useEffect } from 'react';

// state management
import { observer } from 'mobx-react-lite';

// custom hooks
import { useAppContext } from '../../../../../../shared/functions/Context';

// DataTable components
import { DataTable } from './DataTable';
import { Column } from '../../../../../../shared/components/react-ts-datatable/DataTableTypes';

import ErrorBoundary from '../../../../../../shared/components/error-boundary/ErrorBoundary';
import { faFilter, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LoadingEllipsis } from '../../../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../../../shared/functions/AdvancedFilter';
import Toolbar from '../../../../../shared/toolbar/Toolbar';
import showModalFromId from '../../../../../../shared/functions/ModalShow';
import MODAL_NAMES from '../../../../../dialogs/ModalName';
import Modal from '../../../../../../shared/components/Modal';
import MoneyMarketAccountModal from '../../../../crud/products/money-market-account/MoneyMarketAccountModal';
import ViewClientMoneyMarketAccountModal from '../../../../products/money-market-account/ViewClientMoneyMarketAccountModal';
import { currencyFormat } from '../../../../../../shared/functions/Directives';

const columns: Column[] = [
  { id: 'accountNumber', displayText: 'Account Number' },
  { id: 'accountName', displayText: 'Account Name' },
  { id: 'accountType', displayText: 'Account Type' },
  { id: 'feeRate', displayText: 'Fee Rate', sortMethod:'sortNumber' },
  { id: 'cessionDisplay', displayText: 'Cession' },
  { id: 'balanceDisplay', displayText: 'Balance' },
  { id: 'displayOnEntityStatement', displayText: 'Appears on Statement' },
];

interface IMoneyMarketAcountTable {
  key: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  feeRate: number;
  cession: number;
  balance: number;
  cessionDisplay: string;
  balanceDisplay: string;
  displayOnEntityStatement: string;
}

interface IProps{
  entityId:string
}

const MoneyMarketAccounts = observer((props: IProps) => {
  const { api, store } = useAppContext();
  const {entityId } =props;
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const handleNewAccount = () => {
    showModalFromId(MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL);
  };

  const products = store.product.all;

  const getProductName = (productId: string) => {
    const product = products.find(product => product.asJson.id === productId)
    if (product) {
      return product.asJson.productName
    }
    return "";
  }

  const moneyMarketAcounts: IMoneyMarketAcountTable[] = store.mma.allEntityAccounts(entityId).map((mma) => ({
    key: mma.asJson.id,
    accountNumber: mma.asJson.accountNumber,
    accountName: mma.asJson.accountName,
    accountType: getProductName(mma.asJson.accountType),
    feeRate: mma.asJson.feeRate,
    cession: mma.asJson.cession,
    balance: mma.asJson.balance,
    cessionDisplay: currencyFormat(mma.asJson.cession),
    balanceDisplay: currencyFormat(mma.asJson.balance),
    displayOnEntityStatement: mma.asJson.displayOnEntityStatement ? "Yes" : "No",
  }));

  const moneyMarketAcountsFiltered = moneyMarketAcounts.filter((moneyMarketAcount) => {
    let filtered = true;
    if (filters.stringValueA && !moneyMarketAcount.accountType?.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.mma.getAll();
        await api.issuer.getAll();
        await api.product.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.issuer, api.mma, api.product]);

  if (loading) return (
    <LoadingEllipsis />
  )

  return (
    <ErrorBoundary>
      <div className="uk-section uk-section-small">
        <div className="uk-container uk-container-expand">
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
      <Modal modalId={MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL}>
        <MoneyMarketAccountModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.ADMIN.VIEW_MONEY_MARKET_ACCOUNT_MODAL}>
        <ViewClientMoneyMarketAccountModal />
      </Modal>
    </ErrorBoundary>
  );

});

export default MoneyMarketAccounts;
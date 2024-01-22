// react
import { useState, useEffect } from 'react';

// state management
import { observer } from 'mobx-react-lite';

// custom hooks
import { useAppContext } from '../../../../../shared/functions/Context';

// DataTable components
import { DataTable } from './DataTable';
import { Column } from '../../../../../shared/components/react-ts-datatable/DataTableTypes';

import ErrorBoundary from '../../../../../shared/components/error-boundary/ErrorBoundary';
import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LoadingEllipsis } from '../../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../../shared/functions/AdvancedFilter';
import Toolbar from '../../../../shared/toolbar/Toolbar';
import {dateFormat_YY_MM_DD } from '../../../../../shared/utils/utils';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../../../shared/components/Modal';
import MODAL_NAMES from '../../../../dialogs/ModalName';

import showModalFromId from '../../../../../shared/functions/ModalShow';
import { toTitleCase } from '../../../../../shared/functions/Directives';
import ViewTreasuryBillModal from '../../../../dialogs/instruments/view/treasury-bills/ViewTreasuryBillModal';
import TreasuryBillModal from '../../../../dialogs/crud/products/instruments/TreasuryBillModal';

const columns: Column[] = [
  { id: 'description', displayText: 'Description' },
  { id: 'issueDate', displayText: 'Issue Date' },
  { id: 'maturityDate', displayText: 'Maturity Date' },
  { id: 'daysToMaturity', displayText: 'DTM', sortMethod: 'sortNumber' },
  { id: 'status', displayText: 'Approval Status' },
];

interface IProductDataTable {
  key: string;
  description: string;
  issueDate: string;
  maturityDate: string | null;
  daysToMaturity: number | null;
  status: string;
}

const TreasuryBills = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const navigate = useNavigate();

  const tbills: IProductDataTable[] = store.instruments.treasuryBill.all.map((instrument) => ({
    key: instrument.asJson.id,
    description: instrument.asJson.instrumentName,
    issueDate: dateFormat_YY_MM_DD(instrument.asJson.issueDate),
    maturityDate: dateFormat_YY_MM_DD(instrument.asJson.maturityDate),
    daysToMaturity: instrument.asJson.daysToMaturity,
    status: toTitleCase(instrument.asJson.instrumentStatus),
  }));

  const tbillsFiltered = tbills.filter((tbill) => {
    let filtered = true;
    if (filters.stringValueA && !tbill.status.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    if (filters.stringValueB && !tbill.daysToMaturity?.toString().includes(filters.stringValueB)) { filtered = false; }
    return filtered;
  });

  const onBack = () => {
    navigate(`/c/instruments`);
  }

  const onAddNewTreasuryBill = () => {
    store.instruments.treasuryBill.clearSelected();
    showModalFromId(MODAL_NAMES.ADMIN.TREASURY_BILL_MODAL);
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.instruments.treasuryBill.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.instruments.treasuryBill]);

  if (loading) return (
    <LoadingEllipsis />
  )

  return (
    <ErrorBoundary>
      <div className="uk-section uk-section-small settings">
        <div className="uk-container uk-container-expand ">
          <div className="settings-main-card uk-padding">
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
                                <label htmlFor="">Period</label>
                                <select className="uk-select uk-form-small" onChange={(e) => handleFilterChange('stringValueB', e.target.value)}>
                                  <option value="">All</option>
                                  <option value="91">91</option>
                                  <option value="182">182</option>
                                  <option value="273">273</option>
                                  <option value="364">364</option>
                                </select>
                              </div>
                            </div>
                            <div className="uk-grid" data-uk-grid>
                              <div className="uk-width-1-1">
                                <label htmlFor="">Instrument Status</label>
                                <select className="uk-select uk-form-small" onChange={(e) => handleFilterChange('stringValueA', e.target.value)}>
                                  <option value="">All</option>
                                  <option value="pending">Pending</option>
                                  <option value="approved">Approved</option>
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
                  <div>
                    <h4 className="main-title-lg">Treasury Bills</h4>
                    <br />
                    <div className="uk-flex">
                      <button className="btn btn-danger" onClick={onBack}>
                        <FontAwesomeIcon className="uk-margin-small-right" icon={faArrowLeft} />
                        Back
                      </button>
                      <button className="btn btn-primary" onClick={onAddNewTreasuryBill}>Add New</button>
                    </div>
                  </div>
                }
              />
            </div>
            {/** Toolbar ends here */}
            {/** DataTable starts here */}
            <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
              {
                tbillsFiltered &&
                <DataTable columns={columns} data={tbillsFiltered} />
              }
            </div>
            {/** DataTable ends here */}
          </div>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.ADMIN.TREASURY_BILL_MODAL} >
        <TreasuryBillModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.ADMIN.VIEW_TREASURY_BILL_MODAL} >
        <ViewTreasuryBillModal />
      </Modal>
    </ErrorBoundary>
  );

});

export default TreasuryBills;
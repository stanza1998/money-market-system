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
import { dateFormat } from '../../../../../shared/utils/utils';
import { useNavigate } from 'react-router-dom';
import showModalFromId from '../../../../../shared/functions/ModalShow';
import MODAL_NAMES from '../../../../dialogs/ModalName';
import Modal from '../../../../../shared/components/Modal';
import FixedDepositModal from '../../../../dialogs/crud/products/instruments/FixedDepositModal';

const columns: Column[] = [
  { id: 'description', displayText: 'Description' },
  { id: 'issuer', displayText: 'Issuer' },
  { id: 'interest', displayText: 'Interest Rate' },
  { id: 'maturityDate', displayText: 'Maturity Date' },
  { id: 'status', displayText: 'Approval Status' },
];

interface IProductDataTable {
  key: string;
  description: string;
  issuer: string;
  interestRate: number;
  maturityDate: string | null;
  status: string;
}

const FixedDeposits = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const navigate = useNavigate();

  const fixedDeposits: IProductDataTable[] = store.instruments.fixedDeposit.all.map((instrument) => ({
    key: instrument.asJson.id,
    description: instrument.asJson.instrumentName,
    maturityDate: dateFormat(instrument.asJson.maturityDate),
    issuer: instrument.asJson.issuer,
    interestRate: instrument.asJson.interestRate,
    status: instrument.asJson.instrumentStatus,
  }));

  const fixedDepositsFiltered = fixedDeposits.filter((fixedDeposit) => {
    let filtered = true;
    if (filters.stringValueA && !fixedDeposit.status.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  const onBack = () => {
    navigate(`/c/instruments`);
  }

  const onAddNewBond = () => {
    store.instruments.fixedDeposit.clearSelected();
    showModalFromId(MODAL_NAMES.ADMIN.FIXED_DEPOSIT_MODAL);
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.instruments.bond.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.instruments.bond]);

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
                  <h4 className="main-title-lg">Fixed Deposits</h4>
                  <br />
                  <div className="uk-flex">
                    <button className="btn btn-danger" onClick={onBack}>
                      <FontAwesomeIcon className="uk-margin-small-right" icon={faArrowLeft} />
                      Back
                    </button>
                    <button className="btn btn-primary" onClick={onAddNewBond}>Add New</button>
                  </div>
                </div>
              }
            />
          </div>
          {/** Toolbar ends here */}
          {/** DataTable starts here */}
          <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
            {
              fixedDepositsFiltered &&
              <DataTable columns={columns} data={fixedDepositsFiltered} />
            }
          </div>
          {/** DataTable ends here */}
        </div>
      </div>


      <Modal modalId={MODAL_NAMES.ADMIN.FIXED_DEPOSIT_MODAL}>
        <FixedDepositModal/>
      </Modal>
    </ErrorBoundary>
  );

});

export default FixedDeposits;
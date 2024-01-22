// react
import { useState, useEffect } from 'react';

// state management
import { observer } from 'mobx-react-lite';

// custom hooks

// DataTable components
import { DataTable } from './DataTable';
import { Column } from '../../../../../shared/components/react-ts-datatable/DataTableTypes';

import { faArrowLeft, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '../../../../../shared/components/error-boundary/ErrorBoundary';
import { LoadingEllipsis } from '../../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../../shared/functions/AdvancedFilter';
import { useAppContext } from '../../../../../shared/functions/Context';
import showModalFromId from '../../../../../shared/functions/ModalShow';
import MODAL_NAMES from '../../../../dialogs/ModalName';
import EquityModal from '../../../../dialogs/crud/products/instruments/EquityModal';
import Toolbar from '../../../../shared/toolbar/Toolbar';
import Modal from '../../../../../shared/components/Modal';

const columns: Column[] = [
  { id: 'description', displayText: 'Description' },
  { id: 'shareCode', displayText: 'Share Code' },
  { id: 'bloombergCode', displayText: 'Bloomberg Code' },
  { id: 'isin', displayText: 'ISIN' },
  { id: 'status', displayText: 'Approval Status' },
];

interface IProductDataTable {
  key: string;
  description: string;
  shareCode: string;
  bloombergCode: string | null;
  isin: string;
  status: string;
}

const Equities = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const navigate = useNavigate();

  const equities: IProductDataTable[] = store.instruments.equity.all.map((instrument) => ({
    key: instrument.asJson.id,
    description: instrument.asJson.instrumentName,
    shareCode: instrument.asJson.sharecode,
    bloombergCode: instrument.asJson.bloombergCode,
    isin: instrument.asJson.isin,
    status: instrument.asJson.instrumentStatus,
  }));

  const equitiesFiltered = equities.filter((equity) => {
    let filtered = true;
    if (filters.stringValueA && !equity.status.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  const onBack = () =>{
    navigate(`/c/instruments`);
  }

  const onAddNewEquity = () => {
    store.instruments.equity.clearSelected();
    showModalFromId(MODAL_NAMES.ADMIN.EQUITY_MODAL);
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.instruments.equity.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.instruments.equity]);

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
                  <h4 className="main-title-lg">Equities</h4>
                  <br />
                  <div className="uk-flex">
                    <button className="btn btn-danger" onClick={onBack}>
                      <FontAwesomeIcon className="uk-margin-small-right" icon={faArrowLeft} />
                      Back
                    </button>
                    <button className="btn btn-primary" onClick={onAddNewEquity}>Add New</button>
                  </div>
                </div>
              }
            />
          </div>
          {/** Toolbar ends here */}
          {/** DataTable starts here */}
          <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
            {
              equitiesFiltered &&
              <DataTable columns={columns} data={equitiesFiltered} />
            }
          </div>
          {/** DataTable ends here */}
        </div>
      </div>

      <Modal modalId={MODAL_NAMES.ADMIN.EQUITY_MODAL}>
        <EquityModal/>
      </Modal>
    </ErrorBoundary>
  );

});

export default Equities;
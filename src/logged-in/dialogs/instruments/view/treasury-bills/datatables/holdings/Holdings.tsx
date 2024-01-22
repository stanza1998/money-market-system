// react
import { useState, useEffect } from 'react';

// state management
import { observer } from 'mobx-react-lite';

// custom hooks
import { useAppContext } from '../../../../../../../shared/functions/Context';

// DataTable components
import { DataTable } from './DataTable';
import { Column } from '../../../../../../../shared/components/react-ts-datatable/DataTableTypes';

import ErrorBoundary from '../../../../../../../shared/components/error-boundary/ErrorBoundary';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LoadingEllipsis } from '../../../../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../../../../shared/functions/AdvancedFilter';
import Toolbar from '../../../../../../shared/toolbar/Toolbar';
import { currencyFormat } from '../../../../../../../shared/functions/Directives';


const columns: Column[] = [
  { id: 'clientName', displayText: 'Client Name' },
  { id: 'nominal', displayText: 'Nominal' },
  { id: 'tenderRate', displayText: 'Tender Rate' },
  { id: 'clientRate', displayText: 'Client Rate' },
  { id: 'profit', displayText: 'Profit' },
];

interface IHoldingsDataTable {
  key: string;
  clientName: string;
  nominal: string;
  tenderRate: string | null;
  clientRate: number | null;
  profit: string;
}

const Holdings = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const tbills: IHoldingsDataTable[] = store.purchase.treasuryBillAllocation.all.map((instrument) => ({
    key: instrument.asJson.id,
    clientName: instrument.asJson.clientName,
    nominal: currencyFormat(instrument.asJson.newNominal),
    tenderRate: currencyFormat(instrument.asJson.tenderRate),
    clientRate: instrument.asJson.clientRate,
    profit: currencyFormat(instrument.asJson.profit),
  }));

  const tbillsFiltered = tbills.filter((tbill) => {
    let filtered = true;
    if (filters.stringValueA && !tbill.profit.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    if (filters.stringValueB && !tbill.clientRate?.toString().includes(filters.stringValueB)) { filtered = false; }
    return filtered;
  });

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
                      {/* <div className="uk-grid uk-grid-small" data-uk-grid>
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
                      </div> */}
                      <div className="uk-divider-horizontal uk-margin-left" />
                      <button className="btn btn-small btn-danger uk-margin-top" onClick={handleClearFilters}>Clear filters</button>
                    </div>
                  </div>
                </div>
              }
              leftControls={
                <h4 className="main-title-small">Holdings</h4>
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
    </ErrorBoundary>
  );

});

export default Holdings;
// react
import { useState, useEffect } from 'react';

// state management
import { observer } from 'mobx-react-lite';

// custom hooks
import { useAppContext } from '../../../../../shared/functions/Context';

// DataTable components
import { DataTable } from './DataTable';
import { Column } from '../../../../../shared/components/react-ts-datatable/DataTableTypes';


import { faArrowLeftLong, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { useNavigate } from 'react-router';
import React from 'react';
import Modal from '../../../../../shared/components/Modal';
import ErrorBoundary from '../../../../../shared/components/error-boundary/ErrorBoundary';
import { LoadingEllipsis } from '../../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../../shared/functions/AdvancedFilter';
import { dateFormat_YY_MM_DD } from '../../../../../shared/utils/utils';
import MODAL_NAMES from '../../../../dialogs/ModalName';
import TreasuryBillHoldingsModal from '../../../../dialogs/instruments/purchase-processing/ProcessTreasuryBillPurchasesModal';
import Toolbar from '../../../../shared/toolbar/Toolbar';

const columns: Column[] = [
  { id: 'description', displayText: 'Description' },
  { id: 'issueDate', displayText: 'Issue Date' },
  { id: 'maturityDate', displayText: 'Maturity Date' },
  { id: 'daysToMaturity', displayText: 'Period', sortMethod: 'sortNumber' },
  { id: 'dtm', displayText: 'DTM', sortMethod: 'sortNumber' },
  { id: 'status', displayText: 'Status' },
];

interface IProductDataTable {
  key: string;
  description: string;
  issueDate: string;
  maturityDate: string | null;
  daysToMaturity: number | null;
  dtm: number;
  status: string;
}

const PurchaseTreasuryBillsDataTable = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const getDaysToMaturity = (maturityDate: number) => {
    const today = Date.now();
    const difference = maturityDate - today;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const dtm = Math.floor(difference / millisecondsPerDay);

    if (dtm < 0) {
      return 0;
    } else if (dtm <= 14) {
      // return `${dtm} day(s) left (Maturing Soon)`;
      return dtm;
    } else {
      // return `${dtm} days left`;
      return dtm;
    }
  }

  const getDaysToMaturityStatus = (maturityDate: number) => {
    const today = Date.now();
    const difference = maturityDate - today;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const dtm = Math.floor(difference / millisecondsPerDay);

    if (dtm < 0) {
      return "Matured";
    } else if (dtm <= 14) {
      return `${dtm} day(s) left (Maturing Soon)`;

    } else {
      return `${dtm} days left`;
    }
  }



  const tbills: IProductDataTable[] = store.instruments.treasuryBill.all.map((instrument) => ({
    key: instrument.asJson.id,
    description: instrument.asJson.instrumentName,
    issueDate: dateFormat_YY_MM_DD(instrument.asJson.issueDate),
    maturityDate: dateFormat_YY_MM_DD(instrument.asJson.maturityDate),
    daysToMaturity: instrument.asJson.daysToMaturity,
    dtm: getDaysToMaturity(instrument.asJson.maturityDate ? instrument.asJson.maturityDate : 0),
    status: getDaysToMaturityStatus(instrument.asJson.maturityDate ? instrument.asJson.maturityDate : 0),
  }));

  const tbillsFiltered = tbills.filter((tbill) => {
    let filtered = true;
    if (filters.stringValueA && !tbill.status.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
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

  }, [api.instruments.treasuryBill, api.purchase.treasuryBill]);

  if (loading) return (
    <LoadingEllipsis />
  )

  return (
    <ErrorBoundary>

      {/** Toolbar starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        <Toolbar
          // rightControls={
          //   <div className="filter">
          //     <div className="uk-flex">
          //       <button className="btn btn-text btn-small" type="button" data-uk-toggle="target: #offcanvas-flip">Filter <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon> </button>
          //       <button className="btn btn-danger btn-small" onClick={handleClearFilters}>Clear</button>
          //     </div>
          //     <div id="offcanvas-flip" data-uk-offcanvas="flip: true; overlay: true">
          //       <div className="uk-offcanvas-bar">
          //         <button className="uk-offcanvas-close" type="button" data-uk-close></button>
          //         <h3 className="main-title-small">Filter</h3>
          //         <hr />
          //         <div className="uk-grid uk-grid-small" data-uk-grid>
          //           <div className="uk-width-large">
          //             <div className="uk-grid" data-uk-grid>
          //               <div className="uk-width-1-1">
          //                 <label htmlFor="">Instrument Status</label>
          //                 <select className="uk-select uk-form-small" onChange={(e) => handleFilterChange('stringValueA', e.target.value)}>
          //                   <option value="">All</option>
          //                   <option value="pending">Pending</option>
          //                   <option value="approved">Approved</option>
          //                   <option value="allocated">Purchased</option>
          //                   <option value="purchased">Allocated</option>
          //                 </select>
          //               </div>
          //             </div>
          //           </div>
          //         </div>
          //         <div className="uk-divider-horizontal uk-margin-left" />
          //         <button className="btn btn-small btn-danger uk-margin-top" onClick={handleClearFilters}>Clear filters</button>
          //       </div>
          //     </div>
          //   </div>
          // }
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
      <Modal modalId={MODAL_NAMES.ADMIN.TREASURY_BILL_HOLDINGS_MODAL}>
        <TreasuryBillHoldingsModal />
      </Modal>
    </ErrorBoundary>
  );

});

export default PurchaseTreasuryBillsDataTable;
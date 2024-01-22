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

import { LoadingEllipsis } from '../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../shared/functions/AdvancedFilter';

import { useNavigate } from 'react-router-dom';

import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '../../../shared/toolbar/Toolbar';
import { dateFormat_YY_MM_DD } from '../../../../shared/utils/utils';
import Modal from '../../../../shared/components/Modal';
import MODAL_NAMES from '../../../dialogs/ModalName';
import DailyPrincingUploadModal from '../../../dialogs/products/daily-pricing/DailyPrincingUploadModal';

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth();

const columns: Column[] = [
  { id: 'updateDate', displayText: 'Date' },
  { id: 'productCode', displayText: 'Product Code' },
  { id: 'oldRate', displayText: 'Old Rate', sortMethod: 'sortNumber' },
  { id: 'newRate', displayText: 'New Rate', sortMethod: 'sortNumber' },
];

interface IProductDailyPricingDataTable {
  key: string;
  productCode: string;
  oldRate: number;
  newRate: number;
  updateDate: string;
}

const Products = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const navigate = useNavigate();

  const pricing = store.productDailyPricing.all;

  const pricingList: IProductDailyPricingDataTable[] = pricing.map((pricing) => ({
    key: pricing.asJson.id,
    productCode: pricing.asJson.productCode,
    oldRate: pricing.asJson.oldRate,
    newRate: pricing.asJson.newRate,
    updateDate: dateFormat_YY_MM_DD(pricing.asJson.priceUpdateDate)

  }));

  const pricingFiltered = pricingList.filter((tbill) => {
    let filtered = true;
    return filtered;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.productDailyPricing.getAll(year.toString(), month.toString());
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.productDailyPricing]);

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
          //                 <label htmlFor="">Period</label>
          //                 <select className="uk-select uk-form-small" onChange={(e) => handleFilterChange('stringValueB', e.target.value)}>
          //                   <option value="">All</option>
          //                   <option value="91">91</option>
          //                   <option value="182">182</option>
          //                   <option value="273">273</option>
          //                   <option value="364">364</option>
          //                 </select>
          //               </div>
          //             </div>
          //             <div className="uk-grid" data-uk-grid>
          //               <div className="uk-width-1-1">
          //                 <label htmlFor="">Instrument Status</label>
          //                 <select className="uk-select uk-form-small" onChange={(e) => handleFilterChange('stringValueA', e.target.value)}>
          //                   <option value="">All</option>
          //                   <option value="pending">Pending</option>
          //                   <option value="approved">Approved</option>
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
          // leftControls={
          //   <h4 className="main-title-small">Daily Pricing History</h4>
          // }
        />
      </div>
      {/** Toolbar ends here */}
      {/** DataTable starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        {
          pricingFiltered &&
          <DataTable columns={columns} data={pricingFiltered} />
        }
      </div>
      {/** DataTable ends here */}
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.UPLOAD_DAILY_PRICING_MODAL}>
        <DailyPrincingUploadModal />
      </Modal>
    </ErrorBoundary>
  );
});

export default Products;
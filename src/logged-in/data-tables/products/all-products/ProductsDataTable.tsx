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
import MODAL_NAMES from '../../../dialogs/ModalName';
import { faFilter, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '../../../shared/toolbar/Toolbar';
import Modal from '../../../../shared/components/Modal';
import ProductModal from '../../../dialogs/crud/products/ProductModal';
import DailyPrincingUploadModal from '../../../dialogs/products/daily-pricing/DailyPrincingUploadModal';

const columns: Column[] = [
  { id: 'productCode', displayText: 'Product Code' },
  { id: 'productName', displayText: 'Product Name' },
  // { id: 'description', displayText: 'Description' },
  { id: 'baseRate', displayText: 'Base Rate', sortMethod: 'sortNumber' },
];

interface IProductDataTable {
  key: string;
  productCode: string;
  productName: string;
  productDescription: string;
  baseRate: number;
}

const ProductsDataTable = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const navigate = useNavigate();

  const products = store.product.all;

  const productsList: IProductDataTable[] = products.map((product) => ({
    key: product.asJson.id,
    productCode: product.asJson.productCode,
    productName: product.asJson.productName,
    productDescription: product.asJson.productDescription,
    baseRate: product.asJson.baseRate
  }));

  const productsFiltered = productsList.filter((tbill) => {
    let filtered = true;
    return filtered;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.product.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.product]);

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
          //   <h4 className="main-title-small"><FontAwesomeIcon icon={faThLarge} />  Product List</h4>
          // }
        />
      </div>
      {/** Toolbar ends here */}
      {/** DataTable starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1  uk-card uk-card-default uk-card-body" data-uk-grid >
        {
          productsFiltered &&
          <DataTable columns={columns} data={productsFiltered} />
        }
      </div>
      {/** DataTable ends here */}
      <Modal modalId={MODAL_NAMES.ADMIN.PRODUCT_MODAL}>
        <ProductModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.UPLOAD_DAILY_PRICING_MODAL}>
        <DailyPrincingUploadModal />
      </Modal>

    </ErrorBoundary>
  );
});

export default ProductsDataTable;
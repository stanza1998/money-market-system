import { useTable } from 'react-ts-datatable';
import { Column } from '../../../../shared/components/react-ts-datatable/DataTableTypes';
import { Select, Filter, Summary, Pagination } from '../../../../shared/components/react-ts-datatable';
import { Table } from '.';
import Toolbar from '../../../shared/toolbar/Toolbar';
import showModalFromId from '../../../../shared/functions/ModalShow';
import MODAL_NAMES from '../../../dialogs/ModalName';
import { LegalEntityGrid } from './legalEntityGrid/LegalEntityGrid';
import { useAppContext } from '../../../../shared/functions/Context';

interface DataTableProps {
  columns: Column[];
  data: any[];
  options?: number[];
}

export const DataTable = ({
  columns,
  data,
  options = [10, 20, 50, 100],
}: DataTableProps) => {
  const {
    headers,
    rows,
    pagination,
    summary,
    isFiltered,
    handleSorting,
    handlePageSizing,
    handleFiltering,
    handlePageChange,
  } = useTable({ columns, data, pageSizeOptions: options });

  const newEntity = () => {
    showModalFromId(MODAL_NAMES.ADMIN.ENTITY_TYPE_MODAL);
  };
  const {store} = useAppContext();
  const user = store.auth.meJson;
  const hasClientOnBoardingPermission = user?.feature.some((feature)=> feature.featureName === "Client On-Boarding" && feature.create === true);

  return (
    <div className="data-table">
      <Toolbar
        // rightControls={
        //   <div className="uk-width-1-1 uk-flex" data-uk-grid>
        //     <div className="uk-width-1-2">
        //       <Select options={options} handlePageSizing={handlePageSizing} />
        //     </div>
        //     <div className="uk-width-1-2">
        //       <Filter handleFiltering={handleFiltering} />
        //     </div>
        //   </div>
        // }
        leftControls={
         
          <div>
         {hasClientOnBoardingPermission && <>    <button className="btn btn-primary" onClick={newEntity} type="button" >
              <span data-uk-icon="icon: user-plus-circle; ratio:.8"></span>{" "}
            On-Boarding (Offline)
            </button>
            <button className="btn btn-primary" onClick={newEntity} type="button" disabled>
              <span data-uk-icon="icon: user-plus-circle; ratio:.8"></span>{" "}
             On-Boarding (DocFox)
            </button>
            <button className="btn btn-text" onClick={newEntity} type="button" >
              <span data-uk-icon="icon: user-plus-circle; ratio:.8"></span>{" "}
              Import
            </button></>}
            {/* <h4 className="main-title-small">Client List</h4> */}
        
          </div>
        }
      />
      {/* <Table
        headers={headers}
        rows={rows}
        isFiltered={isFiltered}
        handleSorting={handleSorting}
      />
      <Summary {...summary} />
      <Pagination pagination={pagination} handlePageChange={handlePageChange} /> */}
      <div style={{marginTop:"6px"}}></div>
      <LegalEntityGrid data={data}/>
    </div>
  );
};

export default DataTable;
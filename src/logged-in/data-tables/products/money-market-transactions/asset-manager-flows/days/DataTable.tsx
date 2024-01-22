import { useTable } from 'react-ts-datatable';
import { Column } from '../../../../../../shared/components/react-ts-datatable/DataTableTypes';
import { Select, Filter, Summary, Pagination } from '../../../../../../shared/components/react-ts-datatable';
import { Table } from '.';
import Toolbar from '../../../../../shared/toolbar/Toolbar';
import React from 'react';

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

  return (
    <div className="data-table">
      <Toolbar
        rightControls={
          <div className="uk-width-1-1 uk-flex" data-uk-grid>
            <div className="uk-width-1-2">
              <Select options={options} handlePageSizing={handlePageSizing} />
            </div>
            <div className="uk-width-1-2">
              <Filter handleFiltering={handleFiltering} />
            </div>
          </div>
        }
      />
      <Table
        headers={headers}
        rows={rows}
        isFiltered={isFiltered}
        handleSorting={handleSorting}
      />
      <Summary {...summary} />
      <Pagination pagination={pagination} handlePageChange={handlePageChange} />
    </div>
  );
};

export default DataTable;
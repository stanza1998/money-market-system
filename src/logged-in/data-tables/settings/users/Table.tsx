import { TableBody, TableHeader } from '.';
import { HandleSorting, Header, Row } from '../../../../shared/components/react-ts-datatable/DataTableTypes';

interface TableProps {
  headers: Header[];
  rows: Row[];
  isFiltered: boolean;
  handleSorting: HandleSorting;
}

export const Table = ({
  headers,
  rows,
  isFiltered,
  handleSorting,
}: TableProps) => {
  return (
    <table className="uk-table uk-table-small uk-table-divider kit-table uk-width-1-1" >
      <TableHeader headers={headers} handleSorting={handleSorting} />
      <TableBody rows={rows} length={headers.length} isFiltered={isFiltered} />
    </table>
  );
};

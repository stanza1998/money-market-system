import { HandleSorting, Header } from "../../../../shared/components/react-ts-datatable/DataTableTypes";

interface TableHeaderProps {
  headers: Header[];
  handleSorting: HandleSorting;
}

export const TableHeader = ({ headers, handleSorting }: TableHeaderProps) => {
  const handleSortingEvent = ({ id, isSorted, sortingDirection }: Header) => {
    if (isSorted) {
      handleSorting({
        id,
        direction:
          sortingDirection === 'ascending' ? 'descending' : 'ascending',
      });
    } else {
      handleSorting({ id, direction: 'descending' });
    }
  };

  return (
    <thead className="">
      <tr className="table-row">
        {headers.map((header) => (
          <th
            key={header.id}
            className={
              header.isSorted ? `sortable ${header.sortingDirection}` : ''
            }
            onClick={() => handleSortingEvent(header)}
          >
            {header.displayText}
          </th>
        ))}
        <th className="not-sortable">
        </th>
      </tr>
    </thead>
  );
};
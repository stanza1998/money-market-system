import { Row } from "../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";



interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
}

export const TableBody = observer(({ rows, length, isFiltered }: TableBodyProps) => {
  const hasNoData = rows.length === 0 && !isFiltered;
  const hasNoFilteredData = rows.length === 0 && isFiltered;

  return (
    <ErrorBoundary>
      <tbody>
        {hasNoData && (
          <tr>
            <td colSpan={length} className="empty">
              No data available in table
            </td>
          </tr>
        )}
        {hasNoFilteredData && (
          <tr>
            <td colSpan={length} className="empty">
              No matching records found
            </td>
          </tr>
        )}
        {rows.map(({ data, key }) => (
          <tr className="custom-table-row" key={key}>
            {data.map(({ cellValue, key, isSorted }) => (
              <td key={key} className={isSorted ? 'sorted' : ''}>
                {cellValue as string}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </ErrorBoundary>
  );
});
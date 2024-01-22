import { Row } from "../../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../dialogs/ModalName";

interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
}

export const TableBody = observer(({ rows, length, isFiltered }: TableBodyProps) => {
  const hasNoData = rows.length === 0 && !isFiltered;
  const hasNoFilteredData = rows.length === 0 && isFiltered;
  const { store } = useAppContext();

  const onViewMore = (transactionId: string) => {
    const selectedclient = store.switch.getItemById(transactionId);
    
    if(selectedclient){
      store.switch.select(selectedclient.asJson);
      // showModalFromId(MODAL_NAMES.ADMIN.VIEW_NATURAL_PERSON_MODAL);
    }
  }

  return (
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
  );
});
import { Row } from "../../../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../../shared/functions/Context";
import showModalFromId from "../../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../../dialogs/ModalName";
import swal from "sweetalert";

interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
}

export const TableBody = observer(({ rows, length, isFiltered }: TableBodyProps) => {
  const { api, store } = useAppContext();
  const hasNoData = rows.length === 0 && !isFiltered;
  const hasNoFilteredData = rows.length === 0 && isFiltered;

  const onAllocateTransaction = (transactionId: string) => {
    const selectedTransaction = store.clientDepositAllocation.getItemById(transactionId);
    if (selectedTransaction) {
      store.clientDepositAllocation.select(selectedTransaction.asJson);
      showModalFromId(MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.ALLOCATE_TRANSACTION_MODAL);
    }
  }

  // const onDeleteTransaction = async (transactionId: string) => {
  //   const selectedTransaction = store.clientDepositAllocation.getItemById(transactionId);
  //   if (selectedTransaction) {
  //     await api.clientDepositAllocation.delete(selectedTransaction.asJson);
  //   } else {
  //     swal({
  //       text: ""
  //     })
  //   }
  // }

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
          <td>
            <button className="btn btn-text" onClick={() => onAllocateTransaction(key)}>
              allocate
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
});
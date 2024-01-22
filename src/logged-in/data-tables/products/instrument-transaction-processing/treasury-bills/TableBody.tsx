import { Row } from "../../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import { useNavigate } from "react-router-dom";


interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
}

export const TableBody = observer(({ rows, length, isFiltered }: TableBodyProps) => {
  const hasNoData = rows.length === 0 && !isFiltered;
  const hasNoFilteredData = rows.length === 0 && isFiltered;
  const { store } = useAppContext();


  const onNavigate = useNavigate();

  const hasExecutionFile = (instrumentId: string) => {
    const selectedInstrument = store.instruments.treasuryBill.getItemById(instrumentId);
    if (selectedInstrument) {
      if (store.purchase.treasuryBill.getItemById(instrumentId)) {
        return true;
      }
    }
    else {
      return false;
    }
  }

  const onProcess = async (key: string) => {
    const treasuryBill = store.purchase.treasuryBill.getItemById(key);

    if (treasuryBill) {
      store.purchase.treasuryBill.select(treasuryBill.asJson);
      // showModalFromId(MODAL_NAMES.BACK_OFFICE.TREASURY_BILL_PURCHASE_PROCESSING_MODAL);
      onNavigate(`/c/purchases/processing/${treasuryBill.asJson.id}`)
    }
  };

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
          <td className="uk-text-right">
            <button className="btn btn-primary uk-margin-small-left" onClick={() => onProcess(key)}>
              Process
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
});
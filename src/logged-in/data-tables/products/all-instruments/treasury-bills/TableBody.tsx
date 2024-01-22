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
  const { api, store } = useAppContext();

  const canApprove = (key: string) => {
    const item = store.instruments.treasuryBill.getItemById(key);
    if (item && item.asJson.instrumentStatus === "pending") {
      return true
    } else {
      return false
    }
  }

  const canDelete = (key: string) => {
    const item = store.instruments.treasuryBill.getItemById(key);
    if (item && item.asJson.instrumentStatus !== "approved") {
      return true
    } else {
      return false
    }
  }

  const onApprove = async (key: string) => {
    const treasuryBill = store.instruments.treasuryBill.getItemById(key);
    if (treasuryBill) {
      store.instruments.treasuryBill.select(treasuryBill.asJson);
      treasuryBill.asJson.instrumentStatus = "approved";
      try {
        await api.instruments.treasuryBill.update(treasuryBill.asJson);
      } catch (error) {
      }
    }
  };

  const onView = (treasuryBillId: string) => {
    const selectedTreasuryBill = store.instruments.treasuryBill.getItemById(treasuryBillId);

    if (selectedTreasuryBill) {
      store.instruments.treasuryBill.select(selectedTreasuryBill.asJson);
      showModalFromId(MODAL_NAMES.ADMIN.VIEW_TREASURY_BILL_MODAL);
    }
  }

  const onEdit = (treasuryBillId: string) => {
    const selectedTreasuryBill = store.instruments.treasuryBill.getItemById(treasuryBillId);

    if (selectedTreasuryBill) {
      store.instruments.treasuryBill.select(selectedTreasuryBill.asJson);
      showModalFromId(MODAL_NAMES.ADMIN.TREASURY_BILL_MODAL);
    }
  }

  const onDelete = async (treasuryBillId: string) => {
    const selectedTreasuryBill = store.instruments.treasuryBill.getItemById(treasuryBillId);

    if (selectedTreasuryBill) {
      await api.instruments.treasuryBill.delete(selectedTreasuryBill.asJson)
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
          <td className="uk-text-right">
            {
              canApprove(key) &&
              <button className="btn btn-primary uk-margin-small-left" onClick={() => onApprove(key)}>
                Approve
              </button>
            }
            <button className="btn btn-primary uk-margin-small-left" onClick={() => onView(key)}>
              View
            </button>
            <button className="btn btn-text uk-margin-small-left" onClick={() => onEdit(key)}>
              Edit
            </button>
            {
              canDelete(key) &&
              <button className="btn btn-danger uk-margin-small-left" onClick={() => onDelete(key)}>
                Delete
              </button>
            }
          </td>
        </tr>
      ))}
    </tbody>
  );
});
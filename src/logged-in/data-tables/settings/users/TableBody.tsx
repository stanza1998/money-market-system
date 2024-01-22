import { Row } from "../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../dialogs/ModalName";


interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
}

export const TableBody = observer(({ rows, length, isFiltered }: TableBodyProps) => {
  const hasNoData = rows.length === 0 && !isFiltered;
  const hasNoFilteredData = rows.length === 0 && isFiltered;
  const { api, store } = useAppContext();


  const onEdit = (userId: string) => {
    const selectedUser = store.user.getItemById(userId);

    if (selectedUser) {
      store.user.select(selectedUser.asJson);
      showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL);
    }
  }

  const onDisable = async (userId: string) => {
    const selectedUser = store.user.getItemById(userId);

    if (selectedUser) {
      // await api.user.delete(selectedUser.asJson)
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
            <button className="btn btn-text uk-margin-small-left" onClick={() => onEdit(key)}>
              Edit
            </button>
            <button className="btn btn-danger uk-margin-small-left" onClick={() => onDisable(key)}>
              Disable
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
});
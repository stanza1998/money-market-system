import { Row } from "../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../dialogs/ModalName";
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

  const onNavigate= useNavigate();

  const onView = (clientId: string) => {
    const selectedclient = store.client.naturalPerson.getItemById(clientId);
    
    if(selectedclient){
      store.client.naturalPerson.select(selectedclient.asJson);
      onNavigate(`/c/clients/natural-person/${clientId}`)
    }
  }

  const onEdit = (clientId: string) => {
    const selectedclient = store.client.naturalPerson.getItemById(clientId);

    if (selectedclient) {
      store.client.naturalPerson.select(selectedclient.asJson);
      showModalFromId(MODAL_NAMES.ADMIN.NATURAL_PERSON_MODAL);
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
            <button className="btn btn-primary uk-margin-small-left" onClick={() => onView(key)}>
              view
            </button>
            <button className="btn btn-text uk-margin-small-left" onClick={() => onEdit(key)}>
              edit
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
});
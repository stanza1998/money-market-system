import { Row } from "../../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import React from "react";

interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
}

export const TableBody = observer(({ rows, length, isFiltered }: TableBodyProps) => {
  const hasNoData = rows.length === 0 && !isFiltered;
  const hasNoFilteredData = rows.length === 0 && isFiltered;
  const { store } = useAppContext();

  const onEditTransaction = (clientId: string) => {
    const selectedClient = store.clientWithdrawalPayment.getItemById(clientId);
    
    if(selectedClient){
      store.clientWithdrawalPayment.select(selectedClient.asJson);
      showModalFromId(MODAL_NAMES.BACK_OFFICE.EDIT_WITHDRAWAL_MODAL);
    }
  }

  const onVerifyTransaction = (clientId: string) => {
    const selectedClient = store.clientWithdrawalPayment.getItemById(clientId);
    
    if(selectedClient){
      store.clientWithdrawalPayment.select(selectedClient.asJson);
      showModalFromId(MODAL_NAMES.BACK_OFFICE.AUTHORIZE_WITHDRAWAL_MODAL);
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
            <button className="btn btn-text uk-margin-small-left" onClick={() => onEditTransaction(key)}>
              edit
            </button>
            <button className="btn btn-primary uk-margin-small-left" onClick={() => onVerifyTransaction(key)}>
              verify
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
});
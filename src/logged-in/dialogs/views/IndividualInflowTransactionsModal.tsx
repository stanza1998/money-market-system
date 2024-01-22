import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";
import { hideModalFromId } from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../ModalName";
import TransactionInflowModel  from "../../../shared/models/TransactionInflowModel";

interface IProps{
  transactions: TransactionInflowModel[];
}

const IndividualInflowTransactionsModal = observer((props: IProps) => {

  const {transactions} = props;

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.INFLOWS.INDIVIDUAL_INFLOW_TRANSACTIONS_MODAL);
  };

  return (
    <div className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title text-to-break">Individual (Inflow Transactions)</h3>
      <div className="dialog-content uk-position-relative">
        <table className="uk-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Bank</th>
            </tr>
          </thead>
          <tbody>
            {
              transactions.map((transaction, index:number)=>(
                <tr key={transaction.asJson.id}>
                  <td>{index+1}</td>
                  <td>{transaction.asJson.transactionDate}</td>
                  <td>{transaction.asJson.amount}</td>
                  <td>{transaction.asJson.bank}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default IndividualInflowTransactionsModal;

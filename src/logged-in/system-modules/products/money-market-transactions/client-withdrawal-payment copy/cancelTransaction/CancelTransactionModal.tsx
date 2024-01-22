import swal from "sweetalert";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../../shared/functions/Context";
import {
  IClientWithdrawalPayment,
  defaultClientWithdrawalPayment,
} from "../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../shared/utils/utils";
import { currencyFormat } from "../../../../../../shared/functions/Directives";
import { cancelWithdrawalTransaction } from "../../../../../../shared/functions/MyFunctions";
import { hideModalFromId } from "../../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../../dialogs/ModalName";

export const CancelTransactionModal = observer(() => {
  const { store, api } = useAppContext();
  const [comment, setComment] = useState("");
  const [transaction, setTransaction] = useState<IClientWithdrawalPayment>({
    ...defaultClientWithdrawalPayment,
  });
  const [loading, setLoading] = useState(false);

  const cancelTransaaction = async () => {
    if (comment !== "") {
      swal({
        title: "Are you sure?",
        text: "You are about to revert this transaction",
        icon: "warning",
        buttons: ["Cancel", "Proceed"],
        dangerMode: true,
      }).then(async (edit) => {
        if (edit) {
          try {
            setLoading(true);
            await cancelWithdrawalTransaction(
              store,
              api,
              "From Authorised Tab",
              transaction.id || "",
              comment
            );
          } catch (error) {
            console.log(error);
          } finally {
            alert(`Transaction is successfully cancelled`);
            setLoading(false);
            hideModalFromId(MODAL_NAMES.ADMIN.CANCEL_TRANSACTION_MODAL);
          }
        } else {
          swal({
            icon: "error",
            text: "Transaction transaction reverted successfully!",
          });
        }
      });
    } else {
      alert("Please provide a reason for cancellation");
    }
  };

  useEffect(() => {
    if (store.clientWithdrawalPayment.selected) {
      setTransaction(store.clientWithdrawalPayment.selected);
    }
  }, [store.clientWithdrawalPayment.selected]);

  return (
    <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2">
      <button
        className="uk-modal-close-default"
        // disabled={loading}
        type="button"
        data-uk-close
      ></button>
      <div className="uk-margin">
        <h3 className="main-title-small text-to-break">Transaction Details</h3>
        <p className="main-title-small text-to-break">
          Transaction Date:{" "}
          {dateFormat_YY_MM_DD_NEW(transaction.transactionDate)} <br />
          Value Date: {dateFormat_YY_MM_DD_NEW(transaction.valueDate)} <br />
          reference: {transaction.reference} <br />
          description: {transaction.description} <br />
          Amount: {currencyFormat(transaction.amount)} <br />
        </p>
      </div>
      <div className="uk-margin">
        <hr />
      </div>
      <div className="uk-margin">
        <div className="uk-margin">
          <label>
            <p
              className="main-title-small text-to-break"
              style={{ fontSize: "12px" }}
            >
              Reason For cancelling transaction
            </p>
          </label>
        </div>
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="uk-input"
            placeholder="Comment..."
          />
        </div>
      </div>
      <div className="uk-margin">
        <hr />
      </div>
      <div className="uk-margin">
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={cancelTransaaction}
        >
          Start Cancellation{" "}
          {loading && <div data-uk-spinner={"ratio: .5"}></div>}
        </button>
      </div>
    </div>
  );
});

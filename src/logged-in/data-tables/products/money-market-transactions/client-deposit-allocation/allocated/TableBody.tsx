import { Row } from "../../../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../../shared/functions/Context";
import showModalFromId from "../../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../../dialogs/ModalName";
import swal from "sweetalert";
import { IMoneyMarketAccount } from "../../../../../../shared/models/MoneyMarketAccount";
import { ITransactionInflow } from "../../../../../../shared/models/TransactionInflowModel";
import { dateFormat_YY_MM_DD } from "../../../../../../shared/utils/utils";
import React from "react";

interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
}

export const TableBody = observer(
  ({ rows, length, isFiltered }: TableBodyProps) => {
    const { api, store } = useAppContext();
    const hasNoData = rows.length === 0 && !isFiltered;
    const hasNoFilteredData = rows.length === 0 && isFiltered;

    const user = store.auth.meJson?.uid;

    const mmAccounts = store.mma.all;

    const onEditTransaction = (transactionId: string) => {
      const selectedTransaction =
        store.clientDepositAllocation.getItemById(transactionId);

      if (selectedTransaction) {
        store.clientDepositAllocation.select(selectedTransaction.asJson);
        showModalFromId(
          MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.EDIT_TRANSACTION_MODAL
        );
      } else {
        swal({
          text: "",
        });
      }
    };

    const onhandleTransactionVerification = async (transactionId: string) => {
      const transaction =
        store.clientDepositAllocation.getItemById(transactionId);

      if (transaction) {
        store.clientDepositAllocation.select(transaction.asJson);
        showModalFromId(MODAL_NAMES.BACK_OFFICE.RECORD_UPLOAD_MODAL);
      } else {
        swal({
          text: "",
        });
      }
    };

    // const handleTransactionVerification = async (transactionId: string) => {
    //   const transaction =
    //     store.clientDepositAllocation.getItemById(transactionId);
    //     console.log(transaction?.asJson)
    //   if (transaction) {
    //     swal({
    //       title: "Are you sure?",
    //       icon: "warning",
    //       buttons: ["Cancel", "Verify"],
    //       dangerMode: true,
    //     }).then(async (edit) => {
    //       if (edit) {
    //         // update transaction to verified
    //         transaction.asJson.transactionStatus = "verified";
    //          console.log(
    //            "Transaction status updated:",
    //            transaction.asJson.transactionStatus
    //          );
    //         await api.clientWithdrawalPayment.update(transaction.asJson);

    //         const account = mmAccounts.find(
    //           (account) =>
    //             account.asJson.accountNumber === transaction.asJson.allocation
    //         );

    //         if (account) {
    //           const newBalance =
    //             account.asJson.balance + transaction.asJson.amount;

    //           // update balance in MM account
    //           const accountUpdate: IMoneyMarketAccount = {
    //             id: account.asJson.id,
    //             parentEntity: account.asJson.parentEntity,
    //             accountNumber: account.asJson.accountNumber,
    //             accountName: account.asJson.accountName,
    //             accountType: account.asJson.accountType,
    //             feeRate: account.asJson.feeRate,
    //             cession: account.asJson.cession,
    //             displayOnEntityStatement:
    //               account.asJson.displayOnEntityStatement,
    //             balance: newBalance,
    //             status: "Active",
    //           };

    //           try {
    //             await api.mma.update(accountUpdate);
    //           } catch (error) {}

    //           //record as outflow
    //           const inflow: ITransactionInflow = {
    //             id: "",
    //             transactionDate: dateFormat_YY_MM_DD(
    //               transaction.asJson.transactionDate
    //             ),
    //             amount: transaction.asJson.amount,
    //             bank: transaction.asJson.bank,
    //             product: accountUpdate.accountType,
    //           };

    //           try {
    //             await api.inflow.create(inflow);
    //           } catch (error) {}

    //           // log the transaction in the MM account as a deposit
    //           try {
    //             await api.mma.createWithdrawalTransaction(
    //               account.asJson.id,
    //               transaction.asJson
    //             );
    //           } catch (error) {}
    //         }
    //         swal({
    //           icon: "success",
    //           text: "Transaction has been verified",
    //         });
    //       }
    //     });
    //   }
    // };

    const canVerify = (transactionId: string) => {
      const selectedTransaction =
        store.clientDepositAllocation.getItemById(transactionId);
      if (selectedTransaction) {
        if (store.clientDepositAllocation.getItemById(transactionId)) {
          if (selectedTransaction.asJson.transactionStatus !== "verified") {
            return true;
          }
        }
      } else {
        return false;
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
              <td key={key} className={isSorted ? "sorted" : ""}>
                {cellValue as string}
              </td>
            ))}
            <td>
              {canVerify(key) && (
                <button
                  className="btn btn-primary"
                  onClick={() => onEditTransaction(key)}
                >
                  edit
                </button>
              )}
              {!canVerify(key) && (
                <button className="btn btn-primary" disabled>
                  edit
                </button>
              )}

              {canVerify(key) && (
                <button
                  className="btn btn-primary"
                  onClick={() => onhandleTransactionVerification(key)}
                >
                  verify
                </button>
              )}
              {!canVerify(key) && (
                <button className="btn btn-primary" disabled>
                  verify
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    );
  }
);

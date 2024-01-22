import swal from "sweetalert";
import "./../Batches.scss";
import { observer } from "mobx-react-lite";
import { Box, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IClientWithdrawalPayment } from "../../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import Toolbar from "../../../../../../shared/toolbar/Toolbar";
import { useAppContext } from "../../../../../../../shared/functions/Context";
import {
  batchTransactionRevert,
  getAllocatedBy,
} from "../../../../../../../shared/functions/MyFunctions";
import { currencyFormat } from "../../../../../../../shared/functions/Directives";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../../shared/utils/utils";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DangerousIcon from "@mui/icons-material/Dangerous";
import HistoryIcon from "@mui/icons-material/History";
import { IBatches } from "../../../../../../../shared/models/batches/BatchesModel";
import { useState } from "react";
import { LoadingEllipsis } from "../../../../../../../shared/components/loading/Loading";

import { PaymentTransactions, generateTextFile } from "../../../../../../../shared/functions/PaymentFileGenerator";
import { getElementAtIndex, padNumberStringWithZero } from "../../../../../../../shared/functions/StringFunctions";

interface IProp {
  data: IClientWithdrawalPayment[];
  batch: IBatches;
}

export const BatchTransactions = observer(({ data, batch }: IProp) => {
  const { store, api } = useAppContext();
  const [loading, setLoading] = useState(false);

  const batchStatusSuccess = async (transactionId: string, status: string) => {
    swal({
      title: "Are you sure?",
      text: "You are about to mark the transaction as successful",
      icon: "warning",
      buttons: ["Cancel", "Proceed"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        try {
          await api.batches.updateBatchTransactionStatus(
            batch,
            transactionId,
            status
          );

          await api.clientWithdrawalPayment.updateProcessStatus(transactionId);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      } else {
        swal({
          icon: "error",
          text: "Transaction marked as successful!",
        });
      }
    });
  };
  const batchStatusFailed = async (transactionId: string, status: string) => {
    swal({
      title: "Are you sure?",
      text: "You are about to mark the transaction as Failed",
      icon: "warning",
      buttons: ["Cancel", "Proceed"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        try {
          await api.batches.updateBatchTransactionStatus(
            batch,
            transactionId,
            status
          );

          await api.clientWithdrawalPayment.updateProcessStatus(transactionId);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      } else {
        swal({
          icon: "error",
          text: "Transaction marked as Failed!",
        });
      }
    });
  };

  const revertTransaction = async (transactionId: string) => {
    swal({
      title: "Are you sure?",
      text: "You are about to revert this transaction",
      icon: "warning",
      buttons: ["Cancel", "Proceed"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        try {
          await batchTransactionRevert(api, store, transactionId, batch, data);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      } else {
        swal({
          icon: "error",
          text: "Transaction transaction reverted successfully!",
        });
      }
    });
  };

  const columns: GridColDef[] = [
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      width: 200,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return dateFormat_YY_MM_DD_NEW(params.row.transactionDate);
      },
    },
    {
      field: "bank",
      headerName: "Bank",
      width: 200,
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 200,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return currencyFormat(params.row.amount);
      },
    },
    {
      field: "reference",
      headerName: "Reference",
      width: 200,
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "allocation",
      headerName: "Allocated To",
      width: 200,
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "allocatedBy",
      headerName: "Allocated By",
      width: 200,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const person = getAllocatedBy(params.row.allocatedBy, store);
        return person;
      },
    },
    {
      field: "batchTransactionStatus",
      headerName: "Status",
      width: 200,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        if (
          !params.row.batchTransactionStatus ||
          params.row.batchTransactionStatus === ""
        ) {
          return "pending";
        } else {
          return params.row.batchTransactionStatus;
        }
      },
      cellClassName: (params) => {
        const status = params.value || "pending";
        switch (status) {
          case "pending":
            return "blue-background-batch";
          case "failed":
            return "red-background-batch";
          case "success":
            return "green-background-batch";
          default:
            return "";
        }
      },
    },

    {
      field: "Option",
      headerName: "Option",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <>
          {loading ? (
            <LoadingEllipsis />
          ) : (
            <>
              <IconButton
                data-uk-tooltip="Mark as Success"
                onClick={() => batchStatusSuccess(params.row.id, "success")}
                disabled={params.row.batchTransactionStatus === "failed"}
              >
                <CheckCircleIcon />
              </IconButton>
              <IconButton
                data-uk-tooltip={
                  params.row.batchTransactionStatus === "success"
                    ? "Cannot Fail"
                    : "Mark as Fail"
                }
                onClick={() => batchStatusFailed(params.row.id, "failed")}
                disabled={params.row.batchTransactionStatus === "success"}
              >
                <DangerousIcon />
              </IconButton>
              <IconButton
                data-uk-tooltip={
                  params.row.batchTransactionStatus === "success"
                    ? "Cannot Revert"
                    : "Revert Transaction"
                }
                disabled={params.row.batchTransactionStatus === "success"}
                onClick={() => revertTransaction(params.row.id)}
              >
                <HistoryIcon />
              </IconButton>

            </>
          )}
        </>
      ),
    },
  ];

  const assignUniversalBranchCode = (bankName: string): string => {
    const lowerBankName = bankName.toLowerCase();

    if (lowerBankName.trim() === "first national bank" || lowerBankName === "fnb") {
      return "280172";
    } else if (lowerBankName.trim() === "bank windhoek") {
      return "482372";
    } else if (lowerBankName.trim() === "standard bank") {
      return "087373";
    } else if (lowerBankName.trim() === "nedbank") {
      return "	461609";
    } else {
      return "Unknown bank.";
    }
  }

  const transactions: PaymentTransactions[] = data.map((transaction, index) => ({
    transactionSubBatchNumber: padNumberStringWithZero(index.toString(), 3),
    transactionReferenceNumber: transaction.reference.trim(),
    branchNumber: assignUniversalBranchCode(getElementAtIndex(transaction.bank, 0)).trim(),
    accountNumber: getElementAtIndex(transaction.bank, 2).trim(),
    accountName: getElementAtIndex(transaction.bank, 1).trim(),
    amount: transaction.amount,
    statementReference: `IJG${index}`.trim(),
    paymentAlertDestinationType: "E",
    paymentAlertDestination: "",
  }));

  console.log("Transactions", transactions);


  const handleGenerateFile = () => {
    if (transactions) {
      generateTextFile(transactions);
    }else{
      swal({
        icon:'error',
        text: 'No transactions to Export!'
      })
    }

  };

  return (
    <div className="grid">

      <Toolbar
        rightControls={
          <button className="btn btn-primary" onClick={handleGenerateFile}>Download Payment File</button>
        }
        leftControls={
          <h5 style={{ fontSize: "12px" }} className="main-title-small">
            Batch Transactions
          </h5>
        }
      />
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id} // Use the appropriate identifier property
          rowHeight={50}
        />
      </Box>
    </div>
  );
});

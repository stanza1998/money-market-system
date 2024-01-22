import "./AllocatedTransaction.scss";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../shared/utils/utils";
import { observer } from "mobx-react-lite";
import React from "react";
import { IClientWithdrawalPayment } from "../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { Box, IconButton } from "@mui/material";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { DataGrid, GridCheckCircleIcon, GridColDef } from "@mui/x-data-grid";
import { currencyFormat } from "../../../../../../shared/functions/Directives";
import EditIcon from "@mui/icons-material/Edit";
import {
  getAllocatedBy,
  getMMADocId,
  getTimeAllocated,
  onEditTransactionWithdrawal,
  onVerify,
} from "../../../../../../shared/functions/MyFunctions";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface IProp {
  data: IClientWithdrawalPayment[];
}

export const UnVerifiedTransactionPaymentGrid = observer(({ data }: IProp) => {
  const { store } = useAppContext();
  const navigate = useNavigate();

  const toMMA = (accountNumber: string) => {
    const mmaDocId = getMMADocId(accountNumber, store);
    navigate(`/c/accounts/${mmaDocId}`);
  };

  const columns: GridColDef[] = [
    {
      field: "timeCreated",
      headerName: "",
      // flex: 1,
      width: 10,
      renderCell: (params) => (
        <>
          {getTimeAllocated(params.row.timeCreated) && (
            <span className="badge"></span>
          )}
        </>
      ),
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return dateFormat_YY_MM_DD_NEW(params.row.transactionDate);
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return currencyFormat(params.row.amount);
      },
    },
    {
      field: "reference",
      headerName: "Reference",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "allocation",
      headerName: "Allocated To",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "allocatedBy",
      headerName: "Allocated By",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const person = getAllocatedBy(params.row.allocatedBy, store);
        return person;
      },
    },
    {
      field: "Option",
      headerName: "Option",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <div>
          <IconButton
            data-uk-tooltip="Edit"
            onClick={() => onEditTransactionWithdrawal(params.row.id, store)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            data-uk-tooltip="Verify"
            onClick={() => onVerify(params.row.id, store)}
          >
            <GridCheckCircleIcon />
          </IconButton>
          <IconButton>
            <DeleteForeverIcon style={{ color: "red" }} />
          </IconButton>
        </div>
      ),
    },
  ];
  return (
    <div className="grid">
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

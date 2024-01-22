import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./AllocatedTransaction.scss";
import React from "react";
import { Box, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";
import EditIcon from "@mui/icons-material/Edit";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import { IClientDepositAllocation } from "../../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import { currencyFormat } from "../../../../../shared/functions/Directives";
import { useAppContext } from "../../../../../shared/functions/Context";
import { canVerify, getNaturalPersonsName, onEditTransaction, onhandleTransactionVerification } from "../../../../../shared/functions/MyFunctions";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../shared/utils/utils";

interface IProps {
  data: IClientDepositAllocation[];
}

export const DepositModalGrid = observer(({ data }: IProps) => {
  const { store } = useAppContext();

  const columns: GridColDef[] = [
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
      field: "valueDate",
      headerName: "Value Date",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const convertedDate = dateFormat_YY_MM_DD_NEW(params.row.valueDate);
        return convertedDate;
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      headerClassName: "grid", // Apply the same class for consistency
    },
    {
      field: "entity",
      headerName: "Client",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const clientName = getNaturalPersonsName(params.row.entity, store);
        return clientName;
      },
    },
    {
      field: "allocation",
      headerName: "Account",
      flex: 1,
      headerClassName: "grid", // Apply the same class for consistency
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => {
        const formattedAmount = currencyFormat(params.row.amount);
        return formattedAmount;
      },
    },
    {
      field: "Options",
      headerName: "Options",
      flex: 1,
      renderCell: (params) => (
        <div>
          {canVerify(params.row.id, store) && (
            <IconButton
              data-uk-tooltip="Edit"
              onClick={() => onEditTransaction(params.row.id, store)}
            >
              <EditIcon />
            </IconButton>
          )}

          {canVerify(params.row.id, store) && (
            <IconButton
              data-uk-tooltip="Verify"
              onClick={() =>
                onhandleTransactionVerification(params.row.id, store)
              }
            >
              <RunningWithErrorsIcon />
            </IconButton>
          )}
          {!canVerify(params.row.id, store) && (
            <span
              style={{
                border: "1px solid green",
                color: "white",
                padding: "8px",
                borderRadius: "10px",
              }}
            >
              Verified
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="grid">
      <Box sx={{ height: 250 }}>
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

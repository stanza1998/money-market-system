import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./AllocatedTransaction.scss";
import React from "react";
import { IClientDepositAllocation } from "../../../../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import { Box, IconButton } from "@mui/material";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../../shared/utils/utils";
import {
  getMMA,
  onAllocateTransaction,
} from "../../../../../../../shared/functions/MyFunctions";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../../../shared/functions/Context";
import { currencyFormat } from "../../../../../../../shared/functions/Directives";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";

interface IProps {
  data: IClientDepositAllocation[];
}

export const UnAllocatedTransactionsGrid = observer(({ data }: IProps) => {
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
        // const clientName = getClientName(params.row.entity, store);
        // return clientName;
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
          <IconButton
            data-uk-tooltip="Allocate"
            onClick={() => onAllocateTransaction(params.row.id, store)}
          >
            <AssignmentReturnIcon />
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

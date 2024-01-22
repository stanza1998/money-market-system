import "./AllocatedTransaction.scss";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../shared/utils/utils";
import { observer } from "mobx-react-lite";
import React from "react";
import { IClientWithdrawalPayment } from "../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { Box, IconButton } from "@mui/material";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { currencyFormat } from "../../../../../../shared/functions/Directives";

interface IProp {
  data: IClientWithdrawalPayment[];
}

export const RecuringTransactionPaymentGrid = observer(({ data }: IProp) => {
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
      field: "allocation",
      headerName: "Allocated By",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "Option",
      headerName: "Option",
      flex: 1,
      headerClassName: "grid",
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

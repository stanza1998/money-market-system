import { observer } from "mobx-react-lite";
import React from "react";
import { IClientWithdrawalPayment } from "../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { Box, IconButton } from "@mui/material";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { DataGrid, GridCheckCircleIcon, GridColDef } from "@mui/x-data-grid";
import "./AllocatedTransaction.scss";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../shared/utils/utils";
import { currencyFormat } from "../../../../../../shared/functions/Directives";
import {
  getAllocatedBy,
  getTimeAllocated,
  onAuthorize,
  onViewVerifiedPayment,
} from "../../../../../../shared/functions/MyFunctions";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import HistoryIcon from "@mui/icons-material/History";

interface IProp {
  data: IClientWithdrawalPayment[];
}

export const VerifiedTransactionPaymentGrid = observer(({ data }: IProp) => {
  const { store } = useAppContext();

  const columns: GridColDef[] = [
    {
      field: "timeVerified",
      headerName: "",
      // flex: 1,
      width: 10,
      renderCell: (params) => (
        <>
          {getTimeAllocated(params.row.timeVerified) && (
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
      // const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      //   .toString()
      //   .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      // return formattedTime;
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
        <>
          <IconButton
            data-uk-tooltip="View Transaction"
            onClick={() => onViewVerifiedPayment(params.row.id, store)}
          >
            <ViewCompactIcon />
          </IconButton>
          <IconButton
            data-uk-tooltip="Authorize"
            onClick={() => onAuthorize(params.row.id, store)}
          >
            <GridCheckCircleIcon />
          </IconButton>
          <IconButton>
            <HistoryIcon />
          </IconButton>
        </>
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

import { observer } from "mobx-react-lite";
import { IClientWithdrawalPayment } from "../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { Box, IconButton } from "@mui/material";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./ProcessedTransaction.scss";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../shared/utils/utils";
import { currencyFormat } from "../../../../../../shared/functions/Directives";
import {
  getAllocatedBy,
  getMMADocId,
  // onViewVerifiedPayment,
} from "../../../../../../shared/functions/MyFunctions";
// import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { useNavigate } from "react-router-dom";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";

interface IProp {
  data: IClientWithdrawalPayment[];
}

export const ProcessedPaymentsGrid = observer(({ data }: IProp) => {
  const { store } = useAppContext();
  const navigate = useNavigate();

  const toMMA = (accountNumber: string) => {
    const mmaDocId = getMMADocId(accountNumber, store);
    navigate(`/c/accounts/${mmaDocId}`);
  };

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
        // <IconButton
        //   data-uk-tooltip="View Transaction"
        //   onClick={() => onViewVerifiedPayment(params.row.id, store)}
        // >
        //   <ViewCompactIcon />
        // </IconButton>
        <IconButton
          data-uk-tooltip={`To Money Market Account (${params.row.allocation})`}
          onClick={() => toMMA(params.row.allocation)}
        >
          <AssistantDirectionIcon />
        </IconButton>
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

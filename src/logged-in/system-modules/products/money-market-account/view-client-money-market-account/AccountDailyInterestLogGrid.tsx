import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "./AccountTransactions.scss";
import { Box, IconButton } from "@mui/material";
import { observer } from "mobx-react-lite";

import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { useAppContext } from "../../../../../shared/functions/Context";
import { currencyFormat } from "../../../../../shared/functions/Directives";
import {
  calculateCurrentBalance,
  getNaturalPersonsName,
} from "../../../../../shared/functions/MyFunctions";
import { IClientDepositAllocation } from "../../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../shared/utils/utils";

interface IProps {
  data: any[];
  amount: number;
}

export const AccountDailyInterestLogGrid = observer(({ data, amount }: IProps) => {
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
      field: "transaction",
      headerName: "Description",
      flex: 1,
      headerClassName: "grid", // Apply the same class for consistency
    },
    {
      field: "pBalance",
      headerName: "Running Balance",
      flex: 1,
      renderCell: (params) => {
        const formattedAmount = currencyFormat(params.row.pBalance);
        return formattedAmount;
      },
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
      field: "Current",
      headerName: "Balance",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const balance = calculateCurrentBalance(
          params.row.pBalance,
          params.row.amount,
          params.row.transaction
        );
        return currencyFormat(balance);
      },
    },

    // renderCell: (params) => (
    //   <IconButton data-uk-tooltip="View Transaction">
    //     <ViewCompactIcon />
    //   </IconButton>
    // ),
  ];

  return (
    <div className="grid">
      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id} // Use the appropriate identifier property
          rowHeight={35}
        />
      </Box>
      <h5>Balance: {currencyFormat(amount)}</h5>
    </div>
  );
});

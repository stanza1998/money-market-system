import { DataGrid, GridColDef, GridCheckCircleIcon } from "@mui/x-data-grid";
import React from "react";
import { observer } from "mobx-react-lite";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../../shared/functions/Context";
import { IMoneyMarketAccountInterestLog } from "../InterestDataTable";

interface IProps {
  data: IMoneyMarketAccountInterestLog[];
}

export const InterestDataGrid = observer(({ data }: IProps) => {
  const { store } = useAppContext();
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "interestLogDate",
      headerName: "Date",
      flex: 1,
      width: 10,
    },
    {
      field: "interest",
      headerName: "Interest",
      flex: 1,
      width: 10,
    },
    {
      field: "runningBalance",
      headerName: "Running Balance",
      flex: 1,
      width: 10,
    },
    {
      field: "fee",
      headerName: "Client Fee",
      flex: 1,
      width: 10,
    },
    {
      field: "accountBalance",
      headerName: "Account Balance",
      flex: 1,
      width: 10,
    },
  ];

  return (
    <div className="grid">
      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.key} // Use the appropriate identifier property
          rowHeight={50}
        />
      </Box>
    </div>
  );
});

import { IconButton, Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import { IClientDepositAllocation } from "../../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import { useAppContext } from "../../../../../shared/functions/Context";
import { ISwitchTransaction } from "../../../../../shared/models/SwitchTransactionModel";
import { dateFormat_YY_MM_DD } from "../../../../../shared/utils/utils";

interface IProps {
  data: ISwitchTransaction[];
}

export const SwitchesGrid = observer(({ data }: IProps) => {
  const { api, store } = useAppContext();
  const onNavigate = useNavigate();
  const user = store.auth.meJson;

  // Change FeatureName, use it on nav bar
  const hasDailyReportViewPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Money Market Account Management" &&
      feature.read === true
  );
  const timestampToDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US");
  };
  const columns: GridColDef[] = [
    {
      field: "switchDate",
      headerName: "Switch Date",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <span style={{ textTransform: "uppercase" }}>
          {data
            .filter((account) => account.id === params.row.id)
            .map((date) => {
              return date.switchDate !== null
                ? dateFormat_YY_MM_DD(date.switchDate)
                : "";
            })}
        </span>
      ),
    },
    {
      field: "switchedBy",
      headerName: "Switched By",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "fromAccount",
      headerName: "From",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "toAccount",
      headerName: "To",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <div style={{ display: "flex-column" }}>
          <div>
            -
            {data
              .filter((data) => data.id === params.id)
              .map((data) => {
                return data.amount;
              })}
          </div>
          <div>
            +
            {data
              .filter((data) => data.id === params.id)
              .map((data) => {
                return data.amount;
              })}
          </div>
        </div>
      ),
    },

    {
      field: "rate",
      headerName: "Rate",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "timeAllocated",
      headerName: "Date/Time Captured",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "whoAllocated",
      headerName: "Captured By",
      flex: 1,
      headerClassName: "grid",
    },
  ];

  return (
    <>
      <div className="grid">
        <Box sx={{ height: 300 }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id} // Use the appropriate identifier property
            rowHeight={80}
          />
        </Box>
      </div>
      <div></div>
    </>
  );
});

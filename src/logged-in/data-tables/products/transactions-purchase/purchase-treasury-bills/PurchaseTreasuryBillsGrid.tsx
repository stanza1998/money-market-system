import { IconButton, Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CalendarViewDayIcon from "@mui/icons-material/CalendarViewDay";
import { ITreasuryBill } from "./../../../../../shared/models/instruments/TreasuryBillModel";
import { useAppContext } from "./../../../../../shared/functions/Context";
import React from "react";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";

interface IProps {
  data: ITreasuryBill[];
}

export const PurchaseTBGrid = observer(({ data }: IProps) => {
  const { api, store } = useAppContext();
  const onNavigate = useNavigate();

  const onContinue = (instrumentId: string) => {
    const selectedInstrument =
      store.instruments.treasuryBill.getItemById(instrumentId);
    console.log(selectedInstrument);

    if (selectedInstrument) {
      store.instruments.treasuryBill.select(selectedInstrument.asJson);
      onNavigate(`/c/purchases/submitted/${selectedInstrument.asJson.id}`);
    }
  };

  const onTender = (instrumentId: string) => {
    const selectedInstrument =
      store.instruments.treasuryBill.getItemById(instrumentId);

    if (selectedInstrument) {
      store.instruments.treasuryBill.select(selectedInstrument.asJson);
      onNavigate(`/c/purchases/allocation-treasury-bill/${selectedInstrument.asJson.id}`);
    }
  };

  const hasAllocations = (instrumentId: string) => {
    console.log("Has Allocations: " + instrumentId);

    const selectedInstrument =
      store.instruments.treasuryBill.getItemById(instrumentId);

    if (selectedInstrument) {
      if (
        selectedInstrument.asJson.instrumentStatus === "allocated" ||
        selectedInstrument.asJson.instrumentStatus === "tendered"
      ) {
        return true;
      }
      return false;
    }
  };

  const canTender = (instrumentId: string) => {
    console.log("Can Tender: " + instrumentId);
    const selectedInstrument =
      store.instruments.treasuryBill.getItemById(instrumentId);
    const today = Date.now();
    if (selectedInstrument) {
      if (selectedInstrument.asJson.maturityDate) {
        const difference = selectedInstrument?.asJson.maturityDate - today;
        const millisecondsPerDay = 24 * 60 * 60 * 1000;
        const dtm = Math.floor(difference / millisecondsPerDay);

        if (dtm >= 0 && dtm <= 14) {
          return true;
        } else {
          return false;
        }
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "issueDate",
      headerName: "Issue Date",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "maturityDate",
      headerName: "Maturity Date",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
    {
      field: "daysToMaturity",
      headerName: "Period",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "dtm",
      headerName: "DTM",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
    {
      field: "Options",
      headerName: "Options",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <>
          {canTender(params.row.key) && (
            <>
              <IconButton
                data-uk-tooltip="Tender"
                onClick={() => onTender(params.row.key)}
              >
                <ViewCompactIcon />
              </IconButton>
            </>
          )}
          {hasAllocations(params.row.key) && (
            <>
              <IconButton
                data-uk-tooltip="Continue"
                onClick={() => onContinue(params.row.key)}
              >
                <AssignmentReturnIcon />
              </IconButton>
            </>
          )}
          {!hasAllocations(params.row.key) && (
            <>
              <IconButton
                data-uk-tooltip="Tender"
                onClick={() => onTender(params.row.key)}
              >
                <ViewCompactIcon />
              </IconButton>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="grid">
        <Box sx={{ height: 500 }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.key} // Use the appropriate identifier property
            rowHeight={50}
          />
        </Box>
      </div>
    </>
  );
});

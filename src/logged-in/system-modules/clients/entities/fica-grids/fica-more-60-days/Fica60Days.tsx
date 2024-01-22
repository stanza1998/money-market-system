import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { INaturalPerson } from "../../../../../../shared/models/clients/NaturalPersonModel";
import { Box } from "@mui/material";
import { observer } from "mobx-react-lite";

interface IProps {
  data: INaturalPerson[];
}

export const Fica60Days = observer(({ data }: IProps) => {
  const columns: GridColDef[] = [
    {
      field: "entity",
      headerName: "Client EntityId",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "dateOfLastFIA",
      headerName: "Date of Last FIA",
      flex: 1,
      headerClassName: "grid",
    },
  ];
  return (
    <div className="grid">
      <h5 style={{ fontSize: "14px", fontWeight: "600" }}>Overdue FIA</h5>
      <Box sx={{ height: 300 }}>
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

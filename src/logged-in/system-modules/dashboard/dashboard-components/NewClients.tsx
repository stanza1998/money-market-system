import { IconButton, Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../../shared/functions/Context";
import { ILegalEntity } from "../../../../shared/models/clients/LegalEntityModel";

interface IProps {
  data: ILegalEntity[];
}

export const LegalEntityTable = observer(({ data }: IProps) => {
  const { store } = useAppContext();
  const user = store.auth.meJson;
  const onNavigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "entityDisplayName",
      headerName: "Client Name",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "dateCreated",
      headerName: "Date Registered",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "riskRating",
      headerName: "Risk Rating",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => params.row.relatedParty?.[0]?.riskRating || "N/A",
    },
  ];

  return (
    <div className="grid">
      <Box sx={{ height: 200 }}>
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

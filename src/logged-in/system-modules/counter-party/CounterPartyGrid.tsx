import { DataGrid, GridColDef, GridCheckCircleIcon } from "@mui/x-data-grid";

import { observer } from "mobx-react-lite";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../shared/functions/Context";
import CounterPartyModel, { ICounterParty } from "../../../shared/models/CounterPartyModel";

interface IProps {
  data: ICounterParty[];
}

export const CounterPartyGrid = observer(({ data }: IProps) => {
  const { store } = useAppContext();
  const navigate = useNavigate();

  const columns: GridColDef[] = [
    {
      field: "counterpartyName",
      headerName: "Name",
      flex: 1,
      width: 10,
    },
    {
      field: "bank",
      headerName: "Bank Name",
      flex: 1,
      width: 10,
    },
    {
      field: "branch",
      headerName: "Branch",
      flex: 1,
      width: 10,
    },
    {
      field: "accountNumber",
      headerName: "Account Number",
      flex: 1,
      width: 10,
    },
    {
      field: "accountHolder",
      headerName: "Account Holder",
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
          getRowId={(row) => row.id}
          rowHeight={50}
        />
      </Box>
    </div>
  );
});

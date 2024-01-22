import { observer } from "mobx-react-lite";
import React from "react";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../shared/utils/utils";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import { ISwitchTransaction } from "../../../../../../shared/models/SwitchTransactionModel";
import { currencyFormat } from "../../../../../../shared/functions/Directives";
import { useAppContext } from "../../../../../../shared/functions/Context";
import {
  getClientNameSwitch,
  getEntityId,
  getMMADocId,
} from "../../../../../../shared/functions/MyFunctions";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import { useNavigate } from "react-router-dom";

interface IProps {
  data: ISwitchTransaction[];
}

const SwitchDataGrid = observer(({ data }: IProps) => {
  const { store } = useAppContext();
  const navigate = useNavigate();

  const toMMA = (accountNumber: string) => {
    const mmaDocId = getMMADocId(accountNumber, store);
    navigate(`/c/accounts/${mmaDocId}`);
  };

  const columns: GridColDef[] = [
    {
      field: "switchDate",
      headerName: "Switch Date",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return dateFormat_YY_MM_DD_NEW(params.row.switchDate);
      },
    },
    {
      field: "EntityID",
      headerName: "Entity ID",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const entityId = getEntityId(store, params.row.fromAccount);
        return entityId;
      },
    },
    {
      field: "entityName",
      headerName: "Entity Name",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const clientName = getClientNameSwitch(params.row, store);
        return clientName;
      },
    },
    {
      field: "fromAccount",
      headerName: "From Account",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span>{params.row.fromAccount}</span>
          <IconButton
             data-uk-tooltip={`To Money Market Account (${params.row.fromAccount})`}
            style={{ marginLeft: "auto" }}
            onClick={() => toMMA(params.row.fromAccount)}
          >
            <AssistantDirectionIcon />
          </IconButton>
        </div>
      ),
    },

    {
      field: "toAccount",
      headerName: "To Account",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <span>{params.row.toAccount}</span>
          <IconButton
            data-uk-tooltip={`To Money Market Account (${params.row.toAccount})`}
            style={{ marginLeft: "auto" }}
            onClick={() => toMMA(params.row.toAccount)}
          >
            <AssistantDirectionIcon />
          </IconButton>
        </div>
      ),
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

export default SwitchDataGrid;

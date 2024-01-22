import { IconButton, Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { IMoneyMarketAccount } from "../../../../shared/models/MoneyMarketAccount";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import AppStore from "../../../../shared/stores/AppStore";
import MODAL_NAMES from "../../../dialogs/ModalName";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { useState } from "react";

interface IProps {
  data: IMoneyMarketAccount[];
}

export const MoneyMarketGrid = observer(({ data }: IProps) => {
  const { store } = useAppContext();
  const onNavigate = useNavigate();
  const user = store.auth.meJson;

  const onView = (accountId: string) => {
    onNavigate(`/c/accounts/${accountId}`);
  };

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];
  const products = store.product.all.map((p) => {
    return p.asJson;
  });

  const getClientName = (parentEntityId: string) => {
    const client = clients.find(
      (client) => client.asJson.entityId === parentEntityId
    );
    if (client) {
      return client.asJson.entityDisplayName;
    }

    return "";
  };

  const getProductName = (productId: string) => {
    const product = products.find((product) => product.id === productId);
    if (product) {
      return product.productName;
    }

    return "";
  };

  const onEdit = (accountId: string, store: AppStore) => {
    const selectedAccount = store.mma.getItemById(accountId);

    if (selectedAccount) {
      store.mma.select(selectedAccount.asJson);
      showModalFromId(MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL);
    }
  };

  const hasMoneyMarketAccountManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Money Market Account Management" &&
      feature.update === true
  );

  const columns: GridColDef[] = [
    {
      field: "accountNumber",
      headerName: "Account Number",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "accountName",
      headerName: "Account Name",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "clientName",
      headerName: "Client Name",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return getClientName(params.row.parentEntity);
      },
      // Apply the same class for consistency
    },
    {
      field: "parentEntity",
      headerName: "Entity ID",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "accountType",
      headerName: "Account Type",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return getProductName(params.row.accountType);
      },
      // Apply the same class for consistency
    },
    {
      field: "feeRate",
      headerName: "Fee Rate",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "status",
      headerName: "Account Status",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <div>
          {params.row.status === "Active" ? (
            <span
              style={{
                padding: "4px",
                border: "2px solid green",
                borderRadius: "4px",
              }}
            >
              Account Active
            </span>
          ) : (
            <span
              style={{
                padding: "4px",
                border: "2px solid red",
                borderRadius: "4px",
                color: "white",
              }}
            >
              Account Closed
            </span>
          )}
        </div>
      ),
    },
    hasMoneyMarketAccountManagementPermission
      ? {
          field: "Options",
          headerName: "Options",
          flex: 1,
          headerClassName: "grid",
          renderCell: (params) => (
            <div>
              <IconButton
                data-uk-tooltip="Edit"
                onClick={() => onEdit(params.row.id, store)}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                data-uk-tooltip="View"
                onClick={() => onView(params.row.id)}
              >
                <ViewCompactIcon />
              </IconButton>
            </div>
          ),
        }
      : ({} as GridColDef),
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

import { IconButton, Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import { useAppContext } from "../../../../../shared/functions/Context";
import { INaturalPerson } from "../../../../../shared/models/clients/NaturalPersonModel";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import AppStore from "../../../../../shared/stores/AppStore";
import { ILegalEntity } from "../../../../../shared/models/clients/LegalEntityModel";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
interface IProps {
  data: ILegalEntity[];
}

export const LegalEntityGrid = observer(({ data }: IProps) => {
  const { store } = useAppContext();
  const user = store.auth.meJson;
  const onNavigate = useNavigate();

  const onView = (clientId: string, store: AppStore) => {
    const selectedclient = store.client.legalEntity.getItemById(clientId);

    if (selectedclient) {
      store.client.legalEntity.select(selectedclient.asJson);
      onNavigate(`/c/clients/legal-entity/${clientId}`); //not yet implemented
    }
  };

  const onEdit = (clientId: string, store: AppStore) => {
    const selectedclient = store.client.legalEntity.getItemById(clientId);

    if (selectedclient) {
      store.client.legalEntity.select(selectedclient.asJson);
      showModalFromId(MODAL_NAMES.ADMIN.LEGAL_ENTITY_MODAL);
    }
  };

  const hasClientProfileManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Client Profile Management" &&
      feature.read === true
  );
  const hasEditPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Client Profile Management" &&
      feature.update === true
  );
  const hasViewPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Client Profile Management" &&
      feature.read === true
  );
  const columns: GridColDef[] = [
    {
      field: "entityId",
      headerName: "Entity ID",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "clientRegisteredName",
      headerName: "Registered Name",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "clientTradingName",
      headerName: "Trading Name",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
    {
      field: "registrationNumber",
      headerName: "VAT Number",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "cellphoneNumber",
      headerName: "Contact Number",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
    {
      field: "emailAddress",
      headerName: "Email",
      flex: 1,
      headerClassName: "grid",
    },
    hasClientProfileManagementPermission
      ? {
          field: "Options",
          headerName: "Options",
          flex: 1,
          headerClassName: "grid",
          renderCell: (params) => (
            <div>
              {hasEditPermission && (
                <>
                  <IconButton
                    data-uk-tooltip="Edit"
                    onClick={() => onEdit(params.row.key, store)}
                  >
                    <EditIcon />
                  </IconButton>
                </>
              )}
              {hasViewPermission && (
                <>
                  {" "}
                  <IconButton
                    data-uk-tooltip="View"
                    onClick={() => onView(params.row.key, store)}
                  >
                    <ViewCompactIcon />
                  </IconButton>
                </>
              )}
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
          getRowId={(row) => row.key} // Use the appropriate identifier property
          rowHeight={50}
        />
      </Box>
    </div>
  );
});

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
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import { ExportToCSVButtonEntities } from "../../../../shared/export-grid-data-csv/ExportCSVEnitity";
import Modal from "../../../../../shared/components/Modal";

interface IProps {
  data: INaturalPerson[];
}

export const NaturalPersonGrid = observer(({ data }: IProps) => {
  const { store } = useAppContext();
  const onNavigate = useNavigate();
  const user = store.auth.meJson;

  const onView = (clientId: string, store: AppStore) => {
    const selectedclient = store.client.naturalPerson.getItemById(clientId);
    if (selectedclient) {
      store.client.naturalPerson.select(selectedclient.asJson);
      onNavigate(`/c/clients/natural-person/${clientId}`);
    }
  };

  const onEdit = (clientId: string, store: AppStore) => {
    const selectedclient = store.client.naturalPerson.getItemById(clientId);
    if (selectedclient) {
      store.client.naturalPerson.select(selectedclient.asJson);
      showModalFromId(MODAL_NAMES.ADMIN.NATURAL_PERSON_MODAL);
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
      field: "clientName",
      headerName: "First Name",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "clientSurname",
      headerName: "Last Name",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
    {
      field: "idNumber",
      headerName: "ID Number",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "contactNumber",
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
                  {" "}
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

  const onExport = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.EXPORT_REPORT_DATA);
  };

  return (
    <div className="grid">
      <div className="uk-margin">
        {/* <button onClick={onExport} className="btn btn-primary uk-margin">
          General Repo
        </button> */}
      </div>
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.key} // Use the appropriate identifier property
          rowHeight={50}
        />
      </Box>

      <Modal modalId={MODAL_NAMES.BACK_OFFICE.EXPORT_REPORT_DATA}>
        <div
          className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical"
          style={{ width: "50%" }}
        >
          <button
            className="uk-modal-close-default"
            type="button"
            data-uk-close
          ></button>
          {/* <ExportToCSVButtonEntities
            data={data}
            columns={columns}
            label="Entities"
          /> */}
        </div>
      </Modal>
    </div>
  );
});

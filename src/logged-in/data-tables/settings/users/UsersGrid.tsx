import { IconButton, Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import EditIcon from "@mui/icons-material/Edit";
import { IUser } from "../../../../shared/models/User";
import showModalFromId from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../dialogs/ModalName";
import { useAppContext } from "../../../../shared/functions/Context";
import Modal from "../../../../shared/components/Modal";
import UserModal from "../../../dialogs/crud/user/UserModal";
import ClientUserModal from "../../../dialogs/crud/client-user/ClientUserModal";
import DeleteIcon from '@mui/icons-material/Delete';

interface IProps {
  data: IUser[];
}

export const UsersGrid = observer(({ data }: IProps) => {
  const { api, store } = useAppContext();
  const user = store.auth.meJson;

  const onEdit = (userId: string) => {
    const selectedUser = store.user.getItemById(userId);
    if (selectedUser) {
      store.user.select(selectedUser.asJson);
      showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL);
    }
  }

  const onDisable = async (userId: string) => {
    const selectedUser = store.user.getItemById(userId);

    if (selectedUser) {
      // await api.user.delete(selectedUser.asJson)
    }
  }
//   // Change FeatureName, use it on nav bar
  const hasUserManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "User Management" &&
      feature.read === true
  );

  const columns: GridColDef[] = [
    {
      field: "userName",
      headerName: "Name",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "userEmail",
      headerName: "Email",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "userRole",
      headerName: "Role",
      flex: 1,
      headerClassName: "grid",
    },
    {
        field: "department",
        headerName: "Department",
        flex: 1,
        headerClassName: "grid",
      },
      {
        field: "jobTitle",
        headerName: "Job Title",
        flex: 1,
        headerClassName: "grid",
      },
      hasUserManagementPermission
      ? {
          field: "Options",
          headerName: "Options",
          flex: 1,
          headerClassName: "grid",
          renderCell: (params) => (
            <div>
              <IconButton
                data-uk-tooltip="Edit"
                onClick={() => onEdit(params.row.key)}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                data-uk-tooltip="Disable"
                onClick={() => onDisable(params.row.key)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ),
        }
      : ({} as GridColDef),
  ];

  return (
    <>
      <div className="grid">
        <Box sx={{ height: 300 }}>
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.key} // Use the appropriate identifier property
            rowHeight={50}
          />
        </Box>
      </div>
      <div>
      <Modal modalId={MODAL_NAMES.ADMIN.USER_MODAL}>
          <UserModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.CLIENT_MODAL}>
          <ClientUserModal />
        </Modal>
      </div>
    </>
  );
});


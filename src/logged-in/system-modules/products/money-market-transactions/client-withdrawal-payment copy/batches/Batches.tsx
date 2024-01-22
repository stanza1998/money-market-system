import "./Batches.scss";
import { observer } from "mobx-react-lite";
import { Box, IconButton } from "@mui/material";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Toolbar from "../../../../../shared/toolbar/Toolbar";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import {
  getAllocatedBy,
  getTimeAllocated,
} from "../../../../../../shared/functions/MyFunctions";
import showModalFromId from "../../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../../dialogs/ModalName";
import { IBatches } from "../../../../../../shared/models/batches/BatchesModel";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useState } from "react";
import { LoadingEllipsis } from "../../../../../../shared/components/loading/Loading";

interface IProp {
  data: IBatches[];
}

export const Batches = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const [loading, setLoading] = useState(false);

  const onView = (batch: IBatches) => {
    store.batches.select(batch);
    showModalFromId(MODAL_NAMES.ADMIN.VIEW_DETAIL_BATCHES);
  };

  const removeBatch = async (batch: IBatches) => {
    setLoading(true);
    try {
      await api.batches.delete(batch);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "timeAuthorised",
      headerName: "",
      // flex: 1,
      width: 10,
      renderCell: (params) => (
        <>
          {getTimeAllocated(params.row.timeProcessed) && (
            <span className="badge"></span>
          )}
        </>
      ),
    },
    {
      field: "batchNumber",
      headerName: "Batch Reference",
      width: 300,
      flex: 1,
    },
    {
      field: "whoProcessBatched",
      headerName: "Created By",
      width: 300,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return getAllocatedBy(params.row.whoProcessBatched, store);
      },
    },
    {
      field: "timeProcessed",
      headerName: "Date And Time Created",
      width: 300,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const dateAndTime = new Date(params.row.timeProcessed).toLocaleString();
        return dateAndTime;
      },
    },
    {
      field: "batchType",
      headerName: "Batch Type",
      width: 300,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        if (params.row.batchType === "High") {
          return "High";
        } else if (params.row.batchType === "Low") {
          return "Normal";
        } else if (params.row.batchType === "Zar") {
          return "ZAR";
        } else {
          return "Unknown Type";
        }
      },
    },
    {
      field: "#",
      headerName: "Total Trnasactions",
      width: 300,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return params.row.batchWithdrawalTransactions.length + " Transactions";
      },
    },
    {
      field: "Option",
      headerName: "Options",
      width: 100,
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <>
          {loading ? (
            <LoadingEllipsis />
          ) : (
            <>
              <IconButton
                data-uk-tooltip="Open File"
                onClick={() => onView(params.row)}
              >
                <FileOpenIcon />
              </IconButton>
              <IconButton data-uk-tooltip="Download File">
                <FileDownloadIcon />
              </IconButton>
              {params.row.batchWithdrawalTransactions.length === 0 && (
                <IconButton onClick={() => removeBatch(params.row)}>
                  <DeleteForeverIcon style={{ color: "red" }} />
                </IconButton>
              )}
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="grid">
      <Toolbar
        rightControls={<></>}
        leftControls={<h4 className="main-title-small">Batch Files</h4>}
      />
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

import { DataGrid, GridColDef, GridCheckCircleIcon } from "@mui/x-data-grid";
import "./AllocatedTransaction.scss";
import React from "react";
import { IClientDepositAllocation } from "../../../../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../../shared/utils/utils";
import {
  canVerify,
  getMMADocId,
  getNaturalPersonsName,
  getTimeAllocated,
  onEditTransaction,
  onhandleTransactionVerification,
} from "../../../../../../../shared/functions/MyFunctions";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../../../shared/functions/Context";
import { currencyFormat } from "../../../../../../../shared/functions/Directives";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import showModalFromId from "../../../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../../../dialogs/ModalName";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import { useNavigate } from "react-router-dom";

interface IProps {
  data: IClientDepositAllocation[];
}

export const AllocatedTransactionDataGrid = observer(({ data }: IProps) => {
  const { store } = useAppContext();
  const navigate = useNavigate();

  const toMMA = (accountNumber: string) => {
    const mmaDocId = getMMADocId(accountNumber, store);
    navigate(`/c/accounts/${mmaDocId}`);
  };

  const viewTransaction = (deposit: IClientDepositAllocation) => {
    store.clientDepositAllocation.select(deposit);
    showModalFromId(MODAL_NAMES.BACK_OFFICE.VIEW_DEPOSIT_TRANSACTION);
  };

  const columns: GridColDef[] = [
    {
      field: "timeAllocated",
      headerName: "",
      // flex: 1,
      width: 10,
      renderCell: (params) => (
        <>
          {getTimeAllocated(params.row.timeAllocated) && (
            <span className="badge"></span>
          )}
        </>
      ),
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return dateFormat_YY_MM_DD_NEW(params.row.transactionDate);
      },
    },
    {
      field: "valueDate",
      headerName: "Value Date",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const convertedDate = dateFormat_YY_MM_DD_NEW(params.row.valueDate);
        return convertedDate;
      },
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      headerClassName: "grid", // Apply the same class for consistency
    },
    {
      field: "entity",
      headerName: "Client",
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const clientName = getNaturalPersonsName(params.row.entity, store);
        return clientName;
      },
    },
    {
      field: "allocation",
      headerName: "Account",
      flex: 1,
      headerClassName: "grid", // Apply the same class for consistency
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => {
        const formattedAmount = currencyFormat(params.row.amount);
        return formattedAmount;
      },
    },
    // {
    //   field: "Status",
    //   headerName: "Status",
    //   flex: 1,
    //   headerClassName: "grid",
    //   renderCell: (params) => (
    //     <>
    //       {!canVerify(params.row.id, store) && (
    //         <span
    //           style={{
    //             border: "1px solid green",
    //             color: "white",
    //             padding: "8px",
    //             borderRadius: "10px",
    //             width: "100%",
    //           }}
    //         >
    //           Verified
    //         </span>
    //       )}
    //       {canVerify(params.row.id, store) && (
    //         <span
    //           style={{
    //             border: "1px solid red",
    //             color: "white",
    //             padding: "8px",
    //             borderRadius: "10px",
    //             width: "100%",
    //           }}
    //         >
    //           Pending
    //         </span>
    //       )}
    //     </>
    //   ),
    // },
    {
      field: "Options",
      headerName: "Options",
      flex: 1,
      renderCell: (params) => (
        <div>
          {canVerify(params.row.id, store) && (
            <IconButton
              data-uk-tooltip="Edit"
              onClick={() => onEditTransaction(params.row.id, store)}
            >
              <EditIcon />
            </IconButton>
          )}

          {canVerify(params.row.id, store) && (
            <IconButton
              data-uk-tooltip="Verify"
              onClick={() =>
                onhandleTransactionVerification(params.row.id, store)
              }
            >
              <GridCheckCircleIcon />
            </IconButton>
          )}
          {!canVerify(params.row.id, store) && (
            <>
              <IconButton
                data-uk-tooltip="View Transaction"
                onClick={() => viewTransaction(params.row)}
              >
                <ViewCompactIcon />
              </IconButton>
              <IconButton
                data-uk-tooltip={`To Money Market Account (${params.row.allocation})`}
                onClick={() => toMMA(params.row.allocation)}
              >
                <AssistantDirectionIcon />
              </IconButton>
            </>
          )}
        </div>
      ),
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

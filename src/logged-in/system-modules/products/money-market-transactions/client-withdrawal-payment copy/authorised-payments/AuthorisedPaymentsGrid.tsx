import "./AuthorisedPayments.scss";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../shared/utils/utils";
import { observer } from "mobx-react-lite";
import { IClientWithdrawalPayment } from "../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { Box, IconButton } from "@mui/material";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { DataGrid, GridColDef, GridToolbarExport } from "@mui/x-data-grid";
import { currencyFormat } from "../../../../../../shared/functions/Directives";
import Toolbar from "../../../../../shared/toolbar/Toolbar";
import {
  generateBatchesWithdrawal,
  getAllocatedBy,
  getMMADocId,
  getTimeAllocated,
} from "../../../../../../shared/functions/MyFunctions";
// import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import AssistantDirectionIcon from "@mui/icons-material/AssistantDirection";
import { useNavigate } from "react-router-dom";
import showModalFromId, {
  hideModalFromId,
} from "../../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../../dialogs/ModalName";
import { useEffect, useState } from "react";
import Modal from "../../../../../../shared/components/Modal";
import CancelIcon from "@mui/icons-material/Cancel";

interface IProp {
  data: IClientWithdrawalPayment[];
}

export const AuthorisedPaymentsGrid = observer(({ data }: IProp) => {
  const { store, api } = useAppContext();
  const me = store.auth.meJson;
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const onCancelTransaction = (transaction: IClientWithdrawalPayment) => {
    store.clientWithdrawalPayment.select(transaction);
    showModalFromId(MODAL_NAMES.ADMIN.CANCEL_TRANSACTION_MODAL);
  };

  const highVolumeTransaction = store.clientWithdrawalPayment.all
    .filter(
      (t) =>
        t.asJson.transactionStatus === "authorised" &&
        t.asJson.amount > 5000 &&
        (t.asJson.batchStatus === false || !t.asJson.batchStatus)
    )
    .map((t) => {
      return t.asJson;
    });
  const lowVolumeTransaction = store.clientWithdrawalPayment.all
    .filter(
      (t) =>
        t.asJson.transactionStatus === "authorised" &&
        t.asJson.amount <= 5000 &&
        (t.asJson.batchStatus === false || !t.asJson.batchStatus)
    )
    .map((t) => {
      return t.asJson;
    });

  const toMMA = (accountNumber: string) => {
    const mmaDocId = getMMADocId(accountNumber, store);
    navigate(`/c/accounts/${mmaDocId}`);
  };

  const viewTransaction = (deposit: IClientWithdrawalPayment) => {
    store.clientWithdrawalPayment.select(deposit);
    showModalFromId(MODAL_NAMES.BACK_OFFICE.VIEW_WITHDRAWAL_TRANSACTION);
  };

  const exportButton = () => {
    return (
      <GridToolbarExport
        csvOptions={{
          fileName: "customerDataBase",
          delimiter: ";",
          utf8WithBom: true,
        }}
      />
    );
  };

  const onGenerateBatchFile = () => {
    showModalFromId(MODAL_NAMES.ADMIN.COUNT_BATCHES);
  };

  const generateBatchFiles = async () => {
    try {
      setLoading(true);
      await generateBatchesWithdrawal(store, api, me?.uid);
    } catch (error) {
    } finally {
      setLoading(false);
      hideModalFromId(MODAL_NAMES.ADMIN.COUNT_BATCHES);
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
          {getTimeAllocated(params.row.timeAuthorized) && (
            <span className="badge"></span>
          )}
        </>
      ),
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      width: 200,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return dateFormat_YY_MM_DD_NEW(params.row.transactionDate);
      },
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 200,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        return currencyFormat(params.row.amount);
      },
    },
    {
      field: "reference",
      headerName: "Reference",
      width: 200,
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "allocation",
      headerName: "Allocated To",
      width: 200,
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "allocatedBy",
      headerName: "Allocated By",
      width: 200,
      flex: 1,
      headerClassName: "grid",
      valueGetter: (params) => {
        const person = getAllocatedBy(params.row.allocatedBy, store);
        return person;
      },
    },
    {
      field: "Option",
      headerName: "Option",
      flex: 1,
      headerClassName: "grid",
      renderCell: (params) => (
        <>
          {/* <IconButton
            data-uk-tooltip="View Transaction"
            onClick={() => viewTransaction(params.row)}
          >
            <ViewCompactIcon />
          </IconButton> */}
          <IconButton
            data-uk-tooltip={`To Money Market Account (${params.row.allocation})`}
            onClick={() => toMMA(params.row.allocation)}
          >
            <AssistantDirectionIcon />
          </IconButton>
          <IconButton
            data-uk-tooltip={`Cancel Transaction`}
            onClick={() => onCancelTransaction(params.row)}
          >
            <CancelIcon />
          </IconButton>
        </>
      ),
    },
  ];

  useEffect(() => {
    const getData = async () => {
      await api.clientWithdrawalPayment.getAll();
    };
    getData();
  }, [api.clientWithdrawalPayment]);

  return (
    <div className="grid">
      <Toolbar
        rightControls={
          <button className="btn btn-primary" onClick={onGenerateBatchFile} disabled={data.length < 0}>
            Create Transaction Batch File
          </button>
        }
        leftControls={<h4 className="main-title-small">Authorised Payments</h4>}
      />
      <Box sx={{ height: 500 }}>
        <DataGrid
          slotProps={{
            toolbar: { exportButton },
          }}
          rows={data}
          columns={columns}
          getRowId={(row) => row.id} // Use the appropriate identifier property
          rowHeight={50}
        />
      </Box>
      <Modal modalId={MODAL_NAMES.ADMIN.COUNT_BATCHES}>
        <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2">
          <button
            className="uk-modal-close-default"
            disabled={loading}
            type="button"
            data-uk-close
          ></button>

          <div className="uk-margin">
            <h3
              style={{ fontSize: "18px" }}
              className="main-title-small text-to-break"
            >
              Instant Batch File Summaries: View, Confirm, and Start Your
              Processes
            </h3>
            <h3
              style={{ fontSize: "14px" }}
              className="main-title-small text-to-break"
            >
              High: {highVolumeTransaction.length} {" - "} Normal:{" "}
              {lowVolumeTransaction.length} {" - "}ZAR: 0
            </h3>
          </div>
          <div className="uk-margin">
            {highVolumeTransaction.length > 0 ||
              lowVolumeTransaction.length > 0 ? (
              <button
                className="btn btn-primary"
                onClick={generateBatchFiles}
                disabled={loading}
              >
                Start {loading && <div data-uk-spinner={"ratio: .5"}></div>}
              </button>
            ) : (
              <button
                className="btn btn-primary"
                data-uk-tooltip="You can only create a batch when transactions are available"
                disabled
              >
                Cannot Batch
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
});

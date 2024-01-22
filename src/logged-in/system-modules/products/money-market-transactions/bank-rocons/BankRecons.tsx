import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import Toolbar from "../../../../shared/toolbar/Toolbar";
import "./BankRecon.scss";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import Modal from "../../../../../shared/components/Modal";
import SbNBankStatementUploadModal from "../../../../dialogs/transactions/client-deposit-allocation/SbNBankStatementUploadModal";
import NbNBankStatementUploadModal from "../../../../dialogs/transactions/client-deposit-allocation/NbNBankStatementUploadModal";
import { AllocatedTransactionDataGrid } from "./transaction-status/allocated/AllocatedTransactions";
import { useAppContext } from "../../../../../shared/functions/Context";
import { UnAllocatedTransactionsGrid } from "./transaction-status/unallocated/UnAllocatedTransactionsGrid";
import VerifyDepositModal from "../../../../dialogs/transactions/client-deposit-allocation/UploadModal";
import AllocateTransactionModal from "../../../../dialogs/transactions/client-deposit-allocation/AllocateTransactionModal";
import BankReconTabs from "./BankReconTabs";
import EditBankReconDialog from "../../../../dialogs/transactions/client-deposit-allocation/EditBankReconDialog";
import { ViewDepositTransaction } from "../../../../dialogs/transactions/client-deposit-allocation/ViewDepositTransaction";

const BankRecon = observer(() => {
  const { store, api } = useAppContext();
  const [selectedTab, setSelectedTab] = useState("unallocated-tab");

  const clientDepositAllocation = store.clientDepositAllocation.all
    .sort((a, b) => {
      const dateA = new Date(a.asJson.timeAllocated || 0);
      const dateB = new Date(b.asJson.timeAllocated || 0);

      return dateB.getTime() - dateA.getTime();
    })
    .filter((c) => c.asJson.allocationStatus === "allocated")
    .map((c) => {
      return c.asJson;
    });

  const unAllocatedclientDepositAllocation = store.clientDepositAllocation.all
    .sort((a, b) => {
      const dateA = new Date(a.asJson.transactionDate || 0);
      const dateB = new Date(b.asJson.transactionDate || 0);

      return dateB.getDate() - dateA.getDate();
    })
    .filter((c) => c.asJson.allocationStatus === "un-allocated")
    .map((c) => {
      return c.asJson;
    });

  const handleUploadSbN = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.SBN_BANK_STATEMENT_UPLOAD_MODAL);
  };

  const handleUploadNbN = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.NBN_BANK_STATEMENT_UPLOAD_MODAL);
  };

  const getClientAllocationDepositApi = useMemo(
    () => api.clientDepositAllocation,
    []
  );
  const getNaturalPersonApi = useMemo(() => api.client.naturalPerson, []);
  const getLegalEntityApi = useMemo(() => api.client.legalEntity, []);

  const memoizedDependencies = useMemo(
    () => [
      getClientAllocationDepositApi,
      getNaturalPersonApi,
      getLegalEntityApi,
    ],
    [getClientAllocationDepositApi, getNaturalPersonApi, getLegalEntityApi]
  );

  useEffect(() => {
    const getData = async () => {
      const clientAllocationDepositPromise =
        getClientAllocationDepositApi.getAll();
      const naturalPersonPromise = getNaturalPersonApi.getAll();
      const legalEntityPromise = getLegalEntityApi.getAll();
      await Promise.all([
        clientAllocationDepositPromise,
        naturalPersonPromise,
        legalEntityPromise,
      ]);
    };

    getData();
  }, [...memoizedDependencies]);

  return (
    <ErrorBoundary>
      <div className="page uk-section uk-section-small">
        <div className="uk-container uk-container-expand">
          <div className="sticky-top">
            <Toolbar
              title="Bank Uploads"
              rightControls={
                <div className="uk-margin-bottom">
                  <button className="btn btn-primary" onClick={handleUploadSbN}>
                    Upload SBN
                  </button>
                  <button className="btn btn-primary" onClick={handleUploadNbN}>
                    Upload NBN
                  </button>
                </div>
              }
            />
            <hr />
          </div>
          <ErrorBoundary>
            <div>
              <Toolbar
                rightControls={
                  <div className="uk-margin-bottom">
                    <BankReconTabs
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  </div>
                }
              />
            </div>
            <div className="page-main-card uk-card uk-card-default uk-card-body">
              {selectedTab === "allocated-tab" && (
                <div>
                  <AllocatedTransactionDataGrid
                    // data={wellStructuredClientDepositAllcoation}
                    data={clientDepositAllocation}
                  />
                </div>
              )}
              {selectedTab === "unallocated-tab" && (
                <UnAllocatedTransactionsGrid
                  // data={wellStructuredClientDepositAllcoation}
                  data={unAllocatedclientDepositAllocation}
                />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
      {/* <Modal modalId={MODAL_NAMES.BACK_OFFICE.RECORD_DEPOSIT_MODAL}>
        <DepositModal />
      </Modal> */}
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.NBN_BANK_STATEMENT_UPLOAD_MODAL}>
        <NbNBankStatementUploadModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.SBN_BANK_STATEMENT_UPLOAD_MODAL}>
        <SbNBankStatementUploadModal />
      </Modal>
      {/* <Modal modalId={MODAL_NAMES.BACK_OFFICE.RECORD_UPLOAD_MODAL}>
        <UploadModal />
      </Modal> */}
      <Modal
        modalId={MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.EDIT_TRANSACTION_MODAL}
      >
        <EditBankReconDialog />
      </Modal>

      <Modal modalId={MODAL_NAMES.BACK_OFFICE.RECORD_UPLOAD_MODAL}>
        <VerifyDepositModal />
      </Modal>

      <Modal modalId={MODAL_NAMES.BACK_OFFICE.VIEW_DEPOSIT_TRANSACTION}>
        <ViewDepositTransaction />
      </Modal>

      <Modal
        modalId={
          MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.ALLOCATE_TRANSACTION_MODAL
        }
      >
        <AllocateTransactionModal setSelectedTab={setSelectedTab} />
      </Modal>
    </ErrorBoundary>
  );
});
export default BankRecon;

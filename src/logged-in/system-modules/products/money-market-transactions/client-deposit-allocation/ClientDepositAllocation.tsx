import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import ClientDepositAllocationTabs from "./ClientDepositAllocationTabs";
import DepositModal from "../../../../dialogs/transactions/client-deposit-allocation/DepositModal";
import Modal from "../../../../../shared/components/Modal";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import Toolbar from "../../../../shared/toolbar/Toolbar";
import { VerifiedTransactions } from "./verified/VerifiedTransactionsGrid";
import { useAppContext } from "../../../../../shared/functions/Context";
import { PendingTransactions } from "./pending/PendingTransactionsGrid";
import AllocateTransactionModal from "../../../../dialogs/transactions/client-deposit-allocation/AllocateTransactionModal";
import EditTransactionModal from "../../../../dialogs/transactions/client-deposit-allocation/EditTransactionModal";
import VerifyDepositModalClient from "../../../../dialogs/transactions/client-deposit-allocation/VerifyDepositModal";
import { ViewDepositTransaction } from "../../../../dialogs/transactions/client-deposit-allocation/ViewDepositTransaction";
import { CrmDepositTransactionsGrid } from "./crm-deposits/CrmDepositTransactionsGrid";

const ClientDepositAllocation = observer(() => {
  const { store, api } = useAppContext();
  const [selectedTab, setSelectedTab] = useState("pending-tab");
  const user = store.auth.meJson;
  const hasClientDepositAndAllocation = user?.feature.some(
    (feature) =>
      feature.featureName === "Client Deposits and Allocations" &&
      feature.create === true
  );
  const recordDeposit = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.RECORD_DEPOSIT_MODAL);
  };

  const currentDate = new Date();
  const currentDayOfMonth = currentDate.getDate();

  console.log("Day: ", currentDayOfMonth);

  const verifiedTransaction = store.clientDepositAllocation.all
    .sort((a, b) => {
      const dateA = new Date(a.asJson.timeVerified || 0);
      const dateB = new Date(b.asJson.timeVerified || 0);

      return dateB.getTime() - dateA.getTime();
    })
    .filter((c) => c.asJson.transactionStatus === "verified")
    .map((c) => {
      return c.asJson;
    });

  const pendingTransaction = store.clientDepositAllocation.all
    .sort((a, b) => {
      const dateA = new Date(a.asJson.transactionDate || 0);
      const dateB = new Date(b.asJson.transactionDate || 0);

      return dateB.getDate() - dateA.getDate();
    })
    .filter(
      (c) =>
        c.asJson.transactionStatus === "pending" &&
        c.asJson.allocationStatus === ""
    )
    .map((c) => {
      return c.asJson;
    });

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
              title="Client Deposits (Investments)"
              rightControls={
                <div className="uk-margin-bottom">
                  {hasClientDepositAndAllocation && (
                    <>
                      {" "}
                      <button className="btn btn-text" onClick={recordDeposit}>
                        Record New
                      </button>
                    </>
                  )}
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
                    <ClientDepositAllocationTabs
                      selectedTab={selectedTab}
                      setSelectedTab={setSelectedTab}
                    />
                  </div>
                }
              />
            </div>
            <div className="page-main-card uk-card uk-card-default uk-card-body">
              {selectedTab === "pending-tab" && (
                <PendingTransactions data={pendingTransaction} />
              )}
              {selectedTab === "verified-tab" && (
                <VerifiedTransactions data={verifiedTransaction} />
              )}
              {/* {selectedTab === "crm-tab" && (
              // <Test/>
                 <CrmDepositTransactionsGrid data={verifiedTransaction} />
              )} */}
            </div>
          </ErrorBoundary>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.RECORD_DEPOSIT_MODAL}>
        <DepositModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.VIEW_DEPOSIT_TRANSACTION}>
        <ViewDepositTransaction />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.RECORD_UPLOAD_MODAL}>
        <VerifyDepositModalClient setSelectedTab={setSelectedTab} />
      </Modal>
      <Modal
        modalId={MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.EDIT_TRANSACTION_MODAL}>
        <EditTransactionModal />
      </Modal>
      <Modal
        modalId={
          MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.ALLOCATE_TRANSACTION_MODAL
        }>
        <AllocateTransactionModal setSelectedTab={setSelectedTab} />
      </Modal>
    </ErrorBoundary>
  );
});
export default ClientDepositAllocation;

import { useEffect, useState } from "react";

import { observer } from "mobx-react-lite";

import ClientPaymentsTabs from "./ClientPaymentTabs";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import showModalFromId from "../../../../../shared/functions/ModalShow";

import MODAL_NAMES from "../../../../dialogs/ModalName";
import Toolbar from "../../../../shared/toolbar/Toolbar";
import Modal from "../../../../../shared/components/Modal";

import { useNavigate } from "react-router-dom";
import WithdrawalModal from "../../../../dialogs/transactions/client-withdrawal-payment/WithdrawalModal";
import { PendingPaymentsGrid } from "./pending-payments-grid/PendingPaymentsGrid";
import { useAppContext } from "../../../../../shared/functions/Context";
import { currencyFormat } from "../../../../../shared/functions/Directives";
import { dateFormat_YY_MM_DD } from "../../../../../shared/utils/utils";
import {
  getAllocatorName,
  getClientName,
} from "../../../../../shared/functions/MyFunctions";
import { LoadingEllipsis } from "../../../../../shared/components/loading/Loading";
import { ProcessedPaymentsGrid } from "./processed-payments-grid/ProcessedPaymentsGrid";
import { AuthorisedPaymentsGrid } from "./authorised-payments/AuthorisedPaymentsGrid";
import WithdrawalUpdateModal from "../../../../dialogs/transactions/client-withdrawal-payment/WithdrawalUpdateModal";
import WithdrawalAuthorizeModal from "../../../../dialogs/transactions/client-withdrawal-payment/WithdrawalAuthorizeModal";
import { ViewVerifiedTransactionModal } from "../../../../dialogs/transactions/view-verified-transactions/ViewVerifiedTransactionModal";
import { VerifiedPaymentsGrid } from "./verified-payments/VerifiedPaymentsGrid";
import { ViewPayment } from "../../../../dialogs/transactions/client-deposit-allocation/ViewPayment";
import { Batches } from "./batches/Batches";
import { BatchDetailsModal } from "./batches/modal/BatchDetailsModal";
import { CancelTransactionModal } from "./cancelTransaction/CancelTransactionModal";

export interface IClientPaymentsData {
  index: number;
  reference: string;
  amount: number;
  amountDisplay: string;
  transactionDate: string;
  bank: string;
  allocation: string;
  allocatedBy: string;
  allocationApprovedBy: string;
  transactionStatus: string;
}

const ClientPayments = observer(() => {
  const { store, api } = useAppContext();
  const [selectedTab, setSelectedTab] = useState("authorised-tab");
  const onNavigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const recordWithdrawal = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.RECORD_WITHDRAWAL_MODAL);
  };

  const authorised = store.clientWithdrawalPayment.all
    .sort((a, b) => {
      const dateA = new Date(a.asJson.timeAuthorized || 0);
      const dateB = new Date(b.asJson.timeAuthorized || 0);

      return dateB.getTime() - dateA.getTime();
    })
    .filter(
      (u) =>
        u.asJson.transactionStatus === "authorised" &&
        (u.asJson.batchStatus === false || !u.asJson.batchStatus)
    )
    .map((u) => {
      return u.asJson;
    });

  const processedPayment = store.clientWithdrawalPayment.all
    .sort((a, b) => {
      const dateA = new Date(a.asJson.transactionDate || 0);
      const dateB = new Date(b.asJson.transactionDate || 0);

      return dateB.getDate() - dateA.getDate();
    })
    .filter(
      (u) =>
        u.asJson.transactionStatus === "authorised" &&
        u.asJson.isPaymentProcessed === true
    )
    .map((u) => {
      return u.asJson;
    });

  const batches = store.batches.all
    .sort(
      (a, b) =>
        new Date(b.asJson.timeProcessed || 0).getTime() -
        new Date(a.asJson.timeProcessed || 0).getTime()
    )
    .map((b) => {
      return b.asJson;
    });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          api.clientWithdrawalPayment.getAll(),
          api.batches.getAll(),
        ]);

        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.batches, api.clientWithdrawalPayment]);

  if (loading) return <LoadingEllipsis />;

  return (
    <ErrorBoundary>
      <div className="page uk-section uk-section-small">
        <div className="uk-container uk-container-expand">
          <div className="sticky-top">
            <Toolbar
              title="Payments"
              rightControls={
                <div className="uk-margin-bottom">
                  {/* <button
                    className="btn btn-primary"
                    onClick={recordWithdrawal}
                  >
                    Record Single Withdrawal
                  </button> */}
                  {/* <button className="btn btn-primary" onClick={batchWithdrawal}>
                    Create Withdrawals File
                  </button> */}
                </div>
              }
            />
            <hr />
          </div>
          <Toolbar
            rightControls={
              <div className="uk-margin-bottom">
                <ClientPaymentsTabs
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
              </div>
            }
          />
          <ErrorBoundary>
            <div className="page-main-card uk-card uk-card-default uk-card-body">
              {selectedTab === "authorised-tab" && (
                <AuthorisedPaymentsGrid data={authorised} />
              )}
              {selectedTab === "batch-tab" && <Batches data={batches} />}
              {selectedTab === "processed-tab" && (
                <ProcessedPaymentsGrid data={processedPayment} />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.RECORD_WITHDRAWAL_MODAL}>
        <WithdrawalModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.EDIT_WITHDRAWAL_MODAL}>
        <WithdrawalUpdateModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.AUTHORIZE_WITHDRAWAL_MODAL}>
        <WithdrawalAuthorizeModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.VIEW_WITHDRAWAL_TRANSACTION}>
        <ViewPayment />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.TRANSACTION_WITHDRAWAL_MODAL}>
        <ViewVerifiedTransactionModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.ADMIN.VIEW_DETAIL_BATCHES}>
        <BatchDetailsModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.ADMIN.CANCEL_TRANSACTION_MODAL}>
        <CancelTransactionModal />
      </Modal>
    </ErrorBoundary>
  );
});
export default ClientPayments;

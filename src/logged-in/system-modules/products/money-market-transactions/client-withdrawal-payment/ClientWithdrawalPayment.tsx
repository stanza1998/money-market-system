import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ClientWithdrawalPaymentTabs from "./ClientWithdrawalPaymentTabs";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import Toolbar from "../../../../shared/toolbar/Toolbar";
import Modal from "../../../../../shared/components/Modal";
import { useNavigate } from "react-router-dom";
import WithdrawalModal from "../../../../dialogs/transactions/client-withdrawal-payment/WithdrawalModal";
import { useAppContext } from "../../../../../shared/functions/Context";
import { LoadingEllipsis } from "../../../../../shared/components/loading/Loading";
import { VerifiedTransactionPaymentGrid } from "./verified-transactions-payment-grid/VerifiedTransactionPaymentGrid";
// import { RecuringTransactionPaymentGrid } from "./recurring-transaction-payments/RecuringTransactionPayments-grid";
import WithdrawalUpdateModal from "../../../../dialogs/transactions/client-withdrawal-payment/WithdrawalUpdateModal";
import WithdrawalAuthorizeModal from "../../../../dialogs/transactions/client-withdrawal-payment/WithdrawalAuthorizeModal";
import { ViewVerifiedTransactionModal } from "../../../../dialogs/transactions/view-verified-transactions/ViewVerifiedTransactionModal";
import { UnVerifiedTransactionPaymentGrid } from "./unverified-transactions-payments-grid/UnverifiedTransactionPaymentGrid";
import WithdrawalVerifyModal from "../../../../dialogs/transactions/client-withdrawal-payment/WithdrawalVerifyModal";
import { ViewPayment } from "../../../../dialogs/transactions/client-deposit-allocation/ViewPayment";

export interface IClientWithdrawalPaymentData {
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

const ClientWithdrawalPayment = observer(() => {
  const { store, api } = useAppContext();
  const [selectedTab, setSelectedTab] = useState("pending-tab");
  const onNavigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const recordWithdrawal = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.RECORD_WITHDRAWAL_MODAL);
  };

  const unverified = store.clientWithdrawalPayment.all
    .sort((a, b) => {
      const dateA = new Date(a.asJson.timeCreated || 0);
      const dateB = new Date(b.asJson.timeCreated || 0);

      return dateB.getTime() - dateA.getTime();
    })
    .filter((u) => u.asJson.transactionStatus === "pending")
    .map((u) => {
      return u.asJson;
    });

  const verified = store.clientWithdrawalPayment.all
    .sort((a, b) => {
      const dateA = new Date(a.asJson.timeVerified || 0);
      const dateB = new Date(b.asJson.timeVerified || 0);

      return dateB.getTime() - dateA.getTime();
    })
    .filter((u) => u.asJson.transactionStatus === "verified")
    .map((u) => {
      return u.asJson;
    });

  const recurring = store.clientWithdrawalPayment.all
    .sort((a, b) => {
      const dateA = new Date(a.asJson.transactionDate || 0);
      const dateB = new Date(b.asJson.transactionDate || 0);

      return dateB.getDate() - dateA.getDate();
    })
    .filter((u) => u.asJson.transactionStatus === "recurring")
    .map((u) => {
      return u.asJson;
    });

  // const batchWithdrawal = () => {
  //   onNavigate(`/c/transactions/withdrawals/batch-file`);
  // };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.clientWithdrawalPayment.getAll();
        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.clientWithdrawalPayment]);

  if (loading) return <LoadingEllipsis />;

  return (
    <ErrorBoundary>
      <div className="page uk-section uk-section-small">
        <div className="uk-container uk-container-expand">
          <div className="sticky-top">
            <Toolbar
              title="Client Withdrawals (Disinvestment)"
              rightControls={
                <div className="uk-margin-bottom">
                  <button
                    className="btn btn-primary"
                    onClick={recordWithdrawal}
                  >
                    Record Withdrawal
                  </button>
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
                <ClientWithdrawalPaymentTabs
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
              </div>
            }
          />
          <ErrorBoundary>
            <div className="page-main-card uk-card uk-card-default uk-card-body">
              {selectedTab === "pending-tab" && (
                <UnVerifiedTransactionPaymentGrid data={unverified} />
              )}
              {selectedTab === "verified-tab" && (
                <VerifiedTransactionPaymentGrid data={verified} />
              )}
              {/* {selectedTab === "recurring-tab" && (
                <RecuringTransactionPaymentGrid data={recurring} />
                // <RecurringTransactionPayments />
              )} */}
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
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.VERIFY_WITHDRAWAL_MODAL}>
        <WithdrawalVerifyModal setSelectedTab={setSelectedTab} />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.AUTHORIZE_WITHDRAWAL_MODAL}>
        <WithdrawalAuthorizeModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.TRANSACTION_WITHDRAWAL_MODAL}>
        <ViewPayment />
      </Modal>
    </ErrorBoundary>
  );
});
export default ClientWithdrawalPayment;

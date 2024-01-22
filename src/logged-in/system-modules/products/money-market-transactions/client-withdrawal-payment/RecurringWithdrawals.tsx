import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import Toolbar from "../../../../shared/toolbar/Toolbar";
import Modal from "../../../../../shared/components/Modal";
import { useAppContext } from "../../../../../shared/functions/Context";
import { LoadingEllipsis } from "../../../../../shared/components/loading/Loading";
import { WithdrawalRecurringModal } from "../../../../dialogs/transactions/client-withdrawal-recurring-payment/WithdrawalRecurringModal";
import ClientWithdrawalPaymentTabs from "./ClientWithdrawalPaymentTabs";
import { RecurringPending } from "./recurring-withdrawalsGrid/RecurringGrid";
import { RecurringVerified } from "./recurring-withdrawalsGrid/RecurringVerified";
import { RecurringWithdrawalUpdateModal } from "../../../../dialogs/transactions/client-withdrawal-recurring-payment/RecuringWithdrawalUpdateModal";
import { RecurringWithdrawalVerifyModal } from "../../../../dialogs/transactions/client-withdrawal-payment/RecurringWithdrawalVerfiyModal";

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

export const ClientRecurringWithdrawalPayment = observer(() => {
  const { store, api } = useAppContext();
  const [selectedTab, setSelectedTab] = useState("pending-tab");

  const pending = store.clientWithdrawalRecurringPayment.all
    .filter((t) => t.asJson.transactionStatus === "pending")
    .map((t) => {
      return t.asJson;
    });

  console.log(pending);

  const verified = store.clientWithdrawalRecurringPayment.all
    .filter((t) => t.asJson.transactionStatus === "verified")
    .map((t) => {
      return t.asJson;
    });

  const [loading, setLoading] = useState(false);

  const recordWithdrawal = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.RECORD_RECURRING_WITHDRAWAL_MODAL);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.clientWithdrawalRecurringPayment.getAll();
        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.clientWithdrawalRecurringPayment]);

  if (loading) return <LoadingEllipsis />;

  return (
    <ErrorBoundary>
      <div className="page uk-section uk-section-small">
        <div className="uk-container uk-container-expand">
          <div className="sticky-top">
            <Toolbar
              title="Client Withdrawals (Disinvestment - Recurring)"
              rightControls={
                <div className="uk-margin-bottom">
                  <button
                    className="btn btn-primary"
                    onClick={recordWithdrawal}
                  >
                    Record Recurring Withdrawal
                  </button>
                </div>
              }
            />
            <hr />
          </div>

          <ErrorBoundary>
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
            <div className="page-main-card uk-card uk-card-default uk-card-body">
              {selectedTab === "pending-tab" && (
                <RecurringPending data={pending} />
              )}
              {selectedTab === "verified-tab" && (
                <RecurringVerified data={verified} />
              )}
            </div>
          </ErrorBoundary>
        </div>
      </div>
      <Modal
        modalId={MODAL_NAMES.BACK_OFFICE.RECORD_RECURRING_WITHDRAWAL_MODAL}
      >
        <WithdrawalRecurringModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.EDIT_WITHDRAWAL_RECURRING_MODAL}>
        <RecurringWithdrawalUpdateModal />
      </Modal>
      <Modal
        modalId={MODAL_NAMES.BACK_OFFICE.VERIFY_WITHDRAWAL_RECURRING_MODAL}
      >
        <RecurringWithdrawalVerifyModal setSelectedTab={setSelectedTab} />
      </Modal>
    </ErrorBoundary>
  );
});

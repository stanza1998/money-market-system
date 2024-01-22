import swal from "sweetalert";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import {
  useState,
  FormEvent,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { numberFormat } from "../../../../shared/functions/Directives";
import NumberInput from "../../../shared/number-input/NumberInput";

import { observer } from "mobx-react-lite";
import { dateFormat_YY_MM_DD } from "../../../../shared/utils/utils";
import { VerifyUploadComponent } from "../../../../shared/components/instruction-file-upload/edit-upload-component/VerifyComponent";
import {
  IClientWithdrawalRecurringPayment,
  defaultClientWithdrawalRecurringPayment,
} from "../../../../shared/models/client-withdrawal-recurring-payment/ClientWithdrawalRecurringPaymentModel";

interface IProps {
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

export const RecurringWithdrawalVerifyModal = observer((props: IProps) => {
  const { api, store } = useAppContext();
  const { setSelectedTab } = props;
  const [loading, setLoading] = useState(false);
  const timeVerified = Date.now();
  const formattedAllocated = new Date(timeVerified).toUTCString();
  const me = store.auth.meJson;

  const [clientWithdrawal, setClientWithdrawal] =
    useState<IClientWithdrawalRecurringPayment>({
      ...defaultClientWithdrawalRecurringPayment,
    });

  const [clientName, setClientName] = useState("");

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

  const getClientName = (parentEntityId: string) => {
    const client = clients.find(
      (client) => client.asJson.entityId === parentEntityId
    );
    if (client) {
      return client.asJson.entityDisplayName;
    }
    return "";
  };

  const selectedClient = clients.find(
    (client) => client.asJson.entityId === clientName
  );

  const bankAccounts = selectedClient?.asJson.bankingDetail.map((acc) => ({
    label: `${acc.bankName} | ${acc.accountNumber} | ${acc.accountHolder}`,
    value: acc.accountNumber,
  }));

  const clientBalance = () => {
    const account = store.mma.all.find(
      (mma) => mma.asJson.accountNumber === clientWithdrawal.allocation
    );
    return account ? account.asJson.balance - account.asJson.cession : 0;
  };

  const availableBalance = clientBalance() - clientWithdrawal.amount;

  const handleDayChange = (selectedDay: string) => {
    setClientWithdrawal({
      ...clientWithdrawal,
      recurringDay: parseInt(selectedDay),
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const saveTransaction: IClientWithdrawalRecurringPayment = {
      ...defaultClientWithdrawalRecurringPayment,
      id: clientWithdrawal.id,
      allocation: clientWithdrawal.allocation,
      entity: clientWithdrawal.entity,
      amount: clientWithdrawal.amount,
      bank: clientWithdrawal.bank,
      reference: clientWithdrawal.reference,
      transactionDate: clientWithdrawal.transactionDate,
      valueDate: clientWithdrawal.valueDate,
      allocationStatus: "",
      allocatedBy: clientWithdrawal.allocatedBy,
      reasonForNoProofOfPayment: clientWithdrawal.reasonForNoProofOfPayment,
      reasonForNoSourceOfFunds: clientWithdrawal.reasonForNoSourceOfFunds,
      instruction: clientWithdrawal.instruction || "",
      reasonForNoInstruction: clientWithdrawal.reasonForNoInstruction,
      isRecurring: clientWithdrawal.isRecurring || false,
      recurringDay: clientWithdrawal.recurringDay || null,
      transactionStatus: "verified",
      allocationApprovedBy: store.auth.meJson?.uid || "",
      description: clientWithdrawal.description,
    };

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Verify Transaction"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        try {
          await api.clientWithdrawalRecurringPayment.update(saveTransaction);
          swal({
            icon: "success",
            text: `Transaction has been verified`,
          });
        } catch (error) {}
        setSelectedTab("verified-tab");
        onCancel();
      } else {
        swal({
          icon: "error",
          text: "Transaction not verified!",
        });
      }
    });
    setLoading(false);
  };

  const update = async (transaction: IClientWithdrawalRecurringPayment) => {};

  const onCancel = () => {
    store.clientWithdrawalRecurringPayment.clearSelected();
    setClientWithdrawal({ ...defaultClientWithdrawalRecurringPayment });
    hideModalFromId(MODAL_NAMES.BACK_OFFICE.VERIFY_WITHDRAWAL_RECURRING_MODAL);
    setLoading(false);
  };

  useEffect(() => {
    if (store.clientWithdrawalRecurringPayment.selected) {
      setClientWithdrawal(store.clientWithdrawalRecurringPayment.selected);
      setClientName(clientWithdrawal.entity);
      if (clientWithdrawal.recurringDay) {
        handleDayChange(clientWithdrawal.recurringDay.toString());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // clientWithdrawal.entity,
    // clientWithdrawal.recurringDay,
    store.clientWithdrawalRecurringPayment.selected,
  ]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await api.client.legalEntity.getAll();
      await api.client.naturalPerson.getAll();
      await api.mma.getAll();
      await api.user.getAll();
      setLoading(false);
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.mma, api.user]);

  return (
    <ErrorBoundary>
      <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2">
        <button
          className="uk-modal-close-default"
          onClick={onCancel}
          disabled={loading}
          type="button"
          data-uk-close
        ></button>
        <h4 className="main-title-small text-to-break">
          Verify Withdrawal Transaction
        </h4>

        <div className="dialog-content uk-position-relative">
          <form className="uk-grid" data-uk-grid onSubmit={handleSubmit}>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Value Date
              </label>
              <input
                className="uk-input uk-form-small"
                id="transactionDate"
                type="text"
                name={"date"}
                value={dateFormat_YY_MM_DD(clientWithdrawal.transactionDate)}
                disabled
              />
            </div>

            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Client Name
              </label>
              <input
                type="text"
                className="uk-input uk-form-small"
                value={getClientName(clientWithdrawal.entity)}
                disabled
              />
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Client Bank Account
              </label>
              {bankAccounts?.length! >= 1 ? (
                <input
                  className="uk-input uk-form-small"
                  type="text"
                  value={bankAccounts?.at(0)?.label}
                  onChange={(e) =>
                    setClientWithdrawal({
                      ...clientWithdrawal,
                      bank: e.target.value,
                    })
                  }
                  disabled
                />
              ) : (
                <select
                  className="uk-select uk-form-small"
                  value={clientWithdrawal.bank}
                  id="clientAccount"
                  name={"clientAccount"}
                  onChange={(e) =>
                    setClientWithdrawal({
                      ...clientWithdrawal,
                      bank: e.target.value,
                    })
                  }
                  // required
                >
                  <option value={""} disabled>
                    Select...
                  </option>
                  {bankAccounts?.map((acc, index) => (
                    <option key={acc.value} value={acc.value}>
                      {acc.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Client Money Market Account
              </label>
              <input
                className="uk-input uk-form-small"
                type="text"
                value={clientWithdrawal.allocation}
                disabled
              />
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label" htmlFor="">
                Balance
              </label>
              <input
                className={`uk-input uk-form-small ${
                  availableBalance < 0 ? "text-danger" : ""
                }`}
                value={numberFormat(clientBalance())}
                id="balance"
                type="text"
                name={"balance"}
                disabled
              />
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Amount
              </label>
              <NumberInput
                id="amount"
                className="auto-save uk-input purchase-input uk-form-small"
                placeholder="-"
                value={clientWithdrawal.amount}
                onChange={(value) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    amount: Number(value),
                  })
                }
                disabled
              />
            </div>

            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Reference
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                value={clientWithdrawal.reference}
                id="reference"
                name={"reference"}
                cols={10}
                rows={5}
                onChange={(e) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    reference: e.target.value,
                  })
                }
                disabled
              />
            </div>

            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Description
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                value={clientWithdrawal.description}
                id="description"
                name={"description"}
                cols={10}
                rows={5}
                onChange={(e) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    description: e.target.value,
                  })
                }
                disabled
              />
            </div>

            {/* <div className="uk-width-1-2">
                {!clientWithdrawal.isRecurring && (
                  <div className="uk-form-controls uk-width-1-1">
                    <label
                      className="uk-form-label uk-display-block"
                      htmlFor="recurringWithdrawal"
                    >
                      Recurring Withdrawal{" "}
                      <input
                        className="uk-checkbox uk-margin-small-left"
                        type="checkbox"
                        checked={clientWithdrawal.isRecurring}
                        onChange={(e) =>
                          setClientWithdrawal({
                            ...clientWithdrawal,
                            isRecurring: e.target.checked,
                          })
                        }
                        disabled
                      />
                    </label>
                  </div>
                )}
                {clientWithdrawal.isRecurring && (
                  <div className="uk-form-controls uk-width-1-1">
                    <label className="uk-form-label required" htmlFor="">
                      {" "}
                      Recurring Withdrawal Day
                    </label>
                    <DaySelectorAuthorise
                      value={
                        clientWithdrawal.recurringDay?.toString()
                          ? clientWithdrawal.recurringDay?.toString()
                          : "select"
                      }
                      onChange={handleDayChange}
                    />
                  </div>
                )}
              </div> */}

            <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-1 uk-width-1-1">
              <div>
                <VerifyUploadComponent
                  onFileUpload={(fileUrl) => {
                    // Update clientWithdrawal or perform other actions with fileUrl
                    setClientWithdrawal((prev) => ({
                      ...prev,
                      instruction: fileUrl,
                    }));
                  }}
                  onProvideReason={(reason) => {
                    // Update clientWithdrawal or perform other actions with reason
                    setClientWithdrawal((prev) => ({
                      ...prev,
                      reasonForNoInstruction: reason,
                    }));
                  }}
                  fileUrl={clientWithdrawal.instruction}
                  reasonForNotProvingFile={
                    clientWithdrawal.reasonForNoInstruction
                  }
                  label="Client Instruction"
                  allocation={clientWithdrawal.allocation}
                />
              </div>
            </div>

            <div className="uk-form-controls">
              {availableBalance < 0 && (
                <span className="uk-text-danger uk-display-block">
                  Insufficient funds
                </span>
              )}
              <button
                type="button"
                className="btn btn-danger"
                onClick={onCancel}
              >
                Cancel
              </button>
              {availableBalance < 0 && (
                <button type="submit" className="btn btn-primary" disabled>
                  Verify
                </button>
              )}
              {availableBalance >= 0 && (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    Verify
                    {loading && <div data-uk-spinner={"ratio:.5"}></div>}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
});

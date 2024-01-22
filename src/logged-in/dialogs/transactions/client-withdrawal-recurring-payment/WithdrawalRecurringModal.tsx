import swal from "sweetalert";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";

import MODAL_NAMES from "../../ModalName";
import { useState, FormEvent, useEffect } from "react";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../../shared/functions/Context";
import DaySelector from "../../../../shared/components/day-selector/DaySelector";
import InstructionFileUploader from "../../../../shared/components/instruction-file-upload/InstructionFileUploader";
import { numberFormat } from "../../../../shared/functions/Directives";
import NumberInput from "../../../shared/number-input/NumberInput";
import { observer } from "mobx-react-lite";
import {
  IClientWithdrawalRecurringPayment,
  defaultClientWithdrawalRecurringPayment,
} from "../../../../shared/models/client-withdrawal-recurring-payment/ClientWithdrawalRecurringPaymentModel";

export const WithdrawalRecurringModal = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [clientWithdrawal, setClientWithdrawal] =
    useState<IClientWithdrawalRecurringPayment>({
      ...defaultClientWithdrawalRecurringPayment,
    });
  const [clientName, setClientName] = useState("");
  const [instructionFileURL, setInstructionFileURL] = useState("");
  const [reasonForNoAttachment, setReasonForNoAttachment] = useState("");
  const timeCreated = Date.now();
  const formattedCreated = new Date(timeCreated).toUTCString();

  const handleInstructionFileUpload = (url: string) => {
    // Handle the URL in the parent component
    setInstructionFileURL(url);
  };

  const handleReasonForNoAttachment = (reason: string) => {
    // Handle the URL in the parent component
    setReasonForNoAttachment(reason);
  };

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

  const clientAccountOptions = store.mma.all.filter(
    (mma) =>
      mma.asJson.parentEntity === clientName && mma.asJson.status === "Active"
  );

  const clientOptions = clients.map((cli) => ({
    label: cli.asJson.entityDisplayName,
    value: cli.asJson.entityId,
  }));

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

  const handleClientNameChange = (clientName: string) => {
    setClientWithdrawal({ ...clientWithdrawal, allocation: "" });
    setClientWithdrawal({ ...clientWithdrawal, bank: "" });
    setClientName(clientName);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const saveTransaction: IClientWithdrawalRecurringPayment = {
      ...defaultClientWithdrawalRecurringPayment,
      allocation: clientWithdrawal.allocation,
      entity: clientName,
      amount: clientWithdrawal.amount,
      bank: clientWithdrawal.bank,
      reference: clientWithdrawal.reference,
      description: clientWithdrawal.description,
      allocatedBy: store.auth.meJson?.uid || "",
      valueDate: clientWithdrawal.valueDate,
      transactionDate: Date.now(),
      allocationStatus: "",
      transactionStatus: "pending",
      reasonForNoProofOfPayment: "",
      reasonForNoSourceOfFunds: "",
      instruction: reasonForNoAttachment ? "" : instructionFileURL,
      reasonForNoInstruction: instructionFileURL ? "" : reasonForNoAttachment,
      isRecurring: clientWithdrawal.isRecurring,
      recurringDay: clientWithdrawal.recurringDay,
      timeCretated: formattedCreated,
    };

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Record"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        try {
          await api.clientWithdrawalRecurringPayment.create(saveTransaction);
          swal({
            icon: "success",
            text: `a recurring payment has been requested. All recurring and online payments are automatically generated as a transaction once verified`,
          });
          setLoading(false);
          onCancel();
        } catch (error) {
          console.log(error);
        }
      } else {
        swal({
          icon: "error",
          text: "Transaction cancelled!",
        });
        setLoading(false);
      }
    });
  };

  const onCancel = () => {
    store.clientWithdrawalPayment.clearSelected();
    setClientName("");
    setClientWithdrawal({ ...defaultClientWithdrawalRecurringPayment });
    hideModalFromId(MODAL_NAMES.BACK_OFFICE.RECORD_RECURRING_WITHDRAWAL_MODAL);
  };

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
        <h3 className="main-title-small text-to-break">
          New Recurring Withdrawal Transaction
        </h3>

        <div className="dialog-content uk-position-relative">
          <form className="uk-grid" data-uk-grid onSubmit={handleSubmit}>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Value Date
              </label>
              <input
                className="uk-input uk-form-small"
                id="valueDate"
                type="date"
                name="valueDate"
                onChange={(e) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    valueDate: e.target.valueAsNumber,
                  })
                }
                required
              />
            </div>

            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Client Name
              </label>
              <SingleSelect
                options={clientOptions}
                name="clientName"
                value={clientName}
                // onChange={(value) => setClientName(value)}
                onChange={(value) => handleClientNameChange(value)}
                placeholder="e.g Client Name"
                required
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
                  {bankAccounts?.map((acc) => (
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
              <select
                className="uk-select uk-form-small"
                value={clientWithdrawal.allocation}
                id="clientAccount"
                name={"clientAccount"}
                onChange={(e) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    allocation: e.target.value,
                  })
                }
                required
              >
                <option value={""} disabled>
                  Select...
                </option>
                {clientAccountOptions.map((acc) => (
                  <option key={acc.asJson.id} value={acc.asJson.accountNumber}>
                    {acc.asJson.accountNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label" htmlFor="">
                Balance (Money Market Account:{clientWithdrawal.allocation})
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
              />
            </div>

            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Description
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                value={clientWithdrawal.description}
                rows={3}
                id="description"
                name="description"
                onChange={(e) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Reference
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                value={clientWithdrawal.reference}
                rows={3}
                id="amount"
                name={"amount"}
                onChange={(e) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    reference: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="uk-width-1-1">
              <div className="uk-form-controls uk-width-1-1">
                <label className="uk-form-label required" htmlFor="">
                  Select Recurring Withdrawal Day
                </label>
                <DaySelector onChange={handleDayChange} />
              </div>
            </div>

            <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-3 uk-width-1-1">
              <div>
                <InstructionFileUploader
                  onFileUpload={handleInstructionFileUpload}
                  onProvideReason={handleReasonForNoAttachment}
                  fileUrl={clientWithdrawal.instruction}
                  reasonForNotProvingFile={
                    clientWithdrawal.reasonForNoInstruction
                  }
                  label="Client Instruction"
                  allocation={clientWithdrawal.allocation}
                  onCancel={onCancel}
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
                  Record
                </button>
              )}
              {availableBalance >= 0 && (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={clientWithdrawal.amount === 0 || loading}
                  >
                    Record {loading && <div data-uk-spinner={"ratio:.5"}></div>}
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

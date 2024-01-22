import swal from "sweetalert";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import {
  IClientWithdrawalPayment,
  defaultClientWithdrawalPayment,
} from "../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import MODAL_NAMES from "../../ModalName";
import { useState, FormEvent, useEffect } from "react";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../../shared/functions/Context";
import InstructionFileUploader from "../../../../shared/components/instruction-file-upload/InstructionFileUploader";
import { numberFormat } from "../../../../shared/functions/Directives";
import NumberInput from "../../../shared/number-input/NumberInput";
import { observer } from "mobx-react-lite";

import "./WithdrawalModal.scss";
import {
  getAccountTypeWithAccountNumber,
  getClientBalance,
} from "../../../../shared/functions/MyFunctions";
import { ITransactionOutflow } from "../../../../shared/models/TransactionOutflowModel";
const WithdrawalModal = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [clientWithdrawal, setClientWithdrawal] =
    useState<IClientWithdrawalPayment>({ ...defaultClientWithdrawalPayment });
  const [clientName, setClientName] = useState("");
  const [instructionFileURL, setInstructionFileURL] = useState("");
  const [reasonForNoAttachment, setReasonForNoAttachment] = useState("");
  const timeAuthorized = Date.now();
  const formattedTime = new Date(timeAuthorized).toUTCString();
  const pBalance = getClientBalance(store, clientWithdrawal.allocation);

  const handleInstructionFileUpload = (url: string) => {
    setInstructionFileURL(url);
  };

  const account = store.mma.all.find(
    (acc) => acc.asJson.accountNumber === clientWithdrawal.allocation
  )?.asJson;

  const handleReasonForNoAttachment = (reason: string) => {
    setReasonForNoAttachment(reason);
  };

  const accTypeId = getAccountTypeWithAccountNumber(
    clientWithdrawal.allocation,
    store
  );

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

  const clientAccountOptions = store.mma.all.filter(
    (mma) => mma.asJson.parentEntity === clientName
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

  const handleClientNameChange = (clientName: string) => {
    setClientWithdrawal({ ...clientWithdrawal, allocation: "" });
    setClientWithdrawal({ ...clientWithdrawal, bank: "" });
    setClientName(clientName);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const saveTransaction: IClientWithdrawalPayment = {
      ...defaultClientWithdrawalPayment,
      id: clientWithdrawal.id,
      allocation: clientWithdrawal.allocation,
      entity: clientWithdrawal.entity,
      amount: clientWithdrawal.amount,
      bank: clientWithdrawal.bank,
      reference: clientWithdrawal.reference,
      transactionDate: clientWithdrawal.transactionDate,
      valueDate: clientWithdrawal.valueDate,
      allocationStatus: "",
      allocatedBy: "By Client",
      reasonForNoProofOfPayment: clientWithdrawal.reasonForNoProofOfPayment,
      reasonForNoSourceOfFunds: clientWithdrawal.reasonForNoSourceOfFunds,
      instruction: instructionFileURL || "",
      reasonForNoInstruction: reasonForNoAttachment,
      isRecurring: clientWithdrawal.isRecurring || false,
      recurringDay: clientWithdrawal.recurringDay || null,
      transactionStatus: "authorised",
      allocationApprovedBy: store.auth.meJson?.uid || "",
      timeAuthorized: formattedTime,
      whoAuthorized: "By client",
      executionTime: formattedTime,
      previousBalance: pBalance,
    };

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Authorize transaction"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        try {
          try {
            await api.clientWithdrawalPayment.create(saveTransaction);
            //update mma account balance
            if (account) {
              const newBalance = pBalance - clientWithdrawal.amount;

              await api.mma.updateBalanceWithdraw(account, newBalance, 0);
            } else {
              console.log("Not updated because balance was not fount");
            }
            swal({
              icon: "success",
              text: `Transaction has been authorized`,
            });
          } catch (error) {
            console.log("Error2: ", error);
          } finally {
            onCancel();
          }
        } catch (error) {
          console.log();
        }

        //outflow
        const outflow: ITransactionOutflow = {
          id: "",
          transactionDate: clientWithdrawal.transactionDate || 0,
          amount: clientWithdrawal.amount,
          bank: clientWithdrawal.bank,
          product: accTypeId || "",
          status: "running",
        };

        //create
        try {
          await api.outflow.create(outflow);
        } catch (error) {
          console.log(error);
        }

        onCancel();
      } else {
        swal({
          icon: "error",
          text: "Transaction not authorised!",
        });
      }
    });

    setLoading(false);
  };

  const onCancel = () => {
    store.clientWithdrawalPayment.clearSelected();
    setClientName("");
    setClientWithdrawal({ ...defaultClientWithdrawalPayment });
    hideModalFromId(MODAL_NAMES.WITHDRAWAL_MODAL);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        api.client.naturalPerson.getAll(),
        api.client.legalEntity.getAll(),
        api.user.getAll(),
        api.mma.getAll(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.mma, api.user]);

  return (
    <ErrorBoundary>
      <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2 ">
        <button
          className="uk-modal-close-default"
          onClick={onCancel}
          type="button"
          data-uk-close
        ></button>
        <h3 className="main-title-small text-to-break">
          New Withdrawal Transaction
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

            {/* <div className="uk-width-1-1">
                                {!clientWithdrawal.isRecurring &&
                                    <div className="uk-form-controls uk-width-1-1">
                                        <label className="uk-form-label uk-display-block" htmlFor="recurringWithdrawal">
                                            Recurring Withdrawal{' '}
                                            <input
                                                className="uk-checkbox uk-margin-small-left"
                                                type="checkbox"
                                                checked={clientWithdrawal.isRecurring}
                                                onChange={(e) => setClientWithdrawal({ ...clientWithdrawal, isRecurring: e.target.checked })}
                                            />
                                        </label>
                                    </div>
                                }
                                {clientWithdrawal.isRecurring &&
                                    <div className="uk-form-controls uk-width-1-1">
                                        <label className="uk-form-label required" htmlFor="">Select Recurring Withdrawal Day</label>
                                        <DaySelector onChange={handleDayChange} />
                                    </div>
                                }
                            </div> */}

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
                    disabled={loading}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Record{" "}
                    {loading && <div data-uk-spinner={"ratio: .5"}></div>}
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

export default WithdrawalModal;

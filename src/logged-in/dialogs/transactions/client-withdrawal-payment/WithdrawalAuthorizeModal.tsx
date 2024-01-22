import swal from "sweetalert";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import {
  IClientWithdrawalPayment,
  defaultClientWithdrawalPayment,
} from "../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import MODAL_NAMES from "../../../dialogs/ModalName";
import { useState, FormEvent, useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { numberFormat } from "../../../../shared/functions/Directives";
import NumberInput from "../../../shared/number-input/NumberInput";
import { observer } from "mobx-react-lite";
import { dateFormat_YY_MM_DD } from "../../../../shared/utils/utils";
import { VerifyUploadComponent } from "../../../../shared/components/instruction-file-upload/edit-upload-component/VerifyComponent";
import { useNavigate } from "react-router-dom";
import {
  getAccountTypeWithAccountNumber,
  minusWithdrawalAmountFromBalance,
} from "../../../../shared/functions/MyFunctions";
import { ITransactionOutflow } from "../../../../shared/models/TransactionOutflowModel";

const WithdrawalAuthorizeModal = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [clientWithdrawal, setClientWithdrawal] =
    useState<IClientWithdrawalPayment>({ ...defaultClientWithdrawalPayment });
  const [clientName, setClientName] = useState("");
  const timeAuthorized = Date.now();
  const formattedTime = new Date(timeAuthorized).toUTCString();
  const me = store.auth.meJson;

  const onNavigate = useNavigate();

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

  const accTypeId = getAccountTypeWithAccountNumber(
    clientWithdrawal.allocation,
    store
  );

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
      allocatedBy: clientWithdrawal.allocatedBy,
      reasonForNoProofOfPayment: clientWithdrawal.reasonForNoProofOfPayment,
      reasonForNoSourceOfFunds: clientWithdrawal.reasonForNoSourceOfFunds,
      instruction: clientWithdrawal.instruction || "",
      reasonForNoInstruction: clientWithdrawal.reasonForNoInstruction,
      isRecurring: clientWithdrawal.isRecurring || false,
      recurringDay: clientWithdrawal.recurringDay || null,
      transactionStatus: "authorised",
      allocationApprovedBy: store.auth.meJson?.uid || "",
      timeAuthorized: formattedTime,
      whoAuthorized: me?.uid,
      executionTime: formattedTime,
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
            await api.clientWithdrawalPayment.update(saveTransaction);
            await minusWithdrawalAmountFromBalance(
              clientWithdrawal.amount,
              clientWithdrawal.allocation,
              store,
              api,
              clientWithdrawal.id
            );
            swal({
              icon: "success",
              text: `Transaction has been authorized`,
            });
          } catch (error) {
            console.log("Error2: ", error);
          } finally {
            onNavigate(`/c/client-payment/`);
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
    setLoading(false);
    hideModalFromId(MODAL_NAMES.BACK_OFFICE.AUTHORIZE_WITHDRAWAL_MODAL);
  };

  useEffect(() => {
    if (store.clientWithdrawalPayment.selected) {
      setClientWithdrawal(store.clientWithdrawalPayment.selected);
      setClientName(clientWithdrawal.entity);
      if (clientWithdrawal.recurringDay) {
        handleDayChange(clientWithdrawal.recurringDay.toString());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    clientWithdrawal.entity,
    clientWithdrawal.recurringDay,
    store.clientWithdrawalPayment.selected,
  ]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          api.client.legalEntity.getAll(),
          api.client.naturalPerson.getAll(),
          api.mma.getAll(),
          api.user.getAll(),
        ]);
      } catch (error) {}
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
          Authorize Withdrawal Transaction
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

            <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-3 uk-width-1-1">
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
                  Authorise
                </button>
              )}
              {availableBalance >= 0 && (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    Authorise
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

export default WithdrawalAuthorizeModal;

// const account = store.mma.all.find(
//   (mma) => mma.asJson.accountNumber === clientWithdrawal.allocation
// );

// if (account) {
//   const newBalance =
//     account.asJson.balance -
//     account.asJson.cession -
//     clientWithdrawal.amount;
//   const runningBalance =
//     account.asJson.balance -
//     account.asJson.cession -
//     clientWithdrawal.amount;

//   // update balance in MM account
//   const accountUpdate: IMoneyMarketAccount = {
//     id: account.asJson.id,
//     parentEntity: account.asJson.parentEntity,
//     accountNumber: account.asJson.accountNumber,
//     accountName: account.asJson.accountName,
//     accountType: account.asJson.accountType,
//     baseRate: account.asJson.baseRate || 0,
//     feeRate: account.asJson.feeRate,
//     cession: account.asJson.cession,
//     displayOnEntityStatement: account.asJson.displayOnEntityStatement,
//     balance: newBalance,
//     runningBalance: runningBalance,
//     //status: "Active",
//     status: "Pending",
//   };

//   try {
//     await api.mma.update(accountUpdate);
//   } catch (error) {}

//   // record as outflow
//   const outflow: ITransactionOutflow = {
//     id: "",
//     transactionDate: Date.now(),
//     amount: clientWithdrawal.amount,
//     bank: clientWithdrawal.bank || "",
//     product: accountUpdate.accountType,
//     status: "running",
//   };

//   try {
//     console.log(outflow);

//     //await api.outflow.create(outflow);

//     //notify client
//   } catch (error) {
//     console.log(error);
//   }
// }

import swal from "sweetalert";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import {
  IClientWithdrawalPayment,
  defaultClientWithdrawalPayment,
} from "../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import MODAL_NAMES from "../../ModalName";
import React, { useState, FormEvent, useEffect } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { numberFormat } from "../../../../shared/functions/Directives";
import NumberInput from "../../../shared/number-input/NumberInput";
import { IMoneyMarketAccount } from "../../../../shared/models/MoneyMarketAccount";
import { observer } from "mobx-react-lite";
import { dateFormat_YY_MM_DD } from "../../../../shared/utils/utils";

import { ITransactionOutflow } from "../../../../shared/models/TransactionOutflowModel";
import DaySelectorAuthorise from "../../../../shared/components/day-selector/DaySelectorAuthorise";

const WithdrawalAuthorizeModal = observer(() => {
  const { api, store } = useAppContext();

  const [loading, setLoading] = useState(false);

  const [clientWithdrawal, setClientWithdrawal] =
    useState<IClientWithdrawalPayment>({ ...defaultClientWithdrawalPayment });

  const [clientName, setClientName] = useState("");

  const [attachInstruction, setAttachInstruction] = useState(true);
  const [selectedInstructionFile, setSelectedInstructionFile] =
    useState<File | null>(null);
  const [instructionUploadProgress, setInstructionUploadProgress] =
    useState<number>(0);
  const [uploadedInstructionFileURL, setUploadedInstructionFileURL] = useState<
    string | null
  >(null);

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

  const handleInstructionFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setSelectedInstructionFile(e.target.files[0]);
    }
  };

  const handleInstructionUpload = async () => {
    if (!selectedInstructionFile) return;

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/Client Instruction`);
    const uploadTask = uploadBytesResumable(
      storageRef,
      selectedInstructionFile
    );

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setInstructionUploadProgress(progress);
    });

    try {
      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);
      setUploadedInstructionFileURL(downloadURL);

      setSelectedInstructionFile(null);
      setInstructionUploadProgress(0);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleInstructionFileReplace = async () => {
    if (!selectedInstructionFile) return;

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/Client Instruction`);

    try {
      const existingInstructionFileSnapshot = await getDownloadURL(storageRef);

      await deleteObject(storageRef);

      await handleInstructionUpload();
    } catch (error) {
      if (error === "storage/object-not-found") {
        await handleInstructionUpload();
      } else {
      }
    }
  };

  const handleDayChange = (selectedDay: string) => {
    setClientWithdrawal({
      ...clientWithdrawal,
      recurringDay: parseInt(selectedDay),
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const saveTransaction: IClientWithdrawalPayment = {
      ...defaultClientWithdrawalPayment,
      id: clientWithdrawal.id,
      allocation: clientWithdrawal.allocation,
      entity: clientWithdrawal.entity,
      amount: clientWithdrawal.amount,
      bank: clientWithdrawal.bank,
      reference: clientWithdrawal.reference,
      transactionDate: clientWithdrawal.transactionDate,
      allocationStatus: "allocated",
      reasonForNoProofOfPayment: clientWithdrawal.reasonForNoProofOfPayment,
      reasonForNoSourceOfFunds: clientWithdrawal.reasonForNoSourceOfFunds,
      instruction: uploadedInstructionFileURL || "",
      reasonForNoInstruction: clientWithdrawal.reasonForNoInstruction,
      isRecurring: clientWithdrawal.isRecurring || false,
      recurringDay: clientWithdrawal.recurringDay || null,
      transactionStatus: "verified",
      allocationApprovedBy: store.auth.meJson?.uid || "",
    };

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Authorize transaction"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        await update(saveTransaction);
        const account = store.mma.all.find(
          (mma) => mma.asJson.accountNumber === clientWithdrawal.allocation
        );
        if (account) {
          const newBalance =
            account.asJson.balance -
            account.asJson.cession -
            clientWithdrawal.amount;
          const runningBalance =
            account.asJson.balance -
            account.asJson.cession -
            clientWithdrawal.amount;

          // update balance in MM account
          const accountUpdate: IMoneyMarketAccount = {
            id: account.asJson.id,
            parentEntity: account.asJson.parentEntity,
            accountNumber: account.asJson.accountNumber,
            accountName: account.asJson.accountName,
            accountType: account.asJson.accountType,
            baseRate: account.asJson.baseRate || 0,
            feeRate: account.asJson.feeRate,
            cession: account.asJson.cession,
            displayOnEntityStatement: account.asJson.displayOnEntityStatement,
            balance: newBalance,
            runningBalance: runningBalance,
            status: "Active",
          };

          try {
            await api.mma.update(accountUpdate);
          } catch (error) {}

          // record as outflow
          const outflow: ITransactionOutflow = {
            id: "",
            transactionDate: Date.now(),
            amount: clientWithdrawal.amount,
            bank: clientWithdrawal.bank || "",
            product: accountUpdate.accountType,
            status: "running",
          };

          try {
            await api.outflow.create(outflow);
            onCancel();
            //notify client
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        swal({
          icon: "error",
          text: "Transaction verified!",
        });
      }
    });
    onCancel();
    setLoading(false);
  };

  const update = async (transaction: IClientWithdrawalPayment) => {
    try {
      await api.clientWithdrawalPayment.update(transaction);
      const account = store.mma.all.find(
        (mma) => mma.asJson.accountNumber === clientWithdrawal.allocation
      );
      if (account) {
        const newBalance = account.asJson.balance - clientWithdrawal.amount;
        const runningBalance = account.asJson.balance - clientWithdrawal.amount;

        // update balance in MM account
        const accountUpdate: IMoneyMarketAccount = {
          id: account.asJson.id,
          parentEntity: account.asJson.parentEntity,
          accountNumber: account.asJson.accountNumber,
          accountName: account.asJson.accountName,
          accountType: account.asJson.accountType,
          baseRate: account.asJson.baseRate || 0,
          feeRate: account.asJson.feeRate,
          cession: account.asJson.cession,
          displayOnEntityStatement: account.asJson.displayOnEntityStatement,
          balance: newBalance,
          runningBalance: runningBalance,
          status: "Active",
        };

        if (
          clientWithdrawal.isRecurring &&
          clientWithdrawal.recurringDay === Date.now()
        ) {
        }

        try {
          await api.mma.update(accountUpdate);
          onCancel();
        } catch (error) {}
      }
      swal({
        icon: "success",
        text: `Transaction has been verified, ${
          clientWithdrawal.isRecurring
            ? "a recurring payment has been requested. All recurring and online payments are automatically generated as a transaction"
            : ""
        }`,
      });
    } catch (error) {}
  };

  const onCancel = () => {
    store.clientWithdrawalPayment.clearSelected();
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
      {!loading && (
        <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2">
          <button
            className="uk-modal-close-default"
            onClick={onCancel}
            type="button"
            data-uk-close></button>
          <h3 className="uk-modal-title text-to-break">
            Authorize New Withdrawal Transaction
          </h3>

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
                  id="amount"
                  name={"amount"}
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

              <div className="uk-width-1-2">
                {!clientWithdrawal.isRecurring && (
                  <div className="uk-form-controls uk-width-1-1">
                    <label
                      className="uk-form-label uk-display-block"
                      htmlFor="recurringWithdrawal">
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
              </div>

              <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-2 uk-width-1-1">
                <div>
                  {clientWithdrawal.instruction && (
                    <div className="uk-form-controls">
                      <label
                        className="uk-form-label uk-display-block uk-margin-bottom"
                        htmlFor="instructionFile">
                        Attached Instruction
                      </label>
                      <a
                        className="btn btn-primary"
                        href={clientWithdrawal.instruction}
                        target="_blank"
                        rel="noopener noreferrer">
                        view file
                      </a>
                    </div>
                  )}
                  {clientWithdrawal.reasonForNoInstruction && (
                    <div className="uk-form-controls">
                      <label className="uk-form-label required" htmlFor="">
                        Reason for not attaching Instruction
                      </label>
                      <textarea
                        className="uk-textarea uk-form-small"
                        cols={40}
                        rows={5}
                        required
                        value={clientWithdrawal.reasonForNoInstruction}
                        onChange={(e) =>
                          setClientWithdrawal({
                            ...clientWithdrawal,
                            reasonForNoInstruction: e.target.value,
                          })
                        }
                        disabled></textarea>
                    </div>
                  )}
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
                  onClick={onCancel}>
                  cancel
                </button>
                {availableBalance < 0 && (
                  <button type="submit" className="btn btn-primary" disabled>
                    authorize
                  </button>
                )}
                {availableBalance >= 0 && (
                  <>
                    <button type="submit" className="btn btn-primary">
                      authorize
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
});

export default WithdrawalAuthorizeModal;

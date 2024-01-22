import { FormEvent, useEffect, useState } from "react";

import swal from "sweetalert";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import {
  IClientDepositAllocation,
  defaultClientDepositAllocation,
} from "../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import MODAL_NAMES from "../../../dialogs/ModalName";
import NumberInput from "../../../shared/number-input/NumberInput";
import { dateFormat_YY_MM_DD } from "../../../../shared/utils/utils";
import { observer } from "mobx-react-lite";
import InstructionFileUploader from "../../../../shared/components/instruction-file-upload/InstructionFileUploader";

const DepositModal = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const [newClientDepositAllocation, setNewClientDepositAllocation] =
    useState<IClientDepositAllocation>({ ...defaultClientDepositAllocation });

  const [entityId, setEntityId] = useState("");
  const [instructionFileURL, setInstructionFileURL] = useState("");
  const [reasonForNoAttachment, setReasonForNoAttachment] = useState("");

  const [popFileURL, setPoPFileURL] = useState("");
  const [reasonForNoPoPAttachment, setReasonForNoPoPAttachment] = useState("");

  const [sourceOfFundsFileURL, setInstructionSourceOfFundsFileURL] =
    useState("");
  const [
    reasonForNoSourceOfFundsAttachment,
    setReasonForNoSourceOfFundsAttachment,
  ] = useState("");

  const handleInstructionFileUpload = (url: string) => {
    // Handle the URL in the parent component
    setInstructionFileURL(url);
  };

  const handleReasonForNoAttachment = (reason: string) => {
    // Handle the URL in the parent component
    setReasonForNoAttachment(reason);
  };

  const handlePoPFileUpload = (url: string) => {
    // Handle the URL in the parent component
    setPoPFileURL(url);
  };

  const handleReasonForPoPNoAttachment = (reason: string) => {
    // Handle the URL in the parent component
    setReasonForNoPoPAttachment(reason);
  };

  const handleSourceOfFundsFileUpload = (url: string) => {
    // Handle the URL in the parent component
    setInstructionSourceOfFundsFileURL(url);
  };

  const handleReasonForNoSourceOfFundsAttachment = (reason: string) => {
    // Handle the URL in the parent component
    setReasonForNoSourceOfFundsAttachment(reason);
  };

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

  const clientAccountOptions = store.mma.all.filter(
    (mma) =>
      mma.asJson.parentEntity === entityId && mma.asJson.status === "Active"
  );

  const clientOptions = clients.map((cli) => ({
    label: cli.asJson.entityDisplayName,
    value: cli.asJson.entityId,
  }));

  //logit to handle pulling the the selected client monthly and yearly limit
  const entities = store.client.naturalPerson.all.map((n) => {
    return n.asJson;
  });
  const selectedClientMonthlyLimit =
    entities.find((e) => e.entityId === entityId)?.singleTransactionLimit ?? 0;

  const selectedClientYearlyLimit =
    entities.find((e) => e.entityId === entityId)?.annualInvestmentLimit ?? 0;

  //the list of deposits and handle logic
  const depositList = store.clientDepositAllocation.all.map((n) => {
    return n.asJson;
  });
  const selectedClientDeposits = depositList.filter(
    (e) => e.entity === entityId
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const saveTransaction: IClientDepositAllocation = {
      ...defaultClientDepositAllocation,
      entity: entityId,
      allocation: newClientDepositAllocation.allocation,
      amount: newClientDepositAllocation.amount,
      bank: newClientDepositAllocation.bank,
      reference: newClientDepositAllocation.reference,
      description: newClientDepositAllocation.description,
      allocatedBy: store.auth.meJson?.uid || "",
      valueDate: newClientDepositAllocation.valueDate,
      transactionDate: Date.now(),
      allocationStatus: "",
      proofOfPayment: popFileURL,
      reasonForNoProofOfPayment: reasonForNoPoPAttachment,
      sourceOfFunds: sourceOfFundsFileURL,
      reasonForNoSourceOfFunds: reasonForNoSourceOfFundsAttachment,
      instruction: instructionFileURL,
      reasonForNoInstruction: reasonForNoAttachment,
    };

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Record"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        await create(saveTransaction);
        onCancel();
      } else {
        swal({
          icon: "error",
          text: "Transaction cancelled!",
        });
      }
    });
    setLoading(false);
    store.clientDepositAllocation.clearSelected();
    setNewClientDepositAllocation({ ...defaultClientDepositAllocation });
  };

  const create = async (transaction: IClientDepositAllocation) => {
    try {
      await api.clientDepositAllocation.create(transaction);
      swal({
        icon: "success",
        text: "Transaction has been recorded",
      });
    } catch (error) {}
  };

  const onCancel = () => {
    store.clientDepositAllocation.clearSelected();
    setEntityId("");
    setNewClientDepositAllocation({ ...defaultClientDepositAllocation });
    hideModalFromId(MODAL_NAMES.BACK_OFFICE.RECORD_DEPOSIT_MODAL);
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await api.client.legalEntity.getAll();
      await api.client.naturalPerson.getAll();
      await api.user.getAll();
      await api.mma.getAll();
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.user, api.mma]);

  //building function to check montly limit and monthly limit
  // useEffect(() => {
  //   // Check if it's a new month
  //   const currentDate = new Date();
  //   const currentMonth = currentDate.getMonth();
  //   const storedMonth = localStorage.getItem("currentMonth");

  //   if (currentMonth !== Number(storedMonth)) {
  //     // Reset monthly limit for the new month
  //     localStorage.setItem("currentMonth", String(currentMonth));
  //   }
  // }, [selectedClientMonthlyLimit]);

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
          New Deposit Transaction
        </h3>

        <div className="dialog-content uk-position-relative">
          <form className="uk-grid" data-uk-grid onSubmit={handleSubmit}>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Client Name
              </label>
              <SingleSelect
                options={clientOptions}
                name="clientName"
                value={newClientDepositAllocation.allocation}
                onChange={(value) => setEntityId(value)}
                placeholder="e.g Client Name"
                required
              />
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Client Account (Product)
              </label>
              <select
                className="uk-select uk-form-small"
                value={newClientDepositAllocation.allocation}
                id="clientAccount"
                name={"clientAccount"}
                onChange={(e) =>
                  setNewClientDepositAllocation({
                    ...newClientDepositAllocation,
                    allocation: e.target.value,
                  })
                }
                required
              >
                <option value={""} disabled>
                  Select...
                </option>
                {clientAccountOptions.map((acc, index) => (
                  <option key={acc.asJson.id} value={acc.asJson.accountNumber}>
                    {acc.asJson.accountNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Client Monthly Limit
              </label>
              <input
                className="uk-input uk-form-small"
                id="amount"
                type="text"
                name={"date"}
                value={selectedClientMonthlyLimit}
                required
              />
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Client Yearly Limit
              </label>
              <input
                className="uk-input uk-form-small"
                id="amount"
                type="text"
                name={"date"}
                value={selectedClientYearlyLimit}
                required
              />
              {entityId !== "" &&
                selectedClientYearlyLimit > 0 &&
                newClientDepositAllocation.amount >
                  selectedClientYearlyLimit && (
                  <p style={{ color: "red" }}>
                    Monthly limit reached. Please wait for the new month.
                  </p>
                )}
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Value Date
              </label>
              <input
                className="uk-input uk-form-small"
                id="amount"
                type="date"
                name={"date"}
                value={dateFormat_YY_MM_DD(
                  newClientDepositAllocation.valueDate
                )}
                onChange={(e) =>
                  setNewClientDepositAllocation({
                    ...newClientDepositAllocation,
                    valueDate: new Date(e.target.value).getTime(),
                  })
                }
                required
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
                value={newClientDepositAllocation.amount}
                onChange={(value) =>
                  setNewClientDepositAllocation({
                    ...newClientDepositAllocation,
                    amount: Number(value),
                  })
                }
              />
              {entityId !== "" &&
                selectedClientMonthlyLimit > 0 &&
                newClientDepositAllocation.amount >
                  selectedClientMonthlyLimit && (
                  <p style={{ color: "red" }}>
                    Monthly limit reached. Please wait for the new month.
                  </p>
                )}
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Bank
              </label>
              <select
                className="uk-select uk-form-small"
                value={newClientDepositAllocation.bank}
                id="bank"
                name={"bank"}
                onChange={(e) =>
                  setNewClientDepositAllocation({
                    ...newClientDepositAllocation,
                    bank: e.target.value,
                  })
                }
                required
              >
                <option value={""} disabled>
                  Select...
                </option>
                <option value={"SBN"}>Standard Bank Namibia</option>
                <option value={"NBN"}>NedBank Namibia</option>
              </select>
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Reference
              </label>
              <input
                className="uk-input uk-form-small"
                value={newClientDepositAllocation.reference}
                type="text"
                id="reference"
                name={"reference"}
                onChange={(e) =>
                  setNewClientDepositAllocation({
                    ...newClientDepositAllocation,
                    reference: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="uk-form-controls uk-width-1-1">
              <label className="uk-form-label required" htmlFor="">
                Description
              </label>
              <input
                className="uk-input uk-form-small"
                type="text"
                value={newClientDepositAllocation.description}
                id="description"
                name={"description"}
                onChange={(e) =>
                  setNewClientDepositAllocation({
                    ...newClientDepositAllocation,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-3 uk-width-1-1">
              <div>
                <InstructionFileUploader
                  onFileUpload={handleInstructionFileUpload}
                  onProvideReason={handleReasonForNoAttachment}
                  fileUrl={newClientDepositAllocation.instruction}
                  reasonForNotProvingFile={
                    newClientDepositAllocation.reasonForNoInstruction
                  }
                  label="Client Instruction"
                  allocation={newClientDepositAllocation.allocation}
                />
              </div>
              <div>
                <InstructionFileUploader
                  onFileUpload={handlePoPFileUpload}
                  onProvideReason={handleReasonForPoPNoAttachment}
                  fileUrl={newClientDepositAllocation.proofOfPayment}
                  reasonForNotProvingFile={
                    newClientDepositAllocation.reasonForNoProofOfPayment
                  }
                  label="Proof of Payment"
                  allocation={newClientDepositAllocation.allocation}
                />
              </div>
              <div>
                <InstructionFileUploader
                  onFileUpload={handleSourceOfFundsFileUpload}
                  onProvideReason={handleReasonForNoSourceOfFundsAttachment}
                  fileUrl={newClientDepositAllocation.sourceOfFunds}
                  reasonForNotProvingFile={
                    newClientDepositAllocation.reasonForNoSourceOfFunds
                  }
                  label="Source of Funds"
                  allocation={newClientDepositAllocation.allocation}
                />
              </div>
            </div>
            <div className="uk-form-controls">
              <button
                type="button"
                className="btn btn-danger"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  (entityId !== "" &&
                    selectedClientMonthlyLimit > 0 &&
                    newClientDepositAllocation.amount >
                      selectedClientMonthlyLimit) ||
                  (entityId !== "" &&
                    selectedClientYearlyLimit > 0 &&
                    newClientDepositAllocation.amount >
                      selectedClientYearlyLimit) || loading
                }
              >
                Record {loading && <div data-uk-spinner={"ratio:.5"}></div>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default DepositModal;

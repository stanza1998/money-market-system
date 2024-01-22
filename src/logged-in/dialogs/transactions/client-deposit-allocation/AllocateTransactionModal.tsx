import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import {
  IClientDepositAllocation,
  defaultClientDepositAllocation,
} from "../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import swal from "sweetalert";
import InstructionFileUploader from "../../../../shared/components/instruction-file-upload/InstructionFileUploader";
import { observer } from "mobx-react-lite";

interface IProps {
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

const AllocateTransactionModal = observer((props: IProps) => {
  const { api, store } = useAppContext();
  const { setSelectedTab } = props;
  const timeAllocated = Date.now();
  const formattedAllocated = new Date(timeAllocated).toUTCString();
  const me = store.auth.meJson;
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [clientDepositAllocation, setClientDepositAllocation] =
    useState<IClientDepositAllocation>({ ...defaultClientDepositAllocation });
  const [newClientDepositAllocation, setNewClientDepositAllocation] =
    useState<IClientDepositAllocation>({ ...defaultClientDepositAllocation });

  const [instructionFileURL, setInstructionFileURL] = useState("");
  const [reasonForNoAttachmentURL, setReasonForNoAttachmentURL] = useState("");

  const [popFileURL, setPoPFileURL] = useState("");
  const [reasonForNoPoPAttachmentURL, setReasonForNoPoPAttachmentURL] =
    useState("");

  const [sourceOfFundsFileURL, setInstructionSourceOfFundsFileURL] =
    useState("");
  const [
    reasonForNoSourceOfFundsAttachmentURL,
    setReasonForNoSourceOfFundsAttachmentURL,
  ] = useState("");

  const handleInstructionFileUpload = (url: string) => {
    // Handle the URL in the parent component
    setInstructionFileURL(url);
  };

  const handleReasonForNoAttachment = (url: string) => {
    // Handle the URL in the parent component
    setReasonForNoAttachmentURL(url);
  };

  const handlePoPFileUpload = (url: string) => {
    // Handle the URL in the parent component
    setPoPFileURL(url);
  };

  const handleReasonForPoPNoAttachment = (url: string) => {
    // Handle the URL in the parent component
    setReasonForNoPoPAttachmentURL(url);
  };

  const handleSourceOfFundsFileUpload = (url: string) => {
    // Handle the URL in the parent component
    setInstructionSourceOfFundsFileURL(url);
  };

  const handleReasonForNoSourceOfFundsAttachment = (url: string) => {
    // Handle the URL in the parent component
    setReasonForNoSourceOfFundsAttachmentURL(url);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const saveTransaction: IClientDepositAllocation = {
      ...clientDepositAllocation,
      allocation: newClientDepositAllocation.allocation,
      entity: clientName,
      allocationStatus: "allocated",

      bank: newClientDepositAllocation.bank,
      reference: newClientDepositAllocation.reference,
      allocatedBy: store.auth.meJson?.uid || "",
      transactionDate: newClientDepositAllocation.transactionDate,

      instruction: instructionFileURL,
      reasonForNoInstruction: reasonForNoAttachmentURL,

      sourceOfFunds: sourceOfFundsFileURL,
      reasonForNoSourceOfFunds: reasonForNoSourceOfFundsAttachmentURL,

      proofOfPayment: popFileURL,
      reasonForNoProofOfPayment: reasonForNoPoPAttachmentURL,

      //time allocated
      timeAllocated: formattedAllocated,
      whoAllocated: me?.uid,
    };

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Re-allocate"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        await update(saveTransaction);
        onCancel();
        setSelectedTab("allocated-tab");
      } else {
        swal({
          icon: "error",
          text: "Re-allocation cancelled!",
        });
      }
    });
  };

  const update = async (transaction: IClientDepositAllocation) => {
    try {
      await api.clientDepositAllocation.update(transaction);
      swal({
        icon: "success",
        text: "Transaction has been re-allocated",
      });
    } catch (error) { }
  };

  const onCancel = () => {
    store.clientDepositAllocation.clearSelected();
    setClientDepositAllocation({ ...defaultClientDepositAllocation });
    setNewClientDepositAllocation({ ...defaultClientDepositAllocation });
    hideModalFromId(
      MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.ALLOCATE_TRANSACTION_MODAL
    );
    setLoading(false);
  };

  useEffect(() => {
    if (store.clientDepositAllocation.selected) {
      setClientDepositAllocation(store.clientDepositAllocation.selected);
    }
  }, [store.clientDepositAllocation.selected]);

  useEffect(() => {
    const loadData = async () => {
      await api.client.legalEntity.getAll();
      await api.client.naturalPerson.getAll();
      await api.user.getAll();
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.user]);

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
        <h3 className="main-title-small text-to-break">Allocate Transaction</h3>
        <p>{clientDepositAllocation.description}</p>
        <div className="dialog-content uk-position-relative">
          <form className="uk-grid" data-uk-grid onSubmit={handleSubmit}>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label" htmlFor="">
                Client Name
              </label>
              <SingleSelect
                options={clientOptions}
                name="clientName"
                value={newClientDepositAllocation.allocation}
                onChange={(value) => setClientName(value)}
                placeholder="e.g Client Name"
                required
              />
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label" htmlFor="">
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

            <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-3 uk-width-1-1">
              <div>
                <InstructionFileUploader
                  onFileUpload={handleInstructionFileUpload}
                  onProvideReason={handleReasonForNoAttachment}
                  fileUrl={clientDepositAllocation.instruction}
                  reasonForNotProvingFile={
                    clientDepositAllocation.reasonForNoInstruction
                  }
                  label="Client Instruction"
                  allocation={clientDepositAllocation.allocation}
                />
              </div>
              <div>
                <InstructionFileUploader
                  onFileUpload={handlePoPFileUpload}
                  onProvideReason={handleReasonForPoPNoAttachment}
                  fileUrl={clientDepositAllocation.proofOfPayment}
                  reasonForNotProvingFile={
                    clientDepositAllocation.reasonForNoProofOfPayment
                  }
                  label="Proof of Payment"
                  allocation={clientDepositAllocation.allocation}
                />
              </div>
              <div>
                <InstructionFileUploader
                  onFileUpload={handleSourceOfFundsFileUpload}
                  onProvideReason={handleReasonForNoSourceOfFundsAttachment}
                  fileUrl={clientDepositAllocation.sourceOfFunds}
                  reasonForNotProvingFile={
                    clientDepositAllocation.reasonForNoSourceOfFunds
                  }
                  label="Source of Funds"
                  allocation={clientDepositAllocation.allocation}
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
                disabled={loading}
              >
                Allocate {loading && <div data-uk-spinner={"ratio:.5"}></div>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default AllocateTransactionModal;

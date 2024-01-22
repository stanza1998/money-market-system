import { FormEvent, useEffect, useState } from "react";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import {
  IClientDepositAllocation,
  defaultClientDepositAllocation,
} from "../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import { currencyFormat } from "../../../../shared/functions/Directives";
import { LoadingEllipsis } from "../../../../shared/components/loading/Loading";
import swal from "sweetalert";
import { observer } from "mobx-react-lite";
import { EditUploadComponent } from "../../../../shared/components/instruction-file-upload/edit-upload-component/EditUploadComponent";
import { VerifyUploadComponent } from "../../../../shared/components/instruction-file-upload/edit-upload-component/VerifyComponent";
import { dateFormat_YY_MM_DD_NEW } from "../../../../shared/utils/utils";

export const ViewDepositTransaction = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [entityLoader, setEntityLoader] = useState<boolean>(false);
  const [entityId, setEntityId] = useState("");
  const [clientDepositAllocation, setClientDepositAllocation] =
    useState<IClientDepositAllocation>({ ...defaultClientDepositAllocation });

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

  const clientAccountOptions = store.mma.all.filter(
    (mma) => mma.asJson.parentEntity === entityId
  );

  const clientOptions = clients.map((cli) => ({
    label: cli.asJson.entityDisplayName,
    value: cli.asJson.entityId,
  }));

  const users = store.user.all;
  const mmAccounts = store.mma.all;

  const getClientName = (transaction: IClientDepositAllocation) => {
    const account = mmAccounts.find(
      (account) => account.asJson.accountNumber === transaction.allocation
    );
    if (account) {
      const client = clients.find(
        (client) => client.asJson.entityId === account.asJson.parentEntity
      );
      if (client) {
        const clientName = client.asJson.entityDisplayName;
        return clientName;
      }
    } else {
      return "";
    }
  };

  const getEntityId = (transaction: IClientDepositAllocation) => {
    const account = mmAccounts.find(
      (account) => account.asJson.accountNumber === transaction.allocation
    );
    if (account) {
      const client = clients.find(
        (client) => client.asJson.entityId === account.asJson.parentEntity
      );
      if (client) {
        const entityId = client.asJson.entityId;
        return entityId;
      }
    } else {
      return "";
    }
  };

  const getAllocatorName = (transaction: IClientDepositAllocation) => {
    if (users) {
      const allocator = users.find(
        (user) => user.asJson.uid === transaction.allocatedBy
      );
      if (allocator) {
        const allocatorName = allocator.asJson.displayName;
        return allocatorName;
      }
      return "";
    }
    return "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const saveTransaction: IClientDepositAllocation = {
      ...clientDepositAllocation,
      allocation: clientDepositAllocation.allocation,
      //added properties
      bank: clientDepositAllocation.bank,
      reference: clientDepositAllocation.reference,
      allocatedBy: store.auth.meJson?.uid || "",
      transactionDate: clientDepositAllocation.transactionDate,
      allocationStatus: "",
      entity: entityId,
      proofOfPayment: clientDepositAllocation.proofOfPayment,
      reasonForNoProofOfPayment:
        clientDepositAllocation.reasonForNoProofOfPayment,
      sourceOfFunds: clientDepositAllocation.sourceOfFunds,
      reasonForNoSourceOfFunds:
        clientDepositAllocation.reasonForNoSourceOfFunds,
      instruction: clientDepositAllocation.instruction,
      reasonForNoInstruction: clientDepositAllocation.reasonForNoInstruction,
    };

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Update"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        await update(saveTransaction);
        onCancel();
      } else {
        swal({
          icon: "error",
          text: "Transaction not edited!",
        });
        onCancel();
      }
    });
    setLoading(false);
  };

  const update = async (transaction: IClientDepositAllocation) => {
    console.log(transaction);

    try {
      await api.clientDepositAllocation.update(transaction);
      swal({
        icon: "success",
        text: "Transaction has been edited!",
      });
    } catch (error) {}
  };

  const onCancel = () => {
    store.clientDepositAllocation.clearSelected();
    setEntityId("");
    setClientDepositAllocation({ ...defaultClientDepositAllocation });
    setClientDepositAllocation({ ...defaultClientDepositAllocation });
    hideModalFromId(MODAL_NAMES.BACK_OFFICE.VIEW_DEPOSIT_TRANSACTION);
    setLoading(false);
  };

  useEffect(() => {
    if (store.clientDepositAllocation.selected) {
      setClientDepositAllocation(store.clientDepositAllocation.selected);
    }
  }, [store.clientDepositAllocation.selected]);

  useEffect(() => {
    setEntityLoader(true);
    if (clientDepositAllocation.entity) {
      setEntityId(clientDepositAllocation.entity);
    }
    setEntityLoader(false);
  }, [clientDepositAllocation.entity]);

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
          type="button"
          data-uk-close
        ></button>
        <h3 className="main-title-small text-to-break">Edit Transaction</h3>

        <div className="dialog-content uk-position-relative">
          <div className="uk-grid">
            <div className="uk-card uk-width-1-1">
              <div className="uk-card-body">
                <h4>Allocated Transaction Details</h4>
                <div className="uk-grid">
                  <div className="uk-width-1-3">
                    <p>Date</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>
                      {dateFormat_YY_MM_DD_NEW(
                        clientDepositAllocation.transactionDate
                      )}
                    </p>
                  </div>
                  <hr className="uk-width-1-1" />
                  <div className="uk-width-1-3">
                    <p>Reference</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{clientDepositAllocation.reference}</p>
                  </div>
                  <hr className="uk-width-1-1" />
                  <div className="uk-width-1-3">
                    <p>Amount</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{currencyFormat(clientDepositAllocation.amount)}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Allocated To(Entity ID)</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{getEntityId(clientDepositAllocation)}</p>
                  </div>
                  <hr className="uk-width-1-1" />

                  <div className="uk-width-1-3">
                    <p>Allocated To(Entity Name)</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{getClientName(clientDepositAllocation)}</p>
                  </div>
                  <hr className="uk-width-1-1" />
                  <div className="uk-width-1-3">
                    <p>Account Allocated To</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{clientDepositAllocation.allocation}</p>
                  </div>
                  <hr className="uk-width-1-1" />
                  <div className="uk-width-1-3">
                    <p>Allocated By</p>
                  </div>
                  <div className="uk-width-2-3">
                    <p>{getAllocatorName(clientDepositAllocation)}</p>
                  </div>
                  <hr className="uk-width-1-1" />
                </div>
              </div>
            </div>
          </div>
          <form className="uk-grid" data-uk-grid onSubmit={handleSubmit}>
            <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-3 uk-width-1-1">
              <div>
                <VerifyUploadComponent
                  onFileUpload={(fileUrl) => {
                    // Update clientDepositAllocation or perform other actions with fileUrl
                    setClientDepositAllocation((prev) => ({
                      ...prev,
                      instruction: fileUrl,
                    }));
                  }}
                  onProvideReason={(reason) => {
                    // Update clientDepositAllocation or perform other actions with reason
                    setClientDepositAllocation((prev) => ({
                      ...prev,
                      reasonForNoInstruction: reason,
                    }));
                  }}
                  fileUrl={clientDepositAllocation.instruction}
                  reasonForNotProvingFile={
                    clientDepositAllocation.reasonForNoInstruction
                  }
                  label="Client Instruction"
                  allocation={clientDepositAllocation.allocation}
                />
              </div>
              <div>
                <VerifyUploadComponent
                  onFileUpload={(fileUrl) => {
                    // Update clientDepositAllocation or perform other actions with fileUrl
                    setClientDepositAllocation((prev) => ({
                      ...prev,
                      proofOfPayment: fileUrl,
                    }));
                  }}
                  onProvideReason={(reason) => {
                    // Update clientDepositAllocation or perform other actions with reason
                    setClientDepositAllocation((prev) => ({
                      ...prev,
                      reasonForNoProofOfPayment: reason,
                    }));
                  }}
                  fileUrl={clientDepositAllocation.proofOfPayment}
                  reasonForNotProvingFile={
                    clientDepositAllocation.reasonForNoProofOfPayment
                  }
                  label="Proof of Payment"
                  allocation={clientDepositAllocation.allocation}
                />
              </div>
              <div>
                <VerifyUploadComponent
                  onFileUpload={(fileUrl) => {
                    // Update clientDepositAllocation or perform other actions with fileUrl
                    setClientDepositAllocation((prev) => ({
                      ...prev,
                      sourceOfFunds: fileUrl,
                    }));
                  }}
                  onProvideReason={(reason) => {
                    // Update clientDepositAllocation or perform other actions with reason
                    setClientDepositAllocation((prev) => ({
                      ...prev,
                      reasonForNoSourceOfFunds: reason,
                    }));
                  }}
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
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </ErrorBoundary>
  );
});

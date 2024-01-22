import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import swal from "sweetalert";
import { useAppContext } from "../../../../shared/functions/Context";
import {
  IClientDepositAllocation,
  defaultClientDepositAllocation,
} from "../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import { observer } from "mobx-react-lite";
import React from "react";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { VerifyUploadComponent } from "../../../../shared/components/instruction-file-upload/edit-upload-component/VerifyComponent";
import { useNavigate } from "react-router-dom";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import { currencyFormat } from "../../../../shared/functions/Directives";
import {
  addDepositedAmountToBalance,
  getAccountType,
  getAccountTypeWithAccountNumber,
} from "../../../../shared/functions/MyFunctions";
import { ITransactionInflow } from "../../../../shared/models/TransactionInflowModel";

interface IProps {
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

const VerifyDepositModalClient = observer((props: IProps) => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [entityId, setEntityId] = useState("");
  const { setSelectedTab } = props;
  const timeVerified = Date.now();
  const formattedAllocated = new Date(timeVerified).toUTCString();
  const me = store.auth.meJson;

  const [clientDepositAllocation, setClientDepositAllocation] =
    useState<IClientDepositAllocation>({ ...defaultClientDepositAllocation });

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

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

  const accTypeId = getAccountTypeWithAccountNumber(
    clientDepositAllocation.allocation,
    store
  );

  const handleTransactionVerification = async (e: any) => {
    e.preventDefault();
    const newClient: IClientDepositAllocation = {
      ...clientDepositAllocation,
      transactionStatus: "verified",
      timeVerified: formattedAllocated,
      whoVerified: me?.uid,
      executionTime: formattedAllocated,
    };
    try {
      setLoading(true);
      await api.clientDepositAllocation.update(newClient);
      addDepositedAmountToBalance(
        newClient.amount,
        newClient.allocation,
        store,
        api,
        clientDepositAllocation.id
      );
      //inflows
      const inflow: ITransactionInflow = {
        id: "",
        transactionDate: clientDepositAllocation.transactionDate || 0,
        amount: clientDepositAllocation.amount,
        bank: clientDepositAllocation.bank,
        product: accTypeId || "",
        status: "running",
      };

      //create
      try {
        await api.inflow.create(inflow);
      } catch (error) {
        console.log(error);
      }

      setSelectedTab("verified-tab");
      setLoading(false);
      hideModalFromId(MODAL_NAMES.BACK_OFFICE.RECORD_UPLOAD_MODAL);
    } catch (error) {}
  };

  useEffect(() => {
    if (store.clientDepositAllocation.selected) {
      setClientDepositAllocation(store.clientDepositAllocation.selected);
    } else {
      return;
    }
  }, [store.clientDepositAllocation.selected]);

  useEffect(() => {
    // setEntityLoader(true);
    if (clientDepositAllocation.entity) {
      setEntityId(clientDepositAllocation.entity);
    }
    // setEntityLoader(false);
  }, [clientDepositAllocation.entity]);

  useEffect(() => {
    const loadData = async () => {
      await api.client.legalEntity.getAll();
      await api.client.naturalPerson.getAll();
      await api.mma.getAll();
      await api.user.getAll();
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.user, api.mma]);

  return (
    <ErrorBoundary>
      <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2">
        <button
          className="uk-modal-close-default"
          disabled={loading}
          type="button"
          data-uk-close
        ></button>
        <h3 className="uk-modal-title text-to-break">Verify Transaction</h3>
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
                    <p>{clientDepositAllocation.transactionDate}</p>
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
          <div>
            <form
              className="uk-grid"
              data-uk-grid
              onSubmit={handleTransactionVerification}
            >
              <div
                className="uk-form-controls uk-margin"
                style={{ marginTop: "2rem" }}
              >
                <button type="button" className="btn btn-danger">
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  Verify {loading && <div data-uk-spinner={"ratio:.5"}></div>}
                </button>
              </div>
            </form>
          </div>

          {/* //ends here */}
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default VerifyDepositModalClient;

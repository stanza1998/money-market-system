import swal from "sweetalert";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import {
  IClientWithdrawalPayment,
  defaultClientWithdrawalPayment,
} from "../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import MODAL_NAMES from "../../../dialogs/ModalName";
import { useState, FormEvent, useEffect } from "react";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../../shared/functions/Context";
import { numberFormat } from "../../../../shared/functions/Directives";
import NumberInput from "../../../shared/number-input/NumberInput";
import { observer } from "mobx-react-lite";
import { dateFormat_YY_MM_DD } from "../../../../shared/utils/utils";
import { EditUploadComponent } from "../../../../shared/components/instruction-file-upload/edit-upload-component/EditUploadComponent";

const WithdrawalUpdateModal = observer(() => {
  const { api, store } = useAppContext();

  const [loading, setLoading] = useState(false);

  const [clientWithdrawal, setClientWithdrawal] =
    useState<IClientWithdrawalPayment>({ ...defaultClientWithdrawalPayment });

  const [entityId, setEntityId] = useState("");

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

  const clientAccounts = store.mma.all.filter(
    (mma) => mma.asJson.parentEntity === entityId
  );

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
    (client) => client.asJson.entityId === entityId
  );

  const bankAccounts = selectedClient?.asJson.bankingDetail.map((acc) => ({
    label: `${acc.bankName} | ${acc.accountNumber} | ${acc.accountHolder}`,
    value: acc.accountNumber,
  }));

  const clientAccountOptions = clientAccounts.map((acc) => ({
    label: acc.asJson.accountNumber,
    value: acc.asJson.accountNumber,
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

    const saveTransaction: IClientWithdrawalPayment = {
      ...defaultClientWithdrawalPayment,
      id: clientWithdrawal.id,
      allocation: clientWithdrawal.allocation,
      entity: clientWithdrawal.entity,
      amount: clientWithdrawal.amount,
      bank: clientWithdrawal.bank,
      reference: clientWithdrawal.reference,
      description: clientWithdrawal.description,
      allocatedBy: store.auth.meJson?.uid || "",
      transactionDate: clientWithdrawal.transactionDate,
      transactionStatus: "pending",
      reasonForNoProofOfPayment: "",
      reasonForNoSourceOfFunds: "",
      instruction: clientWithdrawal.instruction,
      reasonForNoInstruction: clientWithdrawal.reasonForNoInstruction,
      isRecurring: clientWithdrawal.isRecurring,
      recurringDay: clientWithdrawal.recurringDay,
      valueDate: clientWithdrawal.valueDate,
    };

    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Update transaction"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        setLoading(true);
        await update(saveTransaction);
        onCancel();
      } else {
        swal({
          icon: "error",
          text: "Transaction updating cancelled!",
        });
        onCancel();
      }
    });

    setLoading(false);
  };

  const update = async (transaction: IClientWithdrawalPayment) => {
    try {
      await api.clientWithdrawalPayment.update(transaction);
      swal({
        icon: "success",
        text: `Transaction has been updated!`,
      });
    } catch (error) {}
  };

  const onCancel = () => {
    store.clientWithdrawalPayment.clearSelected();
    setClientWithdrawal({ ...defaultClientWithdrawalPayment });
    hideModalFromId(MODAL_NAMES.BACK_OFFICE.EDIT_WITHDRAWAL_MODAL);
    setLoading(false);
  };

  useEffect(() => {
    if (store.clientWithdrawalPayment.selected) {
      setClientWithdrawal(store.clientWithdrawalPayment.selected);
      setEntityId(clientWithdrawal.entity);
      if (clientWithdrawal.recurringDay) {
        handleDayChange(clientWithdrawal.recurringDay.toString());
      }
    }
  }, [
    // clientWithdrawal.entity,
    // clientWithdrawal.recurringDay,
    // handleDayChange,
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
      <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-2">
        <button
          className="uk-modal-close-default"
          onClick={onCancel}
          disabled={loading}
          type="button"
          data-uk-close
        ></button>
        <h3 className="main-title-small text-to-break">
          Edit Withdrawal Transaction
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
                type="text"
                name={"valueDate"}
                value={dateFormat_YY_MM_DD(clientWithdrawal.valueDate)}
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
              <input
                className="uk-input uk-form-small"
                type="text"
                value={bankAccounts && bankAccounts.at(0)?.label}
                onChange={(e) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    bank: e.target.value,
                  })
                }
                disabled
              />
            </div>
            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="">
                Client Money Market Account
              </label>

              <SingleSelect
                options={clientAccountOptions}
                name="clientAccount"
                value={clientWithdrawal.allocation}
                onChange={(value) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    allocation: value,
                  })
                }
                placeholder="e.g Client Money Market Account"
                isClearable={false}
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
              />
            </div>

            <div className="uk-form-controls uk-width-1-2">
              <label className="uk-form-label required" htmlFor="amount">
                Reference
              </label>
              <textarea
                className="uk-textarea uk-form-small"
                value={clientWithdrawal.reference}
                id="amount"
                name="amount"
                cols={10}
                rows={5}
                onChange={(e) =>
                  setClientWithdrawal({
                    ...clientWithdrawal,
                    reference: e.target.value,
                  })
                }
                required
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
                required
              />
            </div>

            <div className="uk-grid uk-grid-small uk-grid-match uk-child-width-1-3 uk-width-1-1">
              <div>
                <EditUploadComponent
                  onFileUpload={(fileUrl) => {
                    // Update clientDepositAllocation or perform other actions with fileUrl
                    setClientWithdrawal((prev) => ({
                      ...prev,
                      instruction: fileUrl,
                    }));
                  }}
                  onProvideReason={(reason) => {
                    // Update clientDepositAllocation or perform other actions with reason
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
                  Update
                </button>
              )}
              {availableBalance >= 0 && (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={clientWithdrawal.amount === 0 || loading}
                  >
                    Update
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

export default WithdrawalUpdateModal;

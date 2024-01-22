import React, { ChangeEvent, useState } from 'react';
import { useAppContext } from '../../../../../../shared/functions/Context';
import SingleSelect from '../../../../../../shared/components/single-select/SingleSelect';
import NumberInput from '../../../../../shared/number-input/NumberInput';
import { observer } from 'mobx-react-lite';
import { IClientWithdrawalPayment } from '../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel';
import { numberFormat } from '../../../../../../shared/functions/Directives';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import DaySelector from '../../../../../../shared/components/day-selector/DaySelector';

type ValidFieldNames = keyof IClientWithdrawalPayment;

interface IProps {
  index: number;
  clientName: string;
  moneyMarketAccountNumber: string;
  withdrawalAmount: number;
  reference: string;
  bank: string;
  valueDate: number;
  onItemChange: (index: number) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onItemRemove: (index: number) => void;
  onNumberChange: (value: string | number, index: number, fieldName: ValidFieldNames) => void;
  onClientChange: (value: string, index: number) => void;
  columnVisibility: { [key in keyof IClientWithdrawalPayment]: boolean };
  handleColumnVisibilityChange: (event: ChangeEvent<HTMLInputElement>) => void;
  ClientWithdrawalPaymentColumnNames: { [key in keyof IClientWithdrawalPayment]: string };
}

export const ClientWithdrawalSheetItem = observer((props: IProps) => {
  const {
    index,
    clientName,
    moneyMarketAccountNumber,
    withdrawalAmount,
    reference,
    bank,
    valueDate,
    onItemChange,
    onItemRemove,
    onNumberChange,
    onClientChange,
    columnVisibility,
  } = props;

  const { store } = useAppContext();

  const clients = [...store.client.naturalPerson.all, ...store.client.legalEntity.all];
  const clientAccountOptions = store.mma.all.filter((mma) => mma.asJson.parentEntity === clientName);

  const clientOptions = clients.map((cli) => ({
    label: cli.asJson.entityDisplayName,
    value: cli.asJson.entityId,
  }));

  const [attachInstruction, setAttachInstruction] = useState(true);
  const [selectedInstructionFile, setSelectedInstructionFile] = useState<File | null>(null);
  const [instructionUploadProgress, setInstructionUploadProgress] = useState<number>(0);
  const [uploadedInstructionFileURL, setUploadedInstructionFileURL] = useState<string | null>(null);

  const handleInstructionFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedInstructionFile(e.target.files[0]);
    }
  };

  const handleInstructionUpload = async () => {
    if (!selectedInstructionFile) return;

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/Client Instruction`);
    const uploadTask = uploadBytesResumable(storageRef, selectedInstructionFile);

    uploadTask.on('state_changed', (snapshot) => {
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
      console.error('Error uploading file:', error);
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
      if (error === 'storage/object-not-found') {
        await handleInstructionUpload();
      } else {
      }
    }
  };


  const selectedClient = clients.find(client => client.asJson.entityId === clientName);

  const bankAccounts = selectedClient?.asJson.bankingDetail.map(acc => ({
    label: `${acc.bankName} | ${acc.accountNumber} | ${acc.accountHolder}`,
    value: acc.accountNumber,
  }));

  const clientId = () => {
    const account = store.mma.all.find((mma) => mma.asJson.id === moneyMarketAccountNumber);
    return account ? account.asJson.id : "";
  }

  const clientBalance = () => {
    const account = store.mma.all.find((mma) => mma.asJson.accountNumber === moneyMarketAccountNumber);
    return account ? (account.asJson.balance - account.asJson.cession) : 0;
  }
  const _netBalance = Number(clientBalance()) - Number(withdrawalAmount);

  return (
    <tr className="row">
      <td style={{ width: "20%" }}>
        <SingleSelect
          options={clientOptions}
          name="clientName"
          value={clientName}
          onChange={(value) => onClientChange(value, index)}
          placeholder="e.g Surname/First Name"
          required
        />
      </td>
      {columnVisibility.allocation && (
        <td style={{ width: "10%" }}>
          <select
            className="uk-select purchase-input uk-form-small"
            value={moneyMarketAccountNumber}
            id="allocation"
            name={"allocation"}
            onChange={onItemChange(index)}
            required>
            <option value={""} disabled>
              Select...
            </option>
            {clientAccountOptions.map((acc, index) => (
              <option key={acc.asJson.id} value={acc.asJson.accountNumber}>
                {acc.asJson.accountNumber}
              </option>
            ))}
          </select>
        </td>
      )}
      <td>
        <input
          className={`uk-input purchase-input uk-form-small ${
            _netBalance < 0 ? "text-danger" : ""
          }`}
          type="text"
          value={numberFormat(clientBalance())}
          name={"clientBalance"}
          onChange={onItemChange(index)}
          disabled
        />
      </td>
      <td style={{ width: "20%" }}>
        <NumberInput
          id="withdrawalAmount"
          className="auto-save uk-input purchase-input uk-form-small"
          placeholder="-"
          value={withdrawalAmount}
          onChange={(value) => onNumberChange(value, index, "amount")}
        />
      </td>
      {columnVisibility.reference && (
        <td style={{ width: "20%" }}>
          <input
            className={`uk-input purchase-input uk-form-small`}
            type="text"
            value={reference}
            name={"reference"}
            onChange={onItemChange(index)}
          />
        </td>
      )}
      <td style={{ width: "20%" }}>
        <input
          className={`uk-input purchase-input uk-form-small`}
          type="date"
          value={valueDate}
          name={"transactionDate"}
          onChange={onItemChange(index)}
        />
      </td>
      <td style={{ width: "20%" }}>
        {bankAccounts?.length! >= 1 ? (
          <input
            className="uk-input uk-form-small"
            type="text"
            value={bankAccounts?.at(0)?.label}
            onChange={onItemChange(index)}
          />
        ) : (
          <select
            className="uk-select uk-form-small"
            value={bank}
            id="bank"
            name={"bank"}
            onChange={onItemChange(index)}
            required>
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
      </td>
      <td style={{ width: "20%" }}>
        <div>
          {!uploadedInstructionFileURL && (
            <div className="uk-form-controls uk-width-1-1">
              <input
                className="uk-checkbox uk-margin-small-left"
                type="checkbox"
                checked={attachInstruction}
                onChange={(e) => setAttachInstruction(e.target.checked)}
              />
            </div>
          )}
          {uploadedInstructionFileURL && (
            <a
              className="btn btn-primary"
              href={uploadedInstructionFileURL}
              target="_blank"
              rel="noopener noreferrer">
              view file
            </a>
          )}
        </div>
      </td>
      <td style={{ width: "20%" }}>
        {attachInstruction && (
          <>
            <div
              className="uk-margin-bottom"
              data-uk-form-custom="target: true">
              <input
                type="file"
                aria-label="Custom controls"
                accept=".pdf, .jpg, .jpeg, .png, .eml"
                onChange={handleInstructionFileSelect}
                id="instructionFile"
              />
              <input
                className="uk-input uk-form-width-medium"
                type="text"
                placeholder="Select file"
                aria-label="Custom controls"
                disabled
              />
            </div>
            <div className="uk-form-controls">
              {selectedInstructionFile && (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={
                      uploadedInstructionFileURL
                        ? handleInstructionFileReplace
                        : handleInstructionUpload
                    }>
                    {uploadedInstructionFileURL ? "Replace" : "Upload"}
                  </button>
                </div>
              )}
              {selectedInstructionFile && (
                <progress
                  className="uk-progress uk-progress-success"
                  value={instructionUploadProgress}
                  max="100"
                />
              )}
            </div>
          </>
        )}
        {!attachInstruction && (
          <div className="uk-form-controls">
            <input
              placeholder="Reason for not attaching Instruction"
              className="purchase-input uk-form-small"
              required
              id="reasonForNoInstruction"
              name="reasonForNoInstruction"
              onChange={(e) => onItemChange(index)}
            />
          </div>
        )}
      </td>
      <td style={{ width: "20%" }}>
        {!uploadedInstructionFileURL && (
          <div className="uk-form-controls uk-width-1-1">
            <input
              className="uk-checkbox uk-margin-small-left"
              type="checkbox"
              checked={attachInstruction}
              onChange={(e) => setAttachInstruction(e.target.checked)}
            />
          </div>
        )}
      </td>
      <td style={{ width: "20%" }}>
        <DaySelector
          onChange={function (selectedDay: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      </td>
      <td style={{ width: "20%" }}>
        <div className="uk-width-auto@s">
          <div className="uk-flex uk-flex-middle uk-flex-inline">
            <div className="uk-margin">
              <div className="icon">
                <span
                  data-uk-tooltip="Delete item"
                  onClick={() => onItemRemove(index)}
                  data-uk-icon="icon: trash;"></span>
              </div>
            </div>
          </div>
        </div>
      </td>
      <td style={{ width: "20%" }}>
        <input
          className="uk-input purchase-input uk-form-small uk-display-none"
          type="text"
          value={clientId()}
          name={"accountId"}
          onChange={onItemChange(index)}
          hidden
        />
      </td>
    </tr>
  );
});

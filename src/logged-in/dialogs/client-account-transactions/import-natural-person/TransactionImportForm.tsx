import { observer } from "mobx-react-lite";
import { ChangeEvent, useState } from "react";
import { read, utils } from "xlsx";
import "./TransactionsImport.scss";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";

import FormFieldInfo from "../../../shared/form-field-info/FormFieldInfo";
import ProgressBar from "../../../shared/progress-bar/ProgressBar";
import MODAL_NAMES from "../../ModalName";
import {
  IClientDepositAllocation,
  defaultClientDepositAllocation,
} from "../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import {
  addDepositedAmountToBalance,
  excelDateToMilliseconds,
  getEntityId,
  minusWithdrawalAmountFromBalance,
} from "../../../../shared/functions/MyFunctions";
import { IClientWithdrawalPayment } from "../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";


interface IAccountTransactionImport {
  id: string;
  TransactionType: string; // description
  TransactionValue: number; // amount
  TradeDate: number; // transaction date
  SettlementDate: number; //value date
  PortfolioCode: string; //money market account number
}

const TransactionImportForm = observer(() => {
  const { store, api } = useAppContext();

  const [importFile, setImportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [importedTransactions, setImportedTransactions] = useState<
    IClientDepositAllocation[]
  >([]);
  const [completedItems, setCompletedItems] = useState(0);

  const handleChangeEntityFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImportFile(event.target.files[0]);
    }
  };

  const handleTransactionsImport = async () => {
    if (importFile) {
      const wb = read(await importFile.arrayBuffer());
      const data = utils.sheet_to_json<IAccountTransactionImport>(
        wb.Sheets[wb.SheetNames[0]]
      );

      const importDataAsJson: any[] = data.map(
        (transaction: IAccountTransactionImport, index) => ({
          ...defaultClientDepositAllocation,
          key: index,
          allocation: `A0${transaction.PortfolioCode}`,
          entity: getEntityId(store, `A0${transaction.PortfolioCode}`),
          transactionDate: excelDateToMilliseconds(transaction.TradeDate),
          valueDate: excelDateToMilliseconds(transaction.SettlementDate),
          amount: transaction.TransactionValue,
          executionTime: new Date(excelDateToMilliseconds((transaction.SettlementDate))).toUTCString(),
          importType: transaction.TransactionType,
        })
      );

      setImportedTransactions(importDataAsJson);

      // console.log("transaction: ", importDataAsJson);

      try {
        setLoading(true);
        for (let index = 0; index < importDataAsJson.length; index++) {
          const clientRecord = importDataAsJson[index];

          setCompletedItems(index + 1); // Update the progress bar and text
          //logic D
          if (
            clientRecord.importType === "AC" ||
            clientRecord.importType === "AE"
          ) {
            const transaction:IClientDepositAllocation = {
              ...clientRecord, 
              transactionStatus: "verified",
              description: clientRecord.importType === "AC" ? "Deposit" : "Interest Earned"
            }
            await api.clientDepositAllocation.create(transaction);
            await addDepositedAmountToBalance(
              transaction.amount,
              transaction.allocation,
              store,
              api,
              transaction.id
            );
          }
          //logic W
          if (
            clientRecord.importType === "RW" ||
            clientRecord.importType === "MA"
          ) {
            const transaction: IClientWithdrawalPayment = {
              ...clientRecord, 
              transactionStatus: "authorised",
              description: clientRecord.importType === "RW" ? "Withdrawal" : "Management Fees"
            }
            await api.clientWithdrawalPayment.create(transaction);
            await minusWithdrawalAmountFromBalance(
              transaction.amount,
              transaction.allocation,
              store,
              api,
              transaction.id
            );
          }
          await new Promise((resolve) => setTimeout(resolve, 200)); // Wait two seconds before adding the next record to the database
        }
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      onCancel();
    }
  };

  const onCancel = () => {
    setImportFile(null);
    hideModalFromId(MODAL_NAMES.DATA_MIGRATION.IMPORT_CLIENT_ENTITY_MODAL);
  };

  return (
    <ErrorBoundary>
      <div className="uk-width-1-1 uk-margin" data-uk-margin>
        <div data-uk-form-custom="target: true">
          <input
            type="file"
            aria-label="Custom controls"
            onChange={handleChangeEntityFile}
            accept="xls"
            required
          />
          <input
            className="uk-input uk-form-width-large"
            type="text"
            placeholder="Select file"
            aria-label="Custom controls"
            disabled
          />
        </div>
        <FormFieldInfo>You can only upload Excel Files</FormFieldInfo>
        {!loading && importFile && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleTransactionsImport}
          >
            Import
          </button>
        )}
        {loading && importFile && (
          <ProgressBar
            totalItems={importedTransactions.length}
            completedItems={completedItems}
          />
        )}
      </div>
    </ErrorBoundary>
  );
});

export default TransactionImportForm;

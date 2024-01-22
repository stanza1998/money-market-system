import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";

import swal from "sweetalert";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import {
  IClientDepositAllocation,
  defaultClientDepositAllocation,
} from "../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import MODAL_NAMES from "../../ModalName";
import { convertDateStringToTimestampMonth } from "../../../../shared/functions/DateToTimestamp";
import React from "react";
import {
  calculateFileHash,
  cannotSaveStatement,
  getMMA,
} from "../../../../shared/functions/MyFunctions";
import { IHashCode } from "../../../../shared/models/hash-codes/HashCodeModel";
import Loading from "../../../../shared/components/loading/Loading";

type CSVRow = Array<string | undefined>;

interface ITransaction {
  "Transaction Date": string;
  "Value Date": string;
  "Transaction Reference No.": string;
  Description: string;
  "*VAT Charge Indicator": string;
  Debit: string;
  Credit: string;
  Balance: string;
}

interface IMatchedTransaction {
  allocation: string;
  transactionDate: string;
  valueDate: string;
  transactionReferenceNo: string;
  description: string;
  amount: string;
}

interface IUnMatchedTransaction {
  transactionDate: string;
  valueDate: string;
  transactionReferenceNo: string;
  description: string;
  amount: string;
}

const NbNBankStatementUploadModal = () => {
  const { api, store } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const matchedItems: IMatchedTransaction[] = [];
  const unmatchedItems: any[] = [];
  const clientMoneyMarketAccounts = store.mma.all;
  const allocator = store.auth.meJson?.uid;
  const timeAllocated = Date.now();
  const formattedAllocated = new Date(timeAllocated).toUTCString();

  const hashCodes = store.hashCode.all.map((h) => {
    return h.asJson;
  });

  const unallocatedWithdrawals = store.clientDepositAllocation.all.map((t) => {
    return t.asJson;
  });

  const existingStatements = unallocatedWithdrawals.map(
    (t) => t.statementIdentifier
  );

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const hash = await calculateFileHash(file);
      setFileHash(hash);

      Papa.parse(file, {
        complete: (result) => {
          const parsedData: CSVRow[] = result.data as CSVRow[];
          setCSVData(parsedData);

          // Find the index of the "Closing Balance" row
          const closingBalanceIndex = parsedData.findIndex((row) =>
            row.includes("* = inclusive of 15% VAT")
          );

          // Use the index to split the data into transactions and closing balance
          const transactionsData = parsedData.slice(15, closingBalanceIndex);
          const closingBalance = parsedData.slice(closingBalanceIndex)[0];

          const transactions: ITransaction[] = transactionsData.map((data) => {
            const [
              TransactionDate = "",
              ValueDate = "",
              TransactionReferenceNo = "",
              Description = "",
              VatChargeIndicator = "",
              Debit = "",
              Credit = "",
              Balance = "",
            ] = data;

            return {
              "Transaction Date": TransactionDate,
              "Value Date": ValueDate,
              "Transaction Reference No.": TransactionReferenceNo,
              Description,
              "*VAT Charge Indicator": VatChargeIndicator,
              Debit,
              Credit,
              Balance,
            };
          });

          setTransactions(transactions);
        },
        header: false,
      });
    }
  };

  const allocateTransactions = () => {
    if (cannotSaveStatement(hashCodes, fileHash)) {
      swal({
        title: "Are you sure?",
        icon: "warning",
        buttons: ["Cancel", "Allocate"],
        dangerMode: true,
      }).then(async (edit) => {
        if (edit) {
          setIsLoading(true);
          transactions.forEach((item) => {
            const formattedNumber = item.Credit || "0";
            const sanitizedValue = formattedNumber.replace(/,/g, ""); // Remove commas
            const convertedValue = parseFloat(sanitizedValue);

            const regex = /(?<!\d)0*([1-9]\d{0,3})(?!\d)/;
            const matches = item.Description.match(regex);

            const capturedNumber = parseInt(matches ? matches[1] : "", 10);
            const searchAccount = `${capturedNumber}`;

            const match = clientMoneyMarketAccounts.find(
              (mmaAccount) => mmaAccount.asJson.accountNumber === searchAccount
            );

            if (match && convertedValue > 0) {
              const _item: IMatchedTransaction = {
                allocation: searchAccount,
                description: item.Description,
                transactionDate: item["Transaction Date"],
                valueDate: item["Value Date"],
                transactionReferenceNo: item["Transaction Reference No."],
                amount: item.Credit,
              };
              matchedItems.push(_item);
            } else if (!match && convertedValue > 0) {
              const _item: IUnMatchedTransaction = {
                description: item.Description,
                transactionDate: item["Transaction Date"],
                valueDate: item["Value Date"],
                transactionReferenceNo: item["Transaction Reference No."],
                amount: item.Credit,
              };
              unmatchedItems.push(_item);
            }
          });

          matchedItems.forEach(async (transaction: IMatchedTransaction) => {
            const formattedNumber = transaction.amount;
            const sanitizedValue = formattedNumber.replace(/,/g, "");
            const convertedValue = parseFloat(sanitizedValue);

            const depostitAllocation: IClientDepositAllocation = {
              ...defaultClientDepositAllocation,
              reference: transaction.transactionReferenceNo,
              amount: convertedValue,
              allocation: transaction.allocation,
              entity: getMMA(transaction.allocation, store),
              description: transaction.description,
              allocatedBy: allocator || "",
              transactionDate: convertDateStringToTimestampMonth(
                transaction.transactionDate
              ),
              valueDate: convertDateStringToTimestampMonth(
                transaction.valueDate
              ),
              allocationStatus: "allocated",
              transactionStatus: "pending",
              bank: "NBN",
              timeAllocated: formattedAllocated,
              whoAllocated: "System",
              statementIdentifier: `${
                transaction.valueDate
              }-${transaction.description.slice(
                0,
                3
              )}-${transaction.transactionReferenceNo.slice(0, 3)}-${
                transaction.transactionDate
              }-${transaction.amount}`,
            };
            try {
              //before it save. use the custom created Identifier from the existing records to compare if the transactions are the same.
              if (
                !existingStatements.includes(
                  depostitAllocation.statementIdentifier
                )
              ) {
                await api.clientDepositAllocation.create(depostitAllocation);
              } else {
                console.log(
                  `Transaction with statementIdentifier ${depostitAllocation.statementIdentifier} already exists.`
                );
              }
            } catch (error) {}
          });

          const hashCode: IHashCode = {
            id: "",
            hashCode: fileHash,
          };
          try {
            await api.hashCode.create(hashCode);
          } catch (error) {}

          unmatchedItems.forEach(async (transaction: IUnMatchedTransaction) => {
            const formattedNumber = transaction.amount;
            const sanitizedValue = formattedNumber.replace(/,/g, "");
            const convertedValue = parseFloat(sanitizedValue);

            const depostitAllocation: IClientDepositAllocation = {
              ...defaultClientDepositAllocation,
              reference: transaction.transactionReferenceNo,
              amount: convertedValue,
              allocation: "",
              description: transaction.description,
              allocatedBy: allocator || "",
              transactionDate: convertDateStringToTimestampMonth(
                transaction.transactionDate
              ),
              valueDate: convertDateStringToTimestampMonth(
                transaction.valueDate
              ),
              allocationStatus: "un-allocated",
              transactionStatus: "pending",
              bank: "NBN",
              statementIdentifier: `${
                transaction.valueDate
              }-${transaction.description.slice(
                0,
                3
              )}-${transaction.transactionReferenceNo.slice(0, 3)}-${
                transaction.transactionDate
              }-${transaction.amount}`,
            };
            try {
              //before it save. use the custom created Identifier from the existing records to compare if the transactions are the same.
              if (
                !existingStatements.includes(
                  depostitAllocation.statementIdentifier
                )
              ) {
                await api.clientDepositAllocation.create(depostitAllocation);
              } else {
                console.log(
                  `Transaction with statementIdentifier ${depostitAllocation.statementIdentifier} already exists.`
                );
              }
            } catch (error) {
              console.log(error);
            }
          });

          swal({
            icon: "success",
            text: `Allocation has been completed, ${
              matchedItems.length === 1
                ? `1 transaction was auto-allocated`
                : `${matchedItems.length} transaction(s) were allocated`
            } ,${
              unmatchedItems.length !== 0
                ? `while transactions ${unmatchedItems.length} could not be auto-allocated.`
                : `all transactions were auto-allocated`
            }`,
          });

          setIsLoading(false);
          onCancel();
        }
      });
    } else {
      swal({
        icon: "error",
        title: "Cannot Upload",
        text: "This csv file was already uploaded",
      });
    }
  };

  const onCancel = () => {
    hideModalFromId(MODAL_NAMES.BACK_OFFICE.NBN_BANK_STATEMENT_UPLOAD_MODAL);
  };

  useEffect(() => {
    const loadData = async () => {
      await api.mma.getAll();
    };
    loadData();
  }, [api.mma]);

  const getHashCodeApi = useMemo(() => api.hashCode, []);

  const memoizedDependencies = useMemo(
    () => [getHashCodeApi],
    [getHashCodeApi]
  );

  useEffect(() => {
    const getHashCode = async () => {
      const hashCodePromise = getHashCodeApi.getAll();
      await Promise.all([hashCodePromise]);
    };
    getHashCode();
  }, [...memoizedDependencies]);

  return (
    <ErrorBoundary>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="custom-modal-style uk-modal-dialog uk-modal-body uk-width-expand">
          <button
            className="uk-modal-close-default"
            onClick={onCancel}
            type="button"
            data-uk-close
          ></button>
          <h3 className="uk-modal-title text-to-break">
            Upload NedBank Bank Statement
          </h3>
          <div className="dialog-content uk-position-relative">
            {/* <CSVFileParser /> */}
            <div>
              <input type="file" accept=".csv" onChange={handleFileUpload} />
              <table>
                <thead>
                  <tr>
                    {csvData.length > 0 &&
                      csvData[0].map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <>
                          <td key={cellIndex}>{cell}</td>
                        </>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {csvData.length !== 0 && (
                <button
                  className="btn btn-primary"
                  onClick={allocateTransactions}
                >
                  Auto Allocate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default NbNBankStatementUploadModal;

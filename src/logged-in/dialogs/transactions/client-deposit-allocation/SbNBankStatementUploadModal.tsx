import React, { useEffect, useMemo, useState } from "react";
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
import { convertDateStringToTimestampSlash } from "../../../../shared/functions/DateToTimestamp";
import {
  calculateFileHash,
  cannotSaveStatement,
  getMMA,
} from "../../../../shared/functions/MyFunctions";
import { IHashCode } from "../../../../shared/models/hash-codes/HashCodeModel";
import Loading from "../../../../shared/components/loading/Loading";

type CSVRow = Array<string | undefined>;

interface Transaction {
  Date: string;
  "Value Date": string;
  "Statement Number": string;
  Description: string;
  Amount: string;
  Balance: string;
  Type: string;
  "Type	Originator Reference": string;
  "Customer Reference": string;
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

const SbNBankStatementUploadModal = () => {
  const { api, store } = useAppContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [csvData, setCSVData] = useState<CSVRow[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const matchedItems: any[] = [];
  const unmatchedItems: any[] = [];
  const timeAllocated = Date.now();
  const formattedAllocated = new Date(timeAllocated).toUTCString();

  const clientMoneyMarketAccounts = store.mma.all;
  const allocator = store.auth.meJson?.uid;

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
            row.includes("Closing Balance")
          );

          // Use the index to split the data into transactions and closing balance
          const transactionsData = parsedData.slice(16, closingBalanceIndex);
          // const closingBalance = parsedData.slice(closingBalanceIndex)[0];

          const transactions: Transaction[] = transactionsData.map((data) => {
            const [
              Date = "",
              ValueDate = "",
              StatementNumber = "",
              Description = "",
              Amount = "",
              Balance = "",
              Type = "",
              OriginatorReference = "",
              CustomerReference = "",
            ] = data;

            return {
              Date,
              "Value Date": ValueDate,
              "Statement Number": StatementNumber,
              Description,
              Amount,
              Balance,
              Type,
              "Type	Originator Reference": OriginatorReference,
              "Customer Reference": CustomerReference,
            };
          });

          setTransactions(transactions);
        },
        header: false, // Set this to true if the first row contains headers
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
            const regex = /(?<!\d)0*([1-9]\d{0,3})(?!\d)/;
            const matches = item["Type	Originator Reference"].match(regex);

            const capturedNumber = parseInt(matches ? matches[1] : "", 10);
            const searchAccount = `${capturedNumber}`;

            const match = clientMoneyMarketAccounts.find(
              (mmaAccount) => mmaAccount.asJson.accountNumber === searchAccount
            );

            const formattedNumber = item.Amount;
            const sanitizedValue = formattedNumber.replace(/,/g, "");
            const convertedValue = parseFloat(sanitizedValue);

            if (match && convertedValue > 0) {
              const _item: IMatchedTransaction = {
                allocation: searchAccount,
                description: item["Type	Originator Reference"],
                transactionDate: item.Date,
                valueDate: item["Value Date"],
                transactionReferenceNo: item.Description,
                amount: item.Amount,
              };
              matchedItems.push(_item);
            } else if (!match && convertedValue > 0) {
              const _item: IUnMatchedTransaction = {
                description: item["Type	Originator Reference"],
                transactionDate: item.Date,
                valueDate: item["Value Date"],
                transactionReferenceNo: item.Description,
                amount: item.Amount,
              };
              unmatchedItems.push(_item);
            }
          });

          matchedItems.forEach(async (transaction: IMatchedTransaction) => {
            const formattedNumber = transaction.amount;
            const sanitizedValue = formattedNumber.replace(/,/g, "");
            const convertedValue = parseFloat(sanitizedValue);

            const allocation: IClientDepositAllocation = {
              ...defaultClientDepositAllocation,
              reference: transaction.transactionReferenceNo,
              amount: convertedValue,
              allocation: transaction.allocation,
              description: transaction.description,
              entity: getMMA(transaction.allocation, store),
              allocatedBy: allocator || "",
              transactionDate: convertDateStringToTimestampSlash(
                transaction.transactionDate
              ),
              valueDate: convertDateStringToTimestampSlash(
                transaction.valueDate
              ),
              allocationStatus: "allocated",
              transactionStatus: "pending",
              bank: "SBN",
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
                !existingStatements.includes(allocation.statementIdentifier)
              ) {
                await api.clientDepositAllocation.create(allocation);
              } else {
                console.log(
                  `Transaction with statementIdentifier ${allocation.statementIdentifier} already exists.`
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

            const allocation: IClientDepositAllocation = {
              ...defaultClientDepositAllocation,
              reference: transaction.transactionReferenceNo,
              amount: convertedValue,
              allocation: "",
              description: transaction.description,
              allocatedBy: allocator || "",
              transactionDate: convertDateStringToTimestampSlash(
                transaction.transactionDate
              ),
              valueDate: convertDateStringToTimestampSlash(
                transaction.valueDate
              ),
              allocationStatus: "un-allocated",
              transactionStatus: "pending",
              bank: "SBN",
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
              if (
                !existingStatements.includes(allocation.statementIdentifier)
              ) {
                await api.clientDepositAllocation.create(allocation);
              } else {
                console.log(
                  `Transaction with statementIdentifier ${allocation.statementIdentifier} already exists.`
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
    hideModalFromId(MODAL_NAMES.BACK_OFFICE.SBN_BANK_STATEMENT_UPLOAD_MODAL);
  };

  useEffect(() => {
    const loadData = async () => {
      await api.mma.getAll();
      await api.clientWithdrawalPayment.getAll();
    };
    loadData();
  }, [api.clientWithdrawalPayment, api.mma]);

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
        <div className={`custom-modal-style uk-modal-dialog uk-modal-body ${csvData.length > 0 ? 'uk-width-expand' : 'uk-width-large'}`}>
          <button
            className="uk-modal-close-default"
            onClick={onCancel}
            type="button"
            disabled={isLoading}
            data-uk-close
          ></button>
          <h3 className="uk-modal-title text-to-break">
            Upload Standard Bank Statement for Reconciliation
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
                        <>
                          <th key={index}>{header}</th>
                          <th></th>
                        </>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.slice(1).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>{cell}</td>
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
                  {isLoading && <div data-uk-spinner={"ratio:.5"}></div>}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default SbNBankStatementUploadModal;

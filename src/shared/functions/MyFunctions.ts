import MODAL_NAMES from "../../logged-in/dialogs/ModalName";
import { ISwitchTransaction } from "../models/SwitchTransactionModel";
import { IClientWithdrawalPayment } from "../models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { IHashCode } from "../models/hash-codes/HashCodeModel";
import AppStore from "../stores/AppStore";
import showModalFromId from "./ModalShow";
import AppApi from "../apis/AppApi";
import { IMoneyMarketAccount } from "../models/MoneyMarketAccount";
import { IBatches } from "../models/batches/BatchesModel";
import { ICancelledWithdrawalTransaction } from "../models/cancelledWithdrawalTransaction/CancelledWithdrawalTransaction";
import { INaturalPerson } from "../models/clients/NaturalPersonModel";
import { ILegalEntity } from "../models/clients/LegalEntityModel";

export const formatDate = (inputCode: string): string => {
  // Check if the input code starts with "GT"
  if (!inputCode.startsWith("GT")) {
    return "Invalid input code. It should start with 'GT'.";
  }

  // Extract the relevant parts from the input code
  const [, daysToMaturity, settlementDateStr, maturityDateStr] =
    inputCode.match(
      /^GT(\d+)(\/\d{2}[A-Za-z]{3}\d{2})-(\d{2}[A-Za-z]{3}\d{2})$/
    ) || [];

  if (!daysToMaturity || !settlementDateStr || !maturityDateStr) {
    return "Invalid input code.";
  }

  // Parse the days to maturity as a number
  const daysToMaturityNum = parseInt(daysToMaturity, 10);

  // Parse the settlement and maturity dates using the 'Date' object
  const settlementDate = new Date(settlementDateStr);
  const maturityDate = new Date(maturityDateStr);

  // Add the days to maturity to the maturity date
  maturityDate.setDate(maturityDate.getDate() + daysToMaturityNum);

  // Custom date formatting function
  const formatDateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);
    return `${day}${month}${year}`;
  };

  // Format the dates to match the desired output format
  const formattedSettlementDate = formatDateToString(settlementDate);
  const formattedMaturityDate = formatDateToString(maturityDate);

  // Combine the parts to create the final output
  const outputCode = `GT${daysToMaturity}/${maturityDateStr}-${formattedMaturityDate}`;

  return outputCode;
};

export const calculateFileHash = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export function cannotSaveStatement(
  hashCodes: IHashCode[],
  fileHash: string | null
): boolean {
  const findHash = hashCodes.find((h) => h.hashCode === fileHash);
  if (findHash) {
    return false;
  } else {
    return true;
  }
}

export const canVerify = (transactionId: string, store: AppStore) => {
  const selectedTransaction =
    store.clientDepositAllocation.getItemById(transactionId);
  if (selectedTransaction) {
    if (store.clientDepositAllocation.getItemById(transactionId)) {
      if (selectedTransaction.asJson.transactionStatus !== "verified") {
        return true;
      }
    }
  } else {
    return false;
  }
};

export const onEditTransaction = (transactionId: string, store: AppStore) => {
  const selectedTransaction =
    store.clientDepositAllocation.getItemById(transactionId);

  if (selectedTransaction) {
    store.clientDepositAllocation.select(selectedTransaction.asJson);
    showModalFromId(
      MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.EDIT_TRANSACTION_MODAL
    );
  } else {
  }
};

export const onhandleTransactionVerification = async (
  transactionId: string,
  store: AppStore
) => {
  const transaction = store.clientDepositAllocation.getItemById(transactionId);
  if (transaction) {
    store.clientDepositAllocation.select(transaction.asJson);
    showModalFromId(MODAL_NAMES.BACK_OFFICE.RECORD_UPLOAD_MODAL);
  } else {
  }
};

export const onAllocateTransaction = (
  transactionId: string,
  store: AppStore
) => {
  const selectedTransaction =
    store.clientDepositAllocation.getItemById(transactionId);
  if (selectedTransaction) {
    store.clientDepositAllocation.select(selectedTransaction.asJson);
    showModalFromId(
      MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.ALLOCATE_TRANSACTION_MODAL
    );
  }
};

export function getMMA(accNumber: string, store: AppStore): string {
  const mmmAccount = store.mma.all.find(
    (m) => m.asJson.accountNumber === accNumber
  )?.asJson.parentEntity;
  if (mmmAccount) {
    return mmmAccount;
  } else {
    alert("Client ID not found");
    return "client Id not found";
  }
}

export function getNaturalPersonsName(
  entityId: string,
  store: AppStore
): string {
  const naturalPersons = store.client.naturalPerson.all.map((n) => {
    return n.asJson;
  });
  const personName = naturalPersons.find(
    (p) => p.entityId === entityId
  )?.clientName;
  if (personName) {
    return personName;
  } else {
    return "N/A";
  }
}

export const getClientName = (
  transaction: IClientWithdrawalPayment,
  store: AppStore
) => {
  const mmAccounts = store.mma.all;

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];
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

export function getPersonNameMMA(
  entityId: string,
  store: AppStore
): string | undefined {
  const person = store.client.naturalPerson.all.find(
    (p) => p.asJson.entityId === entityId
  )?.asJson.clientName;
  if (person) {
    return person;
  }
  return "";
}

export function getAccountType(
  id: string,
  store: AppStore
): string | undefined {
  const account = store.product.all.find((a) => a.asJson.id === id)?.asJson
    .productCode;
  if (account) {
    return account;
  }
  return "";
}

export function getAccountTypeWithAccountNumber(
  accountNumber: string,
  store: AppStore
): string | undefined {
  const account = store.mma.all.find(
    (a) => a.asJson.accountNumber === accountNumber
  )?.asJson.accountType;
  if (account) {
    return account;
  }
  return "";
}

export const getAllocatorName = (
  transaction: IClientWithdrawalPayment,
  store: AppStore
) => {
  const users = store.user.all;
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

export const onEditTransactionWithdrawal = (
  clientId: string,
  store: AppStore
) => {
  const selectedclient = store.clientWithdrawalPayment.getItemById(clientId);

  if (selectedclient) {
    store.clientWithdrawalPayment.select(selectedclient.asJson);
    showModalFromId(MODAL_NAMES.BACK_OFFICE.EDIT_WITHDRAWAL_MODAL);
  }
};

export const onVerify = (clientId: string, store: AppStore) => {
  const selectedclient = store.clientWithdrawalPayment.getItemById(clientId);

  if (selectedclient) {
    store.clientWithdrawalPayment.select(selectedclient.asJson);
    showModalFromId(MODAL_NAMES.BACK_OFFICE.VERIFY_WITHDRAWAL_MODAL);
  }
};

export const onAuthorize = (clientId: string, store: AppStore) => {
  const selectedclient = store.clientWithdrawalPayment.getItemById(clientId);

  if (selectedclient) {
    store.clientWithdrawalPayment.select(selectedclient.asJson);
    showModalFromId(MODAL_NAMES.BACK_OFFICE.AUTHORIZE_WITHDRAWAL_MODAL);
  }
};

export const onViewVerifiedPayment = (clientId: string, store: AppStore) => {
  const selectedpayment = store.clientWithdrawalPayment.getItemById(clientId);

  if (selectedpayment) {
    store.clientWithdrawalPayment.select(selectedpayment.asJson);
    console.log(selectedpayment.asJson);

    showModalFromId(MODAL_NAMES.BACK_OFFICE.TRANSACTION_WITHDRAWAL_MODAL);
  }
};

export function getEntityId(store: AppStore, fromAccount: string): string {
  const entityId = store.mma.all.find(
    (m) => m.asJson.accountNumber === fromAccount
  )?.asJson.parentEntity;
  if (entityId) {
    return entityId;
  } else {
    return "";
  }
}

export function getAllocatedBy(uid: string, store: AppStore): string {
  const user = store.user.all.find((u) => u.asJson.uid === uid)?.asJson
    .displayName;
  if (user) {
    return user;
  } else {
    return "";
  }
}

export function getClientNameSwitch(
  transaction: ISwitchTransaction,
  store: AppStore
) {
  // Get all MM accounts and clients
  const mmAccounts = store.mma.all;
  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

  // Find the account based on the transaction details
  const account = mmAccounts.find(
    (account) =>
      account.asJson.accountNumber === transaction.fromAccount ||
      account.asJson.accountNumber === transaction.toAccount
  );

  if (account) {
    // Find the client based on the parent entity of the account
    const client = clients.find(
      (client) => client.asJson.entityId === account.asJson.parentEntity
    );

    if (client) {
      // Return the client's display name
      const clientName = client.asJson.entityDisplayName;
      return clientName;
    }
  }

  // Return an empty string if no matching account or client is found
  return "";
}

//   export const onViewAccount = (accountId: string, store:AppStore) => {
//     const onNavigate = useNavigate();
//     onNavigate();
//   }
export const onViewAccount = (accountId: string, store: AppStore) => {
  const selectedAccount = store.mma.getItemById(accountId);

  if (selectedAccount) {
    store.mma.select(selectedAccount.asJson);
    showModalFromId(MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL);
  }
};

export function getTimeAllocated(timeAllocated: string): boolean {
  if (!timeAllocated) {
    return false;
  }
  const currentDate = Date.now();
  const allocatedTime = new Date(timeAllocated).getTime(); // Convert timeAllocated to milliseconds
  const isTimeExceeded = currentDate - allocatedTime > 30000; // 30000 milliseconds = 30 seconds
  return !isTimeExceeded;
}

export async function addDepositedAmountToBalance(
  amount: number,
  accountNumber: string,
  store: AppStore,
  api: AppApi,
  transactionId: string
) {
  const account = store.mma.all.find(
    (acc) => acc.asJson.accountNumber === accountNumber
  )?.asJson;
  if (account) {
    const currentBalance = account.balance;
    const cession = account.cession;
    const updatedBalance = currentBalance + amount;
    try {
      await api.mma.updateBalanceDeposit(account, updatedBalance);
    } catch (error) { }
    getPreviousBalanceDeposit(transactionId, currentBalance, store, api);
  } else {
    return 0;
  }
}

//Function to get previous balance in verified deposited transaction
async function getPreviousBalanceDeposit(
  transactionId: string,
  previousBalance: number,
  store: AppStore,
  api: AppApi
) {
  const transaction = store.clientDepositAllocation.all.find(
    (t) => t.asJson.id === transactionId
  )?.asJson;
  if (transaction) {
    try {
      await api.clientDepositAllocation.updateBalanceWithdraw(
        transaction,
        previousBalance
      );
    } catch (error) { }
  } else {
    return;
  }
}

export async function minusWithdrawalAmountFromBalance(
  amount: number,
  accountNumber: string,
  store: AppStore,
  api: AppApi,
  transactionId: string
) {
  const account = store.mma.all.find(
    (mma) => mma.asJson.accountNumber === accountNumber
  )?.asJson;
  if (account) {
    const currentBalance = account.balance;
    console.log(currentBalance);

    const cession = account.cession;
    const newBalance = currentBalance - amount;
    const runningBalance = currentBalance - amount;
    try {
      await api.mma.updateBalanceWithdraw(account, newBalance, runningBalance);
    } catch (error) { }
    try {
      await getPreviousBalanceWithdraw(
        transactionId,
        currentBalance,
        store,
        api
      );
    } catch (error) { }
  } else {
    return 0;
  }
}

//check deposit or withdraw for excel file

export function getTransactionType(type: string): string {
  switch (type) {
    case "AC":
    case "AE":
      return "Deposit";
    case "RW":
    case "MA":
      return "Withdrawal";
    default:
      throw new Error(`Unsupported transaction type: ${type}`);
  }
}

export function getDateTimestamp(dateStr: string) {
  const dateArr = dateStr.split(/\/|\s|:/);
  const dateObj = new Date(
    Date.UTC(
      +dateArr[2],
      +dateArr[1] - 1,
      +dateArr[0],
      +dateArr[3] || 0,
      +dateArr[4] || 0,
      +dateArr[5] || 0
    )
  );
  const timestamp = dateObj.getTime() / 1000;
  return timestamp;
}

export function excelDateToMilliseconds(excelDate: number) {
  // Excel epoch starts from January 1, 1900
  var excelEpoch = new Date("1900-01-01T00:00:00Z").getTime();

  // Convert days to milliseconds
  var millisecondsPerDay = 24 * 60 * 60 * 1000;

  // Convert Excel date to milliseconds
  var milliseconds = (excelDate - 1) * millisecondsPerDay + excelEpoch;

  return milliseconds;
}

//
export function getClientBalance(
  store: AppStore,
  accountNumber: string
): number {
  const currentBalance = store.mma.all.find(
    (acc) => acc.asJson.accountNumber === accountNumber
  )?.asJson.balance;

  if (currentBalance) {
    return currentBalance;
  }
  return 0;
}

//Function to get previous balance in verified deposited transaction
export async function getPreviousBalanceWithdraw(
  transactionId: string,
  previousBalance: number,
  store: AppStore,
  api: AppApi
) {
  const transaction = store.clientWithdrawalPayment.all.find(
    (t) => t.asJson.id === transactionId
  )?.asJson;
  if (transaction) {
    try {
      await api.clientWithdrawalPayment.updateBalanceWithdraw(
        transaction,
        previousBalance
      );
    } catch (error) {
      console.log("Error 1:", error);
    }
  } else {
    return;
  }
}

//switch logic here
export async function getPreviousBalanceSwitch(
  switchId: string,
  toPreviousBalance: number,
  fromPreviousBalance: number,
  store: AppStore,
  api: AppApi
) {
  const switchTransaction = store.switch.all.find(
    (s) => s.asJson.id === switchId
  )?.asJson;
  if (switchTransaction) {
    try {
      await api.switch.updatePreviousBalance(
        switchTransaction,
        toPreviousBalance,
        fromPreviousBalance
      );
    } catch (error) { }
  }
}

export function calculateCurrentBalance(
  previousBalance: number,
  amount: number,
  status: string
) {
  if (status.startsWith("Cancelled")) {
    return null;
  } else if (
    status.startsWith("Withdrawal") ||
    status.startsWith("Switch To")
  ) {
    return previousBalance - amount;
  } else if (status.startsWith("Deposit") || status.startsWith("Switch From")) {
    return previousBalance + amount;
  } else {
    return previousBalance;
  }
}

export function getMMADocId(
  accountNumber: string | undefined,
  store: AppStore
): string | undefined {
  const mmaDocId = store.mma.all.find(
    (m) => m.asJson.accountNumber === accountNumber
  )?.asJson.id;
  if (mmaDocId) {
    return mmaDocId;
  } else {
    return;
  }
}

export function findLatestAccount(accounts: IMoneyMarketAccount[]) {
  if (!Array.isArray(accounts) || accounts.length === 0) {
    // Handle cases where the input is not an array or is an empty array
    return null;
  }

  return accounts.reduce((latest, account) => {
    const currentNumber = parseInt(account.accountNumber.replace("A", ""), 10);
    const latestNumber = parseInt(latest.accountNumber.replace("A", ""), 10);

    return currentNumber > latestNumber ? account : latest;
  }, accounts[0]);
}

//update closing money market accouunt status to pending
export async function updateMMAClosingStatus(
  accountNumber: string,
  store: AppStore,
  api: AppApi
) {
  const mmaAccount = store.mma.all.find(
    (mma) => mma.asJson.accountNumber === accountNumber
  )?.asJson;
  if (mmaAccount) {
    try {
      await api.mma.updateBalanceStatus(mmaAccount, "Pending");
    } catch (error) { }
  }
}

export async function updateMMAClosingStatusClose(
  accountNumber: string,
  store: AppStore,
  api: AppApi
) {
  const mmaAccount = store.mma.all.find(
    (mma) => mma.asJson.accountNumber === accountNumber
  )?.asJson;
  if (mmaAccount) {
    try {
      if (mmaAccount.status === "Pending") {
        await api.mma.updateBalanceStatus(mmaAccount, "Closed");
      }
    } catch (error) { }
  }
}

export function generateNextAccountNumber(
  currentAccountNumber: string
): string {
  const prefix = currentAccountNumber.charAt(0);
  const currentNumber = parseInt(currentAccountNumber.substring(1));
  const nextNumber = currentNumber + 1;
  // Assuming you want the account number to have a fixed width of 6 digits
  const nextAccountNumber = `${prefix}${nextNumber
    .toString()
    .padStart(6, "0")}`;
  return nextAccountNumber;
}

export async function generateBatchesWithdrawal(
  store: AppStore,
  api: AppApi,
  me: string | undefined
) {
  const allTransactions = store.clientWithdrawalPayment.all
    .filter(
      (t) =>
        (t.asJson.batchStatus === false || !t.asJson.batchStatus) &&
        t.asJson.transactionStatus === "authorised"
    )
    .map((t) => {
      return t.asJson;
    });
  const highVolumeTransaction = allTransactions
    .filter((t) => t.amount > 5000)
    .map((t) => {
      return t;
    });
  const lowVolumeTransaction = allTransactions
    .filter((t) => t.amount <= 5000)
    .map((t) => {
      return t;
    });
  //get zar

  const highV: IBatches = {
    id: "",
    batchNumber: generateBatchFileReference(),
    batchWithdrawalTransactions: highVolumeTransaction,
    whoProcessBatched: me || "",
    timeProcessed: Date.now(),
    batchType: "High",
  };
  const lowV: IBatches = {
    id: "",
    batchNumber: generateBatchFileReference(),
    batchWithdrawalTransactions: lowVolumeTransaction,
    whoProcessBatched: me || "",
    timeProcessed: Date.now(),
    batchType: "Low",
  };
  //create zar

  try {
    if (highV.batchWithdrawalTransactions.length > 0) {
      await api.batches.create(highV);
    } else {
      alert("High Batch Type has no transactions");
    }

    if (lowV.batchWithdrawalTransactions.length > 0) {
      await api.batches.create(lowV);
    } else {
      alert("Normal Batch Type has no transactions");
    }
  } catch (error) {
    console.log(error);
  } finally {
    // update batch status in transactions for display.
    for (const transaction of allTransactions) {
      try {
        await api.clientWithdrawalPayment.updateBatchStatus(transaction.id);
      } catch (error) {
        console.log(error);
      }
    }
    alert("Batch Files successfully Created");
  }
}

function generateBatchFileReference(): string {
  const getRandomDigits = (length: number): string => {
    const randomDigits = Math.floor(
      Math.random() * Math.pow(10, length)
    ).toString();
    return randomDigits.padStart(length, "0");
  };
  const currentDate = new Date();
  const year = currentDate.getFullYear().toString();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 as months are zero-indexed
  const day = currentDate.getDate().toString().padStart(2, "0");

  const reference = `BA${getRandomDigits(9)}-${year}-${month}-${day}`;
  return reference;
}

//cancell function

export async function cancelWithdrawalTransaction(
  store: AppStore,
  api: AppApi,
  stage: string,
  transactionId: string,
  comment: string
) {
  const transaction = store.clientWithdrawalPayment.all.find(
    (t) => t.asJson.id === transactionId
  )?.asJson as IClientWithdrawalPayment;

  //create cancelled transaction
  const cancelledTransaction: ICancelledWithdrawalTransaction = {
    id: "",
    amount: transaction?.amount || 0,
    reference: transaction?.reference || "",
    description: transaction?.description || "",
    transactionDate: transaction?.transactionDate || 0,
    valueDate: transaction?.valueDate || 0,
    entity: transaction?.entity || "",
    allocation: transaction?.allocation || "",
    allocatedBy: transaction?.allocatedBy || "",
    allocationApprovedBy: transaction?.allocationApprovedBy || "",
    allocationStatus: transaction?.allocationStatus || "",
    transactionStatus: transaction?.transactionStatus || "",
    bank: transaction?.bank || "",
    sourceOfFunds: transaction?.sourceOfFunds || "",
    reasonForNoSourceOfFunds: transaction?.reasonForNoSourceOfFunds || "",
    proofOfPayment: transaction?.proofOfPayment || "",
    reasonForNoProofOfPayment: transaction?.reasonForNoProofOfPayment || "",
    instruction: transaction?.instruction || "",
    reasonForNoInstruction: transaction?.reasonForNoInstruction || "",
    isRecurring: false,
    recurringDay: null,
    whoCreated: transaction?.whoCreated || "",
    timeCreated: transaction?.timeCreated || "",
    whoVerified: transaction?.whoVerified || "",
    timeVerified: transaction?.timeVerified || "",
    whoAuthorized: transaction?.whoAuthorized || "",
    timeAuthorized: transaction?.timeAuthorized || "",
    whoProcessedPayment: transaction?.whoProcessedPayment || "",
    timeProcessPayment: transaction?.timeProcessPayment || "",
    executionTime: transaction?.executionTime || "",
    previousBalance: transaction?.previousBalance || 0,
    batchStatus: false,
    stageCancelledFrom: stage,
    cancellationComment: comment,
  };

  try {
    await api.cancelledWithdrawals.create(cancelledTransaction);
  } catch (error) {
    console.log(error);
  }

  //update account balance
  const accountId = store.mma.all.find(
    (m) => m.asJson.accountNumber === transaction?.allocation
  )?.asJson.id;

  try {
    await api.mma.reverseBalanceUpdate(
      accountId || "",
      transaction?.amount || 0
    );
  } catch (error) { }

  // delete record from transaction
  try {
    await api.clientWithdrawalPayment.delete(transaction);
  } catch (error) { }
}

export async function batchTransactionRevert(
  api: AppApi,
  store: AppStore,
  transactionId: string,
  batch: IBatches,
  transactions: IClientWithdrawalPayment[]
) {
  const transaction = store.clientWithdrawalPayment.all.find(
    (t) => t.asJson.id === transactionId
  );

  if (transaction) {
    try {
      // change transaction batch status to false
      await api.clientWithdrawalPayment.updateBatchStatusToFalse(
        transaction.asJson.id
      );
      //delete batch transaction
      await api.batches.deleteBatchTransaction(batch, transaction.asJson.id);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("success ");
    }
  }
}


export function getBankDetails(
  person: INaturalPerson | ILegalEntity | undefined,
  acc: { label: string; value: string }
): string {
  // Find banking details for the given account number
  const findDetails = person?.bankingDetail?.find(
    (b) => b.accountNumber === acc.value
  );

  if (findDetails) {
    // Return a formatted string with bank details
    return `${findDetails.bankName} | ${findDetails.accountHolder} | ${findDetails.accountNumber} | ${findDetails.branchNumber}`;
  } else {
    // Return an empty string if details are not found
    return "";
  }
}

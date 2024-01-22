/* eslint-disable */
import crypto = require("crypto");
import axios from "axios";
import functions = require("firebase-functions");
import admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// Define constants
const docFoxApiKey = "Lz8oq4giU7Ms9-8i4i3vvN8NcS2m0JzJ96gSAv3bJy34klZIGvt7FkHT-XpE843L_ZA";
const secretKey = "80D41933-0E8B-4FF5-BAA5-4DD9082771C8";
let token: string | null = null;
let tokenExpiration = 0;

const db = admin.firestore();

const moneyMarketAccountsInterestPath = (accountId: string) => {
  return `moneyMarketAccounts/${accountId}/interestLog`;
};

interface IMoneyAccountInterestLog {
  id: string;
  interestLogDate: number;
  interest: number;
  runningBalance: number;
  accountBalance: number;
}

interface IMoneyMarketAccount {
  id: string;
  parentEntity: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  baseRate: number;
  feeRate: number;
  cession: number;
  balance: number;
  displayOnEntityStatement: boolean;
  status: string;
}

//recurring
interface IClientWithdrawalRecurringPayment {
  id: string;
  amount: number;
  reference: string;
  description: string;
  transactionDate: number | null;
  valueDate: number | null;
  entity: string,
  allocation: string;
  allocatedBy: string;
  allocationApprovedBy: string;
  allocationStatus: string;
  transactionStatus: string;
  bank: string;
  sourceOfFunds: string,
  reasonForNoSourceOfFunds: string,
  proofOfPayment: string,
  reasonForNoProofOfPayment: string,
  instruction: string,
  reasonForNoInstruction: string,
  isRecurring: boolean,
  recurringDay: number | null,
  timeCretated: string;
}

//transaction
interface IClientWithdrawalPayment {
  id: string;
  amount: number;
  reference: string;
  description: string;
  transactionDate: number | null;
  valueDate: number | null;
  entity: string,
  allocation: string;
  allocatedBy: string;
  allocationApprovedBy: string;
  allocationStatus: string;
  transactionStatus: string;
  bank: string;
  sourceOfFunds: string,
  reasonForNoSourceOfFunds: string,
  proofOfPayment: string,
  reasonForNoProofOfPayment: string,
  instruction: string,
  reasonForNoInstruction: string,
  isRecurring: boolean,
  recurringDay: number | null,
  whoCreated?: string;
  timeCreated?: string;
  whoVerified?: string;
  timeVerified?: string;
  whoAuthorized?: string;
  timeAuthorized?: string;
  whoProcessedPayment?: string;
  timeProcessPayment?: string;
  executionTime?: string;
  previousBalance?: number;
}

async function recurringTransactions() {


  const recurringTransactionsQuerySnapshot = await admin.firestore().collection("clientWithdrawalRecurringPayments").get();

  recurringTransactionsQuerySnapshot.forEach(async (doc) => {
    const recurringData = doc.data() as IClientWithdrawalRecurringPayment;

    // if (recurringData.transactionStatus === "verified" && recurringData.recurringDay === currentDay) {
    const newTransaction: IClientWithdrawalPayment = {
      amount: recurringData.amount,
      reference: recurringData.reference,
      description: recurringData.description,
      transactionDate: 0,
      valueDate: 0,
      entity: recurringData.entity,
      allocation: recurringData.allocation,
      allocatedBy: recurringData.allocatedBy,
      allocationApprovedBy: recurringData.allocationApprovedBy,
      allocationStatus: recurringData.allocationStatus,
      transactionStatus: recurringData.transactionStatus,
      bank: recurringData.bank,
      sourceOfFunds: recurringData.sourceOfFunds,
      reasonForNoSourceOfFunds: recurringData.reasonForNoSourceOfFunds,
      proofOfPayment: recurringData.proofOfPayment,
      reasonForNoProofOfPayment: recurringData.reasonForNoProofOfPayment,
      instruction: recurringData.instruction,
      reasonForNoInstruction: recurringData.reasonForNoInstruction,
      isRecurring: false,
      whoCreated: "",
      timeCreated: "",
      recurringDay: null,
      id: ""
    };

    // Add the document to the "clientWithdrawalPayments" collection
    const newTransactionRef = await admin.firestore().collection("clientWithdrawalPayments").add(newTransaction);

    // Retrieve the auto-generated document ID and update the document
    const newTransactionId = newTransactionRef.id;
    await admin.firestore().collection("clientWithdrawalPayments").doc(newTransactionId).update({ id: newTransactionId });
    // }
  });
}

const accounts: IMoneyMarketAccount[] = [];
// const accountInterestLog: IMoneyAccountInterestLog[] = [];

async function getAllMoneyMarketAccounts() {
  const accountsCollection = db.collection(`moneyMarketAccounts`);

  accountsCollection.get()
    .then((snapshot) => {
      const mma: any[] = [];
      snapshot.forEach((doc) => {
        mma.push(doc.data());
      });
      accounts.push(...mma);
      return null;
    })
    .catch((error) => {
      console.error('Error getting documents:', error);
    });
}

async function capitaliseDailyInterest(accountId: string, item: IMoneyAccountInterestLog) {
  const path = moneyMarketAccountsInterestPath(accountId);
  if (!path) return;

  try {
    const accountsCollection = db.collection(`moneyMarketAccounts/${accountId}/interestLog`);

    const docRef = await accountsCollection.add(item);

    db.collection(path).add(item);

    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

// Function to generate a new token if it's expired or not available
async function generateToken() {
  try {
    const currentTime = Date.now();

    if (!token || tokenExpiration <= currentTime) {

      const authenticationResponse = await axios.get("https://www.docfoxapp.com/api/v2/authentications/new", {
        headers: {
          "Accept": "application/vnd.api+json",
          "X-Client-Api-Key": docFoxApiKey,
        },
      });

      const nonce = authenticationResponse.data.data.attributes.nonce;
      // const nonce = crypto.randomBytes(16).toString("hex");
      const clientSignature = crypto
        .createHmac("sha256", secretKey)
        .update(nonce)
        .digest("hex");

      const tokenResponse = await axios.get(
        "https://www.docfoxapp.com/api/v2/tokens/new",
        {
          headers: {
            Accept: "application/vnd.api+json",
            "X-Client-Api-Key": docFoxApiKey,
            "X-Client-Signature": clientSignature,
          },
        }
      );

      token = tokenResponse.data.data.attributes.token;
      tokenExpiration = currentTime + 20 * 60 * 1000; // Token expires in 20 minutes
    }

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Failed to generate token");
  }
}

// Function to get the KYC applications
async function getKYCApplications() {
  try {
    const apiKey = await generateToken();
    const perPage = 100;
    let page = 1;
    let allApplications: any = [];

    while (true) {
      const url = `https://www.docfoxapp.com/api/v2/kyc_applications?filter[status]=approved&per_page=${perPage}&page=${page}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/vnd.api+json",
        },
      });

      const kycTemplates = response.data;

      // Check if there are more pages
      if (kycTemplates.data.length === 0) {
        break; // No more pages, exit the loop
      }

      // Add the current page's data to the array
      allApplications = allApplications.concat(kycTemplates.data);

      // Move to the next page
      page++;
    }

    return allApplications;
  } catch (error) {
    console.error("Error fetching KYC applications:", error);
    throw new Error("Failed to fetch KYC applications");
  }
}

async function getKYCApplicationRiskRatings(applicationId: string) {
  try {
    const apiKey = await generateToken();

    const url = `https://www.docfoxapp.com/api/v2/kyc_applications/${applicationId}/risk_ratings`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    const kycApplicationRiskRatings = response.data;

    return kycApplicationRiskRatings;
  } catch (error) {
    console.error("Error fetching KYC applications risk ratings:", error);
    throw new Error("Failed to fetch KYC applications risk ratings");
  }
}

async function getKYCApplicationRelatedEntities(applicationId: string) {
  try {
    const apiKey = await generateToken();

    const url = `https://www.docfoxapp.com/api/v2/kyc_applications/${applicationId}/related_entities?per_page=100&page=1`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    const kycApplicationRelatedEntities = response.data;

    return kycApplicationRelatedEntities;
  } catch (error) {
    console.error("Error fetching KYC application related entities:", error);
    throw new Error("Failed to fetch KYC application related entities");
  }
}

async function getKYCApplicationBankAccountDetails(applicationId: string) {
  try {
    const apiKey = await generateToken();

    const url = `https://www.docfoxapp.com/api/v2/kyc_applications/${applicationId}/bank_accounts`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    const kycApplicationBankAccountDetails = response.data;

    return kycApplicationBankAccountDetails;
  } catch (error) {
    console.error("Error fetching KYC application bank details", error);
    throw new Error("Failed to fetch KYC application bank details");
  }
}

async function getKYCProfileNames(profileId: string) {
  try {
    const apiKey = await generateToken();

    const url = `https://www.docfoxapp.com/api/v2/profiles/${profileId}/names`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    const kycTemplates = response.data;

    return kycTemplates;
  } catch (error) {
    console.error("Error fetching KYC applications:", error);
    throw new Error("Failed to fetch KYC applications");
  }
}

async function getKYCProfileContacts(profileId: string) {
  try {
    const apiKey = await generateToken();

    const url = `https://www.docfoxapp.com/api/v2/profiles/${profileId}/contacts`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    const kycProfileContacts = response.data;

    return kycProfileContacts;
  } catch (error) {
    console.error("Error fetching KYC application contacts", error);
    throw new Error("Failed to fetch KYC application contacts");
  }
}

async function getKYCProfileNumbers(profileId: string) {
  try {
    const apiKey = await generateToken();

    const url = `https://www.docfoxapp.com/api/v2/profiles/${profileId}/numbers`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    const kycProfileNumbers = response.data;

    return kycProfileNumbers;
  } catch (error) {
    console.error("Error fetching KYC application profile numbers", error);
    throw new Error("Failed to fetch KYC application profile numbers");
  }
}

async function getKYCProfileAddresses(profileId: string) {
  try {
    const apiKey = await generateToken();

    const url = `https://www.docfoxapp.com/api/v2/profiles/${profileId}/addresses`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    const kycProfileAddresses = response.data;

    return kycProfileAddresses;
  } catch (error) {
    console.error("Error fetching KYC application profile addresses", error);
    throw new Error("Failed to fetch KYC application profile addresses");
  }
}

async function getKYCProfileAdditionalDetails(profileId: string) {
  try {
    const apiKey = await generateToken();

    const url = `https://www.docfoxapp.com/api/v2/profiles/${profileId}/additional_details`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/vnd.api+json",
      },
    });

    const kycProfileAdditionalDetails = response.data;

    return kycProfileAdditionalDetails;
  } catch (error) {
    console.error("Error fetching KYC application profile additional_details", error);
    throw new Error("Failed to fetch KYC application profile additional_details");
  }
}

// Firebase Cloud Function to handle KYC applications request
exports.getKYCApplications = functions.https.onRequest((req:any, res:any) => {
  cors(req, res, async () => {
    try {
      const kycApplications = await getKYCApplications();
      res.json(kycApplications);
    } catch (error) {
      res.statusCode;
    }
  });
});

exports.getKYCApplicationRiskRatings = functions.https.onRequest((req:any, res:any) => {
  cors(req, res, async () => {
    try {
      const kycApplicationId: string = req.header("X-KYC-Application-Id") || "";
      if (kycApplicationId !== "") {
        const kycApplicationRiskRatings = await getKYCApplicationRiskRatings(kycApplicationId);
        res.json(kycApplicationRiskRatings);
      } else {
        res.json(`Could not fetch Application Risk Ratings ${kycApplicationId}`);
      }
    } catch (error) {
      res.statusCode;
    }
  });
});

exports.getKYCApplicationRelatedEntities = functions.https.onRequest((req:any, res:any) => {
  cors(req, res, async () => {
    try {
      const kycApplicationId: string = req.header("X-KYC-Application-Id") || "";
      if (kycApplicationId !== "") {
        const kycApplicationRelatedEntities = await getKYCApplicationRelatedEntities(kycApplicationId);
        res.json(kycApplicationRelatedEntities);
      } else {
        res.json(`Could not fetch Application Risk Ratings ${kycApplicationId}`);
      }
    } catch (error) {
      res.statusCode;
    }
  });
});

exports.getKYCApplicationBankAccountDetails = functions.https.onRequest((req:any, res:any) => {
  cors(req, res, async () => {
    try {
      const kycApplicationId: string = req.header("X-KYC-Application-Id") || "";
      if (kycApplicationId !== "") {
        const kycApplicationBankingDetails = await getKYCApplicationBankAccountDetails(kycApplicationId);
        res.json(kycApplicationBankingDetails);
      } else {
        res.json(`Could not fetch Application Risk Ratings ${kycApplicationId}`);
      }
    } catch (error) {
      res.statusCode;
    }
  });
});

exports.getKYCProfileNames = functions.https.onRequest((req:any, res:any) => {
  cors(req, res, async () => {
    try {
      const kycProfileId: string = req.header("X-KYC-Profile-Id") || "";
      if (kycProfileId !== "") {
        const kycProfileNames = await getKYCProfileNames(kycProfileId);
        res.json(kycProfileNames);
      } else {
        res.json(`Could not fetch Profile Names ${kycProfileId}`);
      }

    } catch (error) {
      res.statusCode;
    }
  });
});

exports.getKYCProfileContacts = functions.https.onRequest((req:any, res:any) => {
  cors(req, res, async () => {
    try {
      const kycProfileId: string = req.header("X-KYC-Profile-Id") || "";
      if (kycProfileId !== "") {
        const kycProfileContacts = await getKYCProfileContacts(kycProfileId);
        res.json(kycProfileContacts);
      } else {
        res.json(`Could not fetch Profile Contacts ${kycProfileId}`);
      }

    } catch (error) {
      res.statusCode;
    }
  });
});

exports.getKYCProfileNumbers = functions.https.onRequest((req:any, res:any) => {
  cors(req, res, async () => {
    try {
      const kycProfileId: string = req.header("X-KYC-Profile-Id") || "";
      if (kycProfileId !== "") {
        const kycProfileNumbers = await getKYCProfileNumbers(kycProfileId);
        res.json(kycProfileNumbers);
      } else {
        res.json(`Could not fetch Profile Numbers ${kycProfileId}`);
      }

    } catch (error) {
      res.statusCode;
    }
  });
});

exports.getKYCProfileAddresses = functions.https.onRequest((req:any, res:any) => {
  cors(req, res, async () => {
    try {
      const kycProfileId: string = req.header("X-KYC-Profile-Id") || "";
      if (kycProfileId !== "") {
        const kycProfileAddresses = await getKYCProfileAddresses(kycProfileId);
        res.json(kycProfileAddresses);
      } else {
        res.json(`Could not fetch Profile Addresses ${kycProfileId}`);
      }

    } catch (error) {
      res.statusCode;
    }
  });
});

exports.getKYCProfileAdditionalDetails = functions.https.onRequest((req:any, res:any) => {
  cors(req, res, async () => {
    try {
      const kycProfileId: string = req.header("X-KYC-Profile-Id") || "";
      if (kycProfileId !== "") {
        const kycProfileAdditionlDetails = await getKYCProfileAdditionalDetails(kycProfileId);
        res.json(kycProfileAdditionlDetails);
      } else {
        res.json(`Could not fetch Profile Additionl Details ${kycProfileId}`);
      }

    } catch (error) {
      res.statusCode;
    }
  });
});

exports.dailyAssetManagerFlowDays = functions.pubsub
  // .schedule("0 0 * * *") // Cron expression for midnight every day
  .schedule("0 1-11/0.5 * * *") // test CRON
  .timeZone("Africa/Windhoek")
  .onRun(async (context) => {
    try {
      //get all money market accounts
      await getAllMoneyMarketAccounts();

      //calculate interest and add the interest for each money market account
      if (accounts.length !== 0) {

        accounts.forEach((account) => {

          const interestLog: IMoneyAccountInterestLog = {
            id: account.accountNumber,
            interestLogDate: Date.now(),
            interest: account.balance * (account.baseRate - account.feeRate / 100) / 365,
            runningBalance: account.balance + (account.balance * account.feeRate),
            accountBalance: account.balance
          };

          capitaliseDailyInterest(account.id, interestLog);

        });

      }

      return null;

    } catch (error) {

      console.error(error);
      return null;

    }
  });

exports.recurringTransactions = functions.pubsub
  .schedule("*/1 * * * * *") // Run every 1 minute, i.e., every 60 seconds
  .timeZone("Africa/Windhoek")
  .onRun(async (context) => {
    try {
      await recurringTransactions();
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  });


exports.dailyInterestAccural = functions.pubsub
  .schedule("0 0 * * *") // Cron expression for midnight every day
  // .schedule("0 1-11/0.5 * * *") // test CRON
  .timeZone("Africa/Windhoek")
  .onRun(async (context) => {
    try {
      //get all money market accounts
      await getAllMoneyMarketAccounts();

      //calculate interest and add the interest for each money market account
      if (accounts.length !== 0) {

        accounts.forEach((account) => {
          const interestLog: IMoneyAccountInterestLog = {
            id: account.accountNumber,
            interestLogDate: Date.now(),
            interest: account.balance * (account.feeRate / 100) / 365,
            runningBalance: account.balance + (account.balance * account.feeRate),
            accountBalance: account.balance
          };

          capitaliseDailyInterest(account.id, interestLog);

        });
      }

      return null;

    } catch (error) {
      console.error(error);
      return null;
    }
  });

// exports.monthlyInterestCapitalisation = functions.pubsub
//   // .schedule("0 0 * * *") // Cron expression for midnight every day
//   .schedule("0 0 28-31 * *") // test CRON
//   .timeZone("Africa/Windhoek")
//   .onRun(async (context) => {
//     try {
//       //get all money market accounts
//       await getAllMoneyMarketAccounts();

//       //calculate interest and add the interest for each money market account
//       if (accountInterestLog.length !== 0) {
//         accountInterestLog.forEach((account) => {
//           const interest = account.interest;
//           capitaliseDailyInterest(account.id, interestLog);
//         });
//       }
//       return null;
//     } catch (error) {
//       console.error(error);
//       return null;
//     }
//   });
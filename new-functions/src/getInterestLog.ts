/* eslint-disable */
import admin = require("firebase-admin");

admin.initializeApp();

interface InterestLog {
    date: string; // You may need to adjust the type based on your data structure
    balance: number;
    // Add other fields as needed
}

export async function getInterestBalanceForPreviousDay(accountId: string) {
    const interestLogCollection = admin.firestore().collection(`moneyMarketAccounts/${accountId}/interestLog`);

    // Get the current date
    const currentDate = new Date();

    // Calculate the timestamp for the start of the previous day
    const previousDayStart = new Date(currentDate);
    previousDayStart.setDate(currentDate.getDate() - 1);
    previousDayStart.setHours(0, 0, 0, 0);

    // Calculate the timestamp for the end of the previous day
    const previousDayEnd = new Date(currentDate);
    previousDayEnd.setHours(0, 0, 0, 0);

    try {
        // Query interest log for the previous day
        const interestLogQuery = await interestLogCollection
            .where("date", ">=", previousDayStart.toISOString())
            .where("date", "<", previousDayEnd.toISOString())
            .get();

        const interestLogData: InterestLog[] = interestLogQuery.docs.map((doc) => doc.data() as InterestLog);
        console.log(`Interest Log for account ${accountId} on the previous day:`, interestLogData);

        return interestLogData;
    } catch (error) {
        console.error(`Error retrieving interest log for account ${accountId}:`, error);
        throw error;
    }
}



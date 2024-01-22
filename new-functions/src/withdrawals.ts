/* eslint-disable */
import admin = require("firebase-admin");

export async function getWithdrawalForPreviousDay() {
    // Assuming you have a reference to the Firestore collection
    const depositCollection = admin.firestore().collection("clientWithdrawalPayments");

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
        // Query deposits for the previous day
        const depositQuery = await depositCollection
            .where("timestamp", ">=", previousDayStart)
            .where("timestamp", "<", previousDayEnd)
            .get();

        const depositData = depositQuery.docs.map((doc) => doc.data());
        return depositData;
    } catch (error) {
        console.error("Error retrieving deposits:", error);
        throw error;
    }
}
/* eslint-disable */
import admin = require("firebase-admin");

admin.initializeApp();

export async function getRatesFromMMA() {
    const mmaCollection = admin.firestore().collection("moneyMarketAccount");

    try {
        // Query all rates from the moneyMarketAccount collection
        const mmaQuery = await mmaCollection.get();

        // Extract data from the query result
        const mmaData = mmaQuery.docs.map((doc: any) => {
            const { accountNumber, rate } = doc.data();
            return { accountNumber, rate };
        });

        // Log or process the MMA data as needed
        console.log("Money Market Account Rates:", mmaData);

        return mmaData;
    } catch (error) {
        console.error("Error retrieving MMA rates:", error);
        throw error;
    }
}



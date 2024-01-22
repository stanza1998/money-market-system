import { useEffect } from "react"
import { useAppContext } from "../shared/functions/Context"

import { IMoneyAccountInterestLog } from "../shared/apis/MoneyMarketAccountApi";
import { dateFormat_YY_MM_DD } from "../shared/utils/utils";
import { observer } from "mobx-react-lite";
import { IMoneyMarketAccount } from "../shared/models/MoneyMarketAccount";
import { db } from '../shared/config/firebase-config';
import { doc, collection, getDocs, deleteDoc, query } from "firebase/firestore";
import { random } from "lodash";
import swal from "sweetalert";

const TestAccrualFunction = observer(() => {
    const { api, store } = useAppContext();

    const accounts = store.mma.all;

    const runDailyInterest = () => {
        if (accounts.length !== 0) {
            accounts.forEach(async (account) => {

                const _accountBalance = account.asJson.balance;
                const _monthTotalInterest = account.asJson.monthTotalInterest || 0;
                const _fee = account.asJson.baseRate - account.asJson.feeRate;
                const _previousInterest = account.asJson.previousInterestEarned || 0;
                const _interest = _accountBalance * (_fee / 100) / 365;

                const _runningBalance = _previousInterest + _interest;
                const _totalInterest = _monthTotalInterest + _interest

                const interestLog: IMoneyAccountInterestLog = {
                    id: account.asJson.accountNumber,
                    // interestLogDate: dateFormat_YY_MM_DD(Date.now()),
                    interestLogDate: `2024-01-22`,
                    interest: _interest,
                    fee: _fee,
                    runningBalance: _runningBalance,
                    accountBalance: _accountBalance
                };

                const _updatedAccountDetails: IMoneyMarketAccount = {
                    ...account.asJson,
                    previousInterestEarned: _runningBalance,
                    monthTotalInterest: _totalInterest + _interest
                }

                try {
                    await api.mma.update(_updatedAccountDetails);
                    await api.mma.capitaliseDailyInterest(account.asJson.id, interestLog);
                    swal("Complete")
                } catch (error) {

                }
            });
        }
    }

    const runMonthlyInterest = () => {
        if (accounts.length !== 0) {
            accounts.forEach(async (account) => {

                const _accountBalance = account.asJson.balance;
                const _monthTotalInterest = account.asJson.monthTotalInterest || 0;

                const _updatedAccountDetails: IMoneyMarketAccount = {
                    ...account.asJson,
                    balance: _accountBalance + _monthTotalInterest,
                    monthTotalInterest: 0
                }

                try {
                    await api.mma.update(_updatedAccountDetails);
                } catch (error) {

                }
            });
        }
    }

    const restAccountNumbers = () => {
        if (accounts.length !== 0) {
            accounts.forEach(async (account) => {

                const _accountBalance = random(1000000, true);

                const _updatedAccountDetails: IMoneyMarketAccount = {
                    ...account.asJson,
                    previousInterestEarned: 0,
                    balance: _accountBalance,
                    runningBalance: _accountBalance,
                    monthTotalInterest: 0,
                    feeRate: 0.45,
                    status: "Active"
                }

                try {
                    await api.mma.update(_updatedAccountDetails);
                } catch (error) {
                }
            });
        }
    }


    const deleteAccountLogs = () => {
        if (accounts.length !== 0) {
            accounts.forEach(async (account) => {
                deleteSubcollection(account.asJson.id, 'interestLog');
                deleteWithdrawals(account.asJson.id, 'withdrawals');
                deleteDeposits(account.asJson.id, 'deposits');
            });
        }
    }

    const deleteSubcollection = async (parentDocumentId: string, subcollectionName: string) => {
        try {
            // Reference to the parent document
            const parentDocRef = doc(db, 'moneyMarketAccounts', parentDocumentId);

            // Reference to the subcollection
            const subcollectionRef = collection(parentDocRef, subcollectionName);

            // Query to get all documents in the subcollection
            const subcollectionQuerySnapshot = await getDocs(subcollectionRef);

            // Delete each document in the subcollection
            subcollectionQuerySnapshot.forEach(async (subDoc) => {
                await deleteDoc(subDoc.ref);
            });

            return 'Subcollection deleted successfully';
        } catch (error) {
            console.error('Error deleting subcollection:', error);
            throw error;
        }
    };

    const deleteWithdrawals = async (parentDocumentId: string, subcollectionName: string) => {
        try {
            // Reference to the parent document
            const parentDocRef = doc(db, 'moneyMarketAccounts', parentDocumentId);

            // Reference to the subcollection
            const subcollectionRef = collection(parentDocRef, subcollectionName);

            // Query to get all documents in the subcollection
            const subcollectionQuerySnapshot = await getDocs(subcollectionRef);

            // Delete each document in the subcollection
            subcollectionQuerySnapshot.forEach(async (subDoc) => {
                await deleteDoc(subDoc.ref);
            });

            return 'Subcollection deleted successfully';
        } catch (error) {
            console.error('Error deleting subcollection:', error);
            throw error;
        }
    };

    const deleteDeposits = async (parentDocumentId: string, subcollectionName: string) => {
        try {
            // Reference to the parent document
            const parentDocRef = doc(db, 'moneyMarketAccounts', parentDocumentId);

            // Reference to the subcollection
            const subcollectionRef = collection(parentDocRef, subcollectionName);

            // Query to get all documents in the subcollection
            const subcollectionQuerySnapshot = await getDocs(subcollectionRef);

            // Delete each document in the subcollection
            subcollectionQuerySnapshot.forEach(async (subDoc) => {
                await deleteDoc(subDoc.ref);
            });

            return 'Subcollection deleted successfully';
        } catch (error) {
            console.error('Error deleting subcollection:', error);
            throw error;
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await api.mma.getAll();
        }
        loadData();
    }, [api.mma])

    return (
        <div className="uk-padding">
            <h4 className="main-title-small">Test Data Reset Command Center</h4>
            <button className="btn btn-danger uk-margin-right" onClick={restAccountNumbers}>Re-Initialise Accounts</button>
            <button className="btn btn-danger uk-margin-right" onClick={runDailyInterest}>Run Daily Interest</button>
            <button className="btn btn-danger uk-margin-right" onClick={runMonthlyInterest}>Capitalise</button>
            <button className="btn btn-danger uk-margin-right" onClick={deleteAccountLogs}>Delete Logs</button>
        </div>
    )
})

export default TestAccrualFunction

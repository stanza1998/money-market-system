import { useNavigate } from "react-router-dom";
import MODAL_NAMES from "../../logged-in/dialogs/ModalName";
import AppApi from "../apis/AppApi";
import { IMoneyMarketAccount } from "../models/MoneyMarketAccount";
import { ISwitchTransaction } from "../models/SwitchTransactionModel";
import { IClientDepositAllocation } from "../models/client-deposit-allocation/ClientDepositAllocationModel";
import { IClientWithdrawalPayment } from "../models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import AppStore from "../stores/AppStore";
import { hideModalFromId } from "./ModalShow";
import { addDepositedAmountToBalance, getPreviousBalanceSwitch, updateMMAClosingStatus } from "./MyFunctions";
import swal from "sweetalert";




export async function closeOffAccountWithdrawal(
    monthlyInterest: number,
    accountNumber: string,
    entity: string,
    uid: string | "",
    formattedTime: string,
    store: AppStore,
    api: AppApi,
    balance: number
) {

    try {
        const shouldCloseAccount = await swal({
            title: "Are you sure? (Withdrawal)",
            icon: "warning",
            buttons: ["Cancel", `Close Account ${accountNumber}:`],
            dangerMode: true,
        });

        if (!shouldCloseAccount) {
            swal({
                icon: "error",
                text: "Failed!",
            });
            return;
        }

        // Deposit
        const depositTransaction: IClientDepositAllocation = {
            id: "",
            reference: "Capitalized Deposit",
            description: "Close off Account",
            amount: monthlyInterest,
            transactionDate: Date.now(),
            valueDate: Date.now(),
            allocation: accountNumber,
            entity: entity,
            allocatedBy: uid,
            allocationApprovedBy: "",
            allocationStatus: "",
            transactionStatus: "verified",
            bank: "",
            sourceOfFunds: "",
            reasonForNoSourceOfFunds: "",
            proofOfPayment: "",
            reasonForNoProofOfPayment: "",
            instruction: "",
            reasonForNoInstruction: "",
            isRecurring: false,
            recurringDay: null,
            timeVerified: formattedTime,
            whoVerified: uid,
            executionTime: formattedTime,
        };

        if (monthlyInterest > 0) {
            await api.clientDepositAllocation.create(depositTransaction);
            await addDepositedAmountToBalance(
                monthlyInterest,
                accountNumber,
                store,
                api,
                depositTransaction.id
            );
        }

        // Withdrawal
        const withdrawnAmount = balance + monthlyInterest;
        const withdrawalTransaction: IClientWithdrawalPayment = {
            id: "",
            amount: withdrawnAmount,
            reference: "Close off account: Capitalize and then withdraw",
            description: "Close off Account",
            transactionDate: Date.now(),
            valueDate: Date.now(),
            entity: entity,
            allocation: accountNumber,
            allocatedBy: uid,
            allocationApprovedBy: "",
            allocationStatus: "unallocated",
            transactionStatus: "pending",
            bank: "",
            sourceOfFunds: "",
            reasonForNoSourceOfFunds: "",
            proofOfPayment: "",
            reasonForNoProofOfPayment: "",
            instruction: "",
            reasonForNoInstruction: "",
            isRecurring: false,
            recurringDay: null,
        };

        await api.clientWithdrawalPayment.create(withdrawalTransaction);
        await updateMMAClosingStatus(accountNumber, store, api);
        hideModalFromId(MODAL_NAMES.BACK_OFFICE.CLOSE_MM_ACCOUNT);


        swal({
            title: "Withdrawal Transaction Initiated",
            text: "Withdrawal transaction has been initiated to finalize the account closure process. The account is now pending authorization for the withdrawal to proceed and complete the closure.",
        });


    } catch (error) {
        console.error("Error during closeOffAccountWithdrawal:", error);
        swal({
            icon: "error",
            text: "An error occurred!",
        });
    }
}


// works but needs improvement to make it mor readable and maintainable
export async function closeOffAccountSwitch(monthlyInterest: number, accountNumber: string, entity: string, uid: string | "", formattedTime: string, store: AppStore, api: AppApi, balance: number, selectedAccount: string, accountName: string, accountType: string, baseRate: number, feeRate: number, cession: number) {

    swal({
        title: "Are you sure? (Switch)",
        icon: "warning",
        buttons: ["Cancel", `Close Account ${accountNumber}`],
        dangerMode: true,
    }).then(async (edit) => {
        if (edit) {
            const depositTransaction: IClientDepositAllocation = {
                id: "",
                reference: "Capitalized Deposit",
                description: "Close off Account",
                amount: monthlyInterest,
                transactionDate: Date.now(),
                valueDate: Date.now(),
                allocation: accountNumber,
                entity: entity,
                allocatedBy: uid,
                allocationApprovedBy: "",
                allocationStatus: "",
                transactionStatus: "verified",
                bank: "",
                sourceOfFunds: "",
                reasonForNoSourceOfFunds: "",
                proofOfPayment: "",
                reasonForNoProofOfPayment: "",
                instruction: "",
                reasonForNoInstruction: "",
                isRecurring: false,
                recurringDay: null,
                timeVerified: formattedTime,
                whoVerified: uid,
                executionTime: formattedTime,
            };

            if (monthlyInterest > 0) {
                try {
                    await api.clientDepositAllocation.create(depositTransaction);
                    addDepositedAmountToBalance(
                        monthlyInterest,
                        accountNumber,
                        store,
                        api,
                        depositTransaction.id
                    );
                } catch (error) { }
            }

            //switch

            const clientAccounts = store.mma.all
                .filter(
                    (mma) =>
                        mma.asJson.parentEntity === entity && mma.asJson.status === "Active"
                )
                .map((mma) => {
                    return mma.asJson;
                });

            const fromAccount =
                (clientAccounts.find((a) => a.accountNumber === accountNumber)?.balance ||
                    0) + monthlyInterest;

            const toAccount =
                (clientAccounts.find((a) => a.accountNumber === selectedAccount)
                    ?.balance || 0) + monthlyInterest;
            const mmaAccounts = store.mma.all.map((mma) => {
                return mma.asJson;
            });


            //from account
            const withdrawFromAccount = mmaAccounts.find(
                (acc) => acc.accountNumber === accountNumber
            );

            //to account
            const depositToAccount = mmaAccounts.find(
                (acc) => acc.accountNumber === selectedAccount
            );

            if (withdrawFromAccount) {
                const newBalance = withdrawFromAccount.balance - balance;
                console.log(
                    `From account: new balance:  ${newBalance}, = from Account Balance: ${withdrawFromAccount.balance} - balance: , ${balance} , + monthly Interest: , ${monthlyInterest}`
                );

                const switchAmount =
                    withdrawFromAccount.balance + monthlyInterest;

                const runningBalance =
                    withdrawFromAccount.balance - balance + monthlyInterest;

                const accountUpdate: IMoneyMarketAccount = {
                    id: withdrawFromAccount.id,
                    parentEntity: entity,
                    accountNumber: accountNumber,
                    accountName: withdrawFromAccount.accountName,
                    accountType: withdrawFromAccount.accountType,
                    baseRate: baseRate,
                    feeRate: feeRate,
                    cession: cession,
                    displayOnEntityStatement: false,
                    balance: newBalance,
                    runningBalance: runningBalance,
                    status: "Closed",
                };
                try {
                    await api.mma.update(accountUpdate);
                } catch (error) {
                    console.log(error);
                }
                const switchTransaction: ISwitchTransaction = {
                    id: "",
                    switchDate: Date.now(),
                    fromAccount: accountNumber,
                    toAccount: selectedAccount,
                    amount: switchAmount,
                    switchedBy: store.auth.meJson?.uid || "",
                    executionTime: formattedTime,
                    whoSwitchedAmount: uid,
                };

                try {
                    await api.switch.create(switchTransaction);
                    getPreviousBalanceSwitch(
                        switchTransaction.id,
                        fromAccount,
                        toAccount - monthlyInterest,
                        store,
                        api
                    );
                } catch (error) {
                    console.log(error);
                }

                //To account
                if (depositToAccount) {
                    const newBalance = depositToAccount.balance + balance + monthlyInterest;
                    const runningBalance = depositToAccount.balance + balance;

                    console.log(
                        `To account: new balance:  ${newBalance}, = from Account Balance: ${depositToAccount?.balance} + balance: , ${balance} , + monthly Interest: , ${monthlyInterest}`
                    );
                    const accountUpdate: IMoneyMarketAccount = {
                        id: depositToAccount.id,
                        parentEntity: depositToAccount.parentEntity,
                        accountNumber: depositToAccount.accountNumber,
                        accountName: depositToAccount.accountName,
                        accountType: depositToAccount.accountType,
                        baseRate: depositToAccount.baseRate,
                        feeRate: depositToAccount.feeRate,
                        cession: depositToAccount.cession,
                        displayOnEntityStatement: true,
                        balance: newBalance,
                        runningBalance: runningBalance,
                        status: "Active",
                    };
                    try {
                        await api.mma.update(accountUpdate);
                    } catch (error) {
                        console.log(error);
                    }
                }
                hideModalFromId(MODAL_NAMES.BACK_OFFICE.CLOSE_MM_ACCOUNT);
                swal({
                    title: `Remaining funds have been transferred to ${selectedAccount}`,
                    text: "The account has been successfully closed, and the remaining amount has been transferred to the specified account.",
                });
            }

        } else {
            swal({
                icon: "error",
                text: "Failed!",
            });
        }
    });
}
//re writing switch function for better readability
export async function closeOffAccountSwitchImproved(
    monthlyInterest: number,
    accountNumber: string,
    entity: string,
    uid: string | "",
    formattedTime: string,
    store: AppStore,
    api: AppApi,
    balance: number,
    selectedAccount: string,
    accountName: string,
    accountType: string,
    baseRate: number,
    feeRate: number,
    cession: number
) {
    try {
        const shouldCloseAccount = await swal({
            title: "Are you sure? (Switch)",
            icon: "warning",
            buttons: ["Cancel", `Close Account ${accountNumber}`],
            dangerMode: true,
        });

        if (!shouldCloseAccount) {
            swal({
                icon: "error",
                text: "Failed!",
            });
            return;
        }

        // Deposit
        const depositTransaction: IClientDepositAllocation = {
            id: "",
            reference: "Capitalized Deposit",
            description: "Close off Account",
            amount: monthlyInterest,
            transactionDate: Date.now(),
            valueDate: Date.now(),
            allocation: accountNumber,
            entity: entity,
            allocatedBy: uid,
            allocationApprovedBy: "",
            allocationStatus: "",
            transactionStatus: "verified",
            bank: "",
            sourceOfFunds: "",
            reasonForNoSourceOfFunds: "",
            proofOfPayment: "",
            reasonForNoProofOfPayment: "",
            instruction: "",
            reasonForNoInstruction: "",
            isRecurring: false,
            recurringDay: null,
            timeVerified: formattedTime,
            whoVerified: uid,
            executionTime: formattedTime,
        };

        if (monthlyInterest > 0) {
            await api.clientDepositAllocation.create(depositTransaction);
            await addDepositedAmountToBalance(
                monthlyInterest,
                accountNumber,
                store,
                api,
                depositTransaction.id
            );
        }

        // Switch
        const clientAccounts = store.mma.all
            .filter((mma) => mma.asJson.parentEntity === entity && mma.asJson.status === "Active")
            .map((mma) => mma.asJson);

        const fromAccount = (clientAccounts.find((a) => a.accountNumber === accountNumber)?.balance || 0) + monthlyInterest;
        const toAccount = (clientAccounts.find((a) => a.accountNumber === selectedAccount)?.balance || 0) + monthlyInterest;
        const mmaAccounts = store.mma.all.map((mma) => mma.asJson);

        // From account
        const withdrawFromAccount = mmaAccounts.find((acc) => acc.accountNumber === accountNumber);

        // To account
        const depositToAccount = mmaAccounts.find((acc) => acc.accountNumber === selectedAccount);

        if (withdrawFromAccount && depositToAccount) {
            const newBalance = withdrawFromAccount.balance - balance;
            const switchAmount = withdrawFromAccount.balance + monthlyInterest;
            const runningBalance = withdrawFromAccount.balance - balance;

            // Update "From" account
            const accountUpdateFrom: IMoneyMarketAccount = {
                id: withdrawFromAccount.id,
                parentEntity: entity,
                accountNumber: accountNumber,
                accountName: accountName,
                accountType: accountType,
                baseRate: baseRate,
                feeRate: feeRate,
                cession: cession,
                displayOnEntityStatement: false,
                balance: newBalance,
                runningBalance: runningBalance,
                status: "Closed",
            };

            await api.mma.update(accountUpdateFrom);

            // Switch transaction
            const switchTransaction: ISwitchTransaction = {
                id: "",
                switchDate: Date.now(),
                fromAccount: accountNumber,
                toAccount: selectedAccount,
                amount: switchAmount,
                switchedBy: store.auth.meJson?.uid || "",
                executionTime: formattedTime,
                whoSwitchedAmount: uid,
            };

            await api.switch.create(switchTransaction);
            await getPreviousBalanceSwitch(switchTransaction.id, fromAccount, toAccount - monthlyInterest, store, api);

            // Update "To" account
            const newBalanceTo = depositToAccount.balance + balance + monthlyInterest;
            const runningBalanceTo = depositToAccount.balance + balance;
            const accountUpdateTo: IMoneyMarketAccount = {
                id: depositToAccount.id,
                parentEntity: depositToAccount.parentEntity,
                accountNumber: depositToAccount.accountNumber,
                accountName: depositToAccount.accountName,
                accountType: depositToAccount.accountType,
                baseRate: depositToAccount.baseRate,
                feeRate: depositToAccount.feeRate,
                cession: depositToAccount.cession,
                displayOnEntityStatement: true,
                balance: newBalanceTo,
                runningBalance: runningBalanceTo,
                status: "Active",
            };

            await api.mma.update(accountUpdateTo);
        }

        hideModalFromId(MODAL_NAMES.BACK_OFFICE.CLOSE_MM_ACCOUNT);
    } catch (error) {
        console.error("Error during closeOffAccountSwitch:", error);
        swal({
            icon: "error",
            text: "An error occurred!",
        });
    }
}


// export async function closeOffAccountWithdrawal(monthlyInterest: number, accountNumber: string, entity: string, uid: string | "", formattedTime: string, store: AppStore, api: AppApi, balance: number) {

//     swal({
//         title: "Are you sure? (Withdrawal)",
//         icon: "warning",
//         buttons: ["Cancel", `Close Account ${accountNumber}:`],
//         dangerMode: true,
//     }).then(async (edit) => {
//         if (edit) {

//             //deposit
//             const depositTransaction: IClientDepositAllocation = {
//                 id: "",
//                 reference: "Capitalized Deposit",
//                 description: "Close off Account",
//                 amount: monthlyInterest,
//                 transactionDate: Date.now(),
//                 valueDate: Date.now(),
//                 allocation: accountNumber,
//                 entity: entity,
//                 allocatedBy: uid,
//                 allocationApprovedBy: "",
//                 allocationStatus: "",
//                 transactionStatus: "verified",
//                 bank: "",
//                 sourceOfFunds: "",
//                 reasonForNoSourceOfFunds: "",
//                 proofOfPayment: "",
//                 reasonForNoProofOfPayment: "",
//                 instruction: "",
//                 reasonForNoInstruction: "",
//                 isRecurring: false,
//                 recurringDay: null,
//                 timeVerified: formattedTime,
//                 whoVerified: uid,
//                 executionTime: formattedTime,
//             };

//             if (monthlyInterest > 0) {
//                 try {
//                     await api.clientDepositAllocation.create(depositTransaction);
//                     addDepositedAmountToBalance(
//                         monthlyInterest,
//                         accountNumber,
//                         store,
//                         api,
//                         depositTransaction.id
//                     );
//                 } catch (error) { }
//             }

//             //withdrawal
//             const withdrawnAmount = balance + monthlyInterest;
//             const withdrawalTransaction: IClientWithdrawalPayment = {
//                 id: "",
//                 amount: withdrawnAmount,
//                 reference: "Close off account: Capitalize and then withdraw",
//                 description: "Close off Account",
//                 transactionDate: Date.now(),
//                 valueDate: Date.now(),
//                 entity: entity,
//                 allocation: accountNumber,
//                 allocatedBy: uid,
//                 allocationApprovedBy: "",
//                 allocationStatus: "unallocated",
//                 transactionStatus: "pending",
//                 bank: "",
//                 sourceOfFunds: "",
//                 reasonForNoSourceOfFunds: "",
//                 proofOfPayment: "",
//                 reasonForNoProofOfPayment: "",
//                 instruction: "",
//                 reasonForNoInstruction: "",
//                 isRecurring: false,
//                 recurringDay: null,
//             };

//             try {
//                 await api.clientWithdrawalPayment.create(withdrawalTransaction);
//                 updateMMAClosingStatus(accountNumber, store, api);
//             } catch (error) { }

//             hideModalFromId(MODAL_NAMES.BACK_OFFICE.CLOSE_MM_ACCOUNT);
//         } else {
//             swal({
//                 icon: "error",
//                 text: "Failed!",
//             });
//         }
//     });

// }
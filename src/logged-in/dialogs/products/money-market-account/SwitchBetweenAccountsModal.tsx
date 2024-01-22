import { FormEvent, useState } from "react";
import swal from "sweetalert";

import React from "react";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../../shared/functions/Context";
import { currencyFormat } from "../../../../shared/functions/Directives";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import { IMoneyMarketAccount } from "../../../../shared/models/MoneyMarketAccount";
import { ISwitchTransaction } from "../../../../shared/models/SwitchTransactionModel";
import { IClientDepositAllocation, defaultClientDepositAllocation } from "../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel";
import MODAL_NAMES from "../../ModalName";

interface IProps{
    clientName: string;
}

const SwitchBetweenAccountsModal = (props: IProps) => {

    const { api, store } = useAppContext();
    const {clientName} = props;

    const [moneyMarketAccountDeposit, setMoneyMarketAccountDeposit] = useState<IClientDepositAllocation>({ ...defaultClientDepositAllocation });
    const [moneyMarketAccountWithdrawal, setMoneyMarketAccountWithdrawal] = useState<IClientDepositAllocation>({ ...defaultClientDepositAllocation });

    const moneyMarketAccounts = store.mma.all;
    const fromAccount = moneyMarketAccounts.find((account) => account.asJson.accountNumber === moneyMarketAccountWithdrawal.allocation);
    const toAccount = moneyMarketAccounts.find((account) => account.asJson.accountNumber === moneyMarketAccountDeposit.allocation);

    const clientAccountOptions = moneyMarketAccounts.filter((mma) => mma.asJson.parentEntity === clientName);

    const handleSwitchBetweemAccounts = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        swal({
            title: "Are you sure?",
            icon: "warning",
            buttons: ["Cancel", "Switch"],
            dangerMode: true,
        }).then(async (edit) => {
            if (edit) {
                const withDrawFromAccount = moneyMarketAccounts.find((account) => account.asJson.accountNumber === moneyMarketAccountWithdrawal.allocation);
                const depositToAccount = moneyMarketAccounts.find((account) => account.asJson.accountNumber === moneyMarketAccountDeposit.allocation);

                if (withDrawFromAccount) {

                    const newBalance = withDrawFromAccount.asJson.balance - moneyMarketAccountDeposit.amount;
                    const runningBalance = withDrawFromAccount.asJson.balance - moneyMarketAccountDeposit.amount;

                    // update balance in MM account
                    const accountUpdate: IMoneyMarketAccount = {
                        id: withDrawFromAccount.asJson.id,
                        parentEntity: withDrawFromAccount.asJson.parentEntity,
                        accountNumber: withDrawFromAccount.asJson.accountNumber,
                        accountName: withDrawFromAccount.asJson.accountName,
                        accountType: withDrawFromAccount.asJson.accountType,
                        baseRate: withDrawFromAccount.asJson.baseRate || 0,
                        feeRate: withDrawFromAccount.asJson.feeRate,
                        cession: withDrawFromAccount.asJson.cession,
                        displayOnEntityStatement: withDrawFromAccount.asJson.displayOnEntityStatement,
                        balance: newBalance,
                        runningBalance: runningBalance,
                        status: "Active"
                    }

                    try {
                        await api.mma.update(accountUpdate);
                    } catch (error) {
                        console.log(error);
                    }

                    // log the transaction in the MM account as a deposit
                    try {
                        await api.mma.createWithdrawalTransaction(withDrawFromAccount.asJson.id, moneyMarketAccountWithdrawal);
                    } catch (error) {
                    }
                }

                if (depositToAccount) {

                    const newBalance = depositToAccount.asJson.balance + moneyMarketAccountDeposit.amount;
                    const runningBalance = depositToAccount.asJson.balance + moneyMarketAccountDeposit.amount;

                    // update balance in MM account
                    const accountUpdate: IMoneyMarketAccount = {
                        id: depositToAccount.asJson.id,
                        parentEntity: depositToAccount.asJson.parentEntity,
                        accountNumber: depositToAccount.asJson.accountNumber,
                        accountName: depositToAccount.asJson.accountName,
                        accountType: depositToAccount.asJson.accountType,
                        baseRate: depositToAccount.asJson.baseRate || 0,
                        feeRate: depositToAccount.asJson.feeRate,
                        cession: depositToAccount.asJson.cession,
                        displayOnEntityStatement: depositToAccount.asJson.displayOnEntityStatement,
                        balance: newBalance,
                        runningBalance: runningBalance,
                        status: "Active"
                    }

                    try {
                        await api.mma.update(accountUpdate);
                    } catch (error) {
                        console.log(error);
                        
                    }

                    const switchTransaction: ISwitchTransaction = {
                        id:"",
                        switchDate: Date.now(),
                        fromAccount: moneyMarketAccountWithdrawal.allocation,
                        toAccount: moneyMarketAccountDeposit.allocation,
                        amount: moneyMarketAccountDeposit.amount,
                        switchedBy: store.auth.meJson?.uid || ""
                    }

                    try {
                        await api.switch.create(switchTransaction);
                    } catch (error) {
                        console.log(error);
                    }

                    // log the transaction in the MM account as a deposit
                    try {
                        await api.mma.createDepositTransaction(depositToAccount.asJson.id, moneyMarketAccountDeposit);
                    } catch (error) {
                        console.log(error);
                    }
                }

                swal({
                    icon: "success",
                    text: "Switch was successfull"
                });
                onCancel();
            }
        })
    }

    const onCancel = () => {
        hideModalFromId(MODAL_NAMES.BACK_OFFICE.SWITCH_BETWEEN_ACCOUNTS_MODAL);
    };

    return (
        <ErrorBoundary>
            <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-2-3">
                <button
                    className="uk-modal-close-default" onClick={onCancel}
                    type="button"
                    data-uk-close
                ></button>
                <h3 className="uk-modal-title text-to-break">Switch Between Accounts</h3>
                <div className="dialog-content uk-position-relative">
                    <form className="uk-grid uk-grid-small" data-uk-grid onSubmit={handleSwitchBetweemAccounts}>
                        <div className="uk-form-controls uk-width-1-2">
                            <label className="uk-form-label" htmlFor="">From Account</label>
                            <select
                                className="uk-select uk-form-small"
                                value={moneyMarketAccountWithdrawal.allocation}
                                id="clientAccount"
                                name={'clientAccount'}
                                onChange={(e) => setMoneyMarketAccountWithdrawal({ ...moneyMarketAccountWithdrawal, allocation: e.target.value })}
                                required
                            >
                                <option value={''} disabled>
                                    Select...
                                </option>
                                {clientAccountOptions.map((acc, index) => (
                                    <option key={acc.asJson.id} value={acc.asJson.accountNumber}>
                                        {acc.asJson.accountNumber}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="uk-form-controls uk-width-1-2">
                            <label className="uk-form-label" htmlFor="">To Account</label>
                            <select
                                className="uk-select uk-form-small"
                                value={moneyMarketAccountDeposit.allocation}
                                id="clientAccount"
                                name={'clientAccount'}
                                onChange={(e) => setMoneyMarketAccountDeposit({ ...moneyMarketAccountDeposit, allocation: e.target.value })}
                                required
                            >
                                <option value={''} disabled>
                                    Select...
                                </option>
                                {clientAccountOptions.filter(account => account.asJson.accountNumber !== moneyMarketAccountWithdrawal.allocation).map((acc, index) => (
                                    <option key={acc.asJson.id} value={acc.asJson.accountNumber}>
                                        {acc.asJson.accountNumber}
                                    </option>
                                ))}
                            </select>

                        </div>
                        <div className="uk-grid uk-grid-small uk-child-width-1-2 uk-width-1-1">
                            {
                                fromAccount &&
                                <div className="uk-card">
                                    <div className="uk-card-body">
                                        <h4>Switch-From Account Information</h4>
                                        <div className="uk-grid uk-grid-small">
                                            <div className="uk-width-1-3">
                                                <p>Account Number</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{fromAccount.asJson.accountNumber}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Account Name</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{fromAccount.asJson.accountName}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Account Type</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{fromAccount.asJson.accountType}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Fee Rate</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{fromAccount.asJson.feeRate}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Cession</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{currencyFormat(fromAccount.asJson.cession)}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Balance</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{currencyFormat(fromAccount.asJson.balance)}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Display on Statement</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{fromAccount.asJson.displayOnEntityStatement ? "Yes" : "No"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                toAccount &&
                                <div className="uk-card">
                                    <div className="uk-card-body">
                                        <h4>Switch-To Account Information</h4>
                                        <div className="uk-grid uk-grid-small">
                                            <div className="uk-width-1-3">
                                                <p>Account Number</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{toAccount.asJson.accountNumber}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Account Name</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{toAccount.asJson.accountName}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Account Type</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{toAccount.asJson.accountType}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Fee Rate</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{toAccount.asJson.feeRate}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Cession</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{currencyFormat(toAccount.asJson.cession)}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Balance</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{currencyFormat(toAccount.asJson.balance)}</p>
                                            </div>
                                            <hr className="uk-width-1-1" />
                                            <div className="uk-width-1-3">
                                                <p>Display on Statement</p>
                                            </div>
                                            <div className="uk-width-2-3">
                                                <p>{toAccount.asJson.displayOnEntityStatement ? "Yes" : "No"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>


                        <div className="uk-form-controls uk-width-1-2">
                            <label className="uk-form-label" htmlFor="">Amount</label>
                            <input className="uk-input uk-form-small" type="number" onChange={(e) => setMoneyMarketAccountDeposit({ ...moneyMarketAccountDeposit, amount: e.target.valueAsNumber })} max={fromAccount?.asJson.balance} />
                        </div>
                        <div className="uk-width-1-2"></div>
                        <div className="uk-form-controls">
                            <button className="btn btn-primary" type="submit">Switch</button>
                        </div>
                    </form>
                </div>
            </div>
        </ErrorBoundary >
    );
}

export default SwitchBetweenAccountsModal



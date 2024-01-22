import swal from "sweetalert";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { currencyFormat } from "../../../../../../shared/functions/Directives";
import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../../shared/functions/Context";
import {
  closeOffAccountSwitch,
  closeOffAccountWithdrawal,
} from "../../../../../../shared/functions/CloseOffFunction";
import { LoadingEllipsis } from "../../../../../../shared/components/loading/Loading";

interface Details {
  balance: number;
  cession: number;
  availableBalance: number;
  baseRate: number;
  feeRate: number;
  clientRate: number;
  accountNumber: string;
  accountName: string;
  accountType: string;
  entity: string;
  clientName: string;
  monthlyInterest: number;
}

export const CloseMoneyMarketAccountModal = observer(
  ({
    balance,
    cession,
    availableBalance,
    baseRate,
    feeRate,
    clientRate,
    accountNumber,
    accountName,
    accountType,
    entity,
    clientName,
    monthlyInterest,
  }: Details) => {
    const { store, api } = useAppContext();
    const [instruction, setInstruction] = useState("");
    const me = store.auth.meJson;
    const [loading, setLoading] = useState(false);
    const timeAuthorized = Date.now();
    const formattedTime = new Date(timeAuthorized).toUTCString();
    const [selectedAccount, setSelectedAccount] = useState<string>("");

    const clientAccounts = store.mma.all
      .filter(
        (mma) =>
          mma.asJson.parentEntity === entity && mma.asJson.status === "Active"
      )
      .map((mma) => {
        return mma.asJson;
      });

    const switchToAccounts = clientAccounts
      .filter((mma) => mma.accountNumber !== accountNumber)
      .map((mma) => {
        return mma;
      });

    const handleCloseOff = async () => {
      console.log("handleCloseOff called"); // Add this line
      setLoading(true);
      try {
        if (instruction === "Withdraw amount") {
          await closeOffAccountWithdrawal(
            monthlyInterest,
            accountNumber,
            entity,
            me?.uid || "",
            formattedTime,
            store,
            api,
            balance
          );
        }
        if (instruction === "Switch amount") {
          await closeOffAccountSwitch(
            monthlyInterest,
            accountNumber,
            entity,
            me?.uid || "",
            formattedTime,
            store,
            api,
            balance,
            selectedAccount,
            accountName,
            accountType,
            baseRate,
            feeRate,
            cession
          );
        }
      } catch (error) {
        console.error("Error during handleCloseOff:", error);
        swal({
          icon: "error",
          text: "An error occurred!",
        });
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      const getData = async () => {
        await api.mma.getAll();
      };
      getData();
    }, [api.mma]);

    return (
      <div className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
        <button
          className="uk-modal-close-default"
          type="button"
          data-uk-close
        ></button>
        {loading ? (
          <LoadingEllipsis />
        ) : (
          <div className="mma-view">
            <h3 className="uk-modal-title text-to-break">
              Close Money Market Account ({accountNumber})
            </h3>

            <div style={{ padding: "1rem" }} className="uk-margin">
              <Grid spacing={1} container>
                <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                  <ul className="uk-list uk-list-divider">
                    <li className="head">Account Overview </li>
                    <li>Balance: {currencyFormat(balance)}</li>
                    <li>Cession: {currencyFormat(cession)}</li>
                    <li>
                      Available Balance: {currencyFormat(availableBalance)}
                    </li>
                    <li>Base Rate: {baseRate} %</li>
                    <li>Fee Rate: {feeRate} %</li>
                    <li>Client Rate: {clientRate} %</li>
                  </ul>
                </Grid>
                <Grid xs={6} sm={6} md={6} lg={6} xl={6}>
                  <ul className="uk-list uk-list-divider">
                    <li className="head">Account Details </li>
                    <li>Account Number: {accountNumber}</li>
                    <li>Account Name: {accountName}</li>
                    <li>Account Type: {accountType}</li>
                    <li>Entity: {entity}</li>
                    <li>Client Name: {clientName}</li>
                    <li>
                      Total Interest Earned: {currencyFormat(monthlyInterest)}
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </div>
            {balance === 0 && monthlyInterest === 0 ? (
              <button className="btn" style={{ background: "red" }}>
                Close Account
              </button>
            ) : (
              <div className="uk-margin">
                <h4 className="head">Close off instruction</h4>
                <div className="margin">
                  <select
                    className="uk-input"
                    onChange={(e) => setInstruction(e.target.value)}
                  >
                    <option value="">Select Instruction</option>
                    <option value="Withdraw amount">Withdraw amount</option>
                    {clientAccounts.length > 1 && (
                      <option value="Switch amount">Switch amount</option>
                    )}
                  </select>
                </div>
                {instruction === "Switch amount" && (
                  <div className="uk-margin">
                    <h4 className="head">Accounts</h4>
                    <div className="uk-margiin">
                      <select
                        className="uk-input"
                        onChange={(e) => setSelectedAccount(e.target.value)}
                      >
                        <option value="">Select Account</option>
                        {switchToAccounts.map((s) => (
                          <option value={s.accountNumber}>
                            {s.accountNumber}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                <div className="uk-margin">
                  <button
                    disabled={!instruction}
                    className="btn"
                    style={{ background: "red" }}
                    onClick={handleCloseOff}
                  >
                    Close account
                    {loading && <div data-uk-spinner={"ratio:.5"}></div>}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

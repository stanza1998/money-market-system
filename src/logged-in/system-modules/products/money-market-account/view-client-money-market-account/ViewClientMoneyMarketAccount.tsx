import { observer } from "mobx-react-lite";

import Toolbar from "../../../../shared/toolbar/Toolbar";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { currencyFormat } from "../../../../../shared/functions/Directives";

import {
  dateFormat_YY_MM_DD_NEW,
  dateFormat_YY_MM_DD,
} from "../../../../../shared/utils/utils";
import ViewClientMoneyMarketAccountTabs from "./ViewClientMoneyMarketAccountTabs";
import { AccountTransactionsGrid } from "./AccountTransactionsGrid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeftLong,
  faCircleDot,
} from "@fortawesome/free-solid-svg-icons";
import {
  getAccountType,
  getEntityId,
  getPersonNameMMA,
} from "../../../../../shared/functions/MyFunctions";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Loading, {
  LoadingEllipsis,
} from "../../../../../shared/components/loading/Loading";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";
import { Avatar, IconButton } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import Modal from "../../../../../shared/components/Modal";
import { CloseMoneyMarketAccountModal } from "../../../../dialogs/crud/products/money-market-account/close-account-modal/CloseMoneyMarketAccountModal";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import InterestDataTable from "../../../../data-tables/clients/interest/InterestDataTable";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MoneyMarketStatement from "./MoneyMarketStatement";
interface Transaction {
  id: string;
  entityId: string;
  valueDate: string;
  transactionDate: string;
  transaction: string;
  amount: number;
  runningBalance: number;
  sortTime: string;
  pBalance: number;
}

const ViewClientMoneyMarketAccount = observer(() => {
  const { accountId } = useParams<{ accountId: string }>();

  const { api, store } = useAppContext();
  const [selectedTab, setSelectedTab] = useState("transactions-tab");

  const [loading, setLoading] = useState(false);

  const user = store.auth.meJson;
  const account = store.mma.getItemById(accountId || "");

  const combinedData: Transaction[] = [];

  const deposits = store.clientDepositAllocation.all;
  const withdrawals = store.clientWithdrawalPayment.all;
  const switchTransactions = store.switch.all;
  const cancelledTransaction = store.cancelledWithdrawal.all.filter(
    (transaction) =>
      transaction.asJson.allocation === account?.asJson.accountNumber &&
      transaction.asJson.transactionStatus === "authorised"
  );

  const onNavigate = useNavigate();

  const accountDeposits = deposits
    .filter(
      (transaction) =>
        transaction.asJson.allocation === account?.asJson.accountNumber &&
        transaction.asJson.transactionStatus === "verified"
    )
    .map((transaction) => transaction.asJson);

  const accountWithdrawals = withdrawals
    .filter(
      (transaction) =>
        transaction.asJson.allocation === account?.asJson.accountNumber &&
        transaction.asJson.transactionStatus === "authorised"
      // &&
      // transaction.asJson.isPaymentProcessed === true
    )
    .map((transaction) => transaction.asJson);

  const accountSwitchesFrom = switchTransactions
    .filter(
      (transaction) =>
        transaction.asJson.fromAccount === account?.asJson.accountNumber
    )
    .map((transaction) => transaction.asJson);

  const acccountSwitchesTo = switchTransactions
    .filter(
      (transaction) =>
        transaction.asJson.toAccount === account?.asJson.accountNumber
    )
    .map((transaction) => transaction.asJson);

  accountDeposits.forEach((transaction) => {
    combinedData.push({
      id: transaction.id,
      entityId: transaction.entity,
      valueDate: dateFormat_YY_MM_DD_NEW(transaction.transactionDate),
      transactionDate: dateFormat_YY_MM_DD_NEW(transaction.transactionDate),
      transaction: "Deposit",
      amount: transaction.amount,
      runningBalance: transaction.amount,
      sortTime: new Date(transaction.executionTime || 0).toUTCString(),
      pBalance: transaction?.previousBalance || 0,
    });
  });

  accountWithdrawals.forEach((transaction) => {
    combinedData.push({
      id: transaction.id,
      entityId: transaction.entity,
      valueDate: dateFormat_YY_MM_DD_NEW(transaction.transactionDate),
      transactionDate: dateFormat_YY_MM_DD_NEW(transaction.transactionDate),
      transaction: "Withdrawal",
      amount: transaction.amount,
      runningBalance: transaction.amount,
      sortTime: new Date(transaction.executionTime || 0).toUTCString(),
      pBalance: transaction?.previousBalance || 0,
    });
  });

  accountSwitchesFrom.forEach((transaction) => {
    combinedData.push({
      id: transaction.id,
      entityId: getEntityId(store, transaction.fromAccount),
      valueDate: dateFormat_YY_MM_DD(transaction.switchDate) || "",
      transactionDate: dateFormat_YY_MM_DD(transaction.switchDate) || "",
      transaction: `Switch To (${transaction.toAccount})`,
      amount: transaction.amount,
      runningBalance: transaction.amount,
      sortTime: new Date(transaction.executionTime || 0).toUTCString(),
      pBalance: transaction?.toPBalance || 0,
    });
  });

  acccountSwitchesTo.forEach((transaction) => {
    combinedData.push({
      id: transaction.id,
      entityId: getEntityId(store, transaction.toAccount),
      valueDate: dateFormat_YY_MM_DD(transaction.switchDate) || "",
      transactionDate: dateFormat_YY_MM_DD(transaction.switchDate) || "",
      transaction: `Switch From (${transaction.fromAccount})`,
      amount: transaction.amount,
      runningBalance: transaction.amount,
      sortTime: new Date(transaction.executionTime || 0).toUTCString(),
      pBalance: transaction?.fromPBalance || 0,
    });
  });
  cancelledTransaction.forEach((transaction) => {
    combinedData.push({
      id: transaction.asJson.id,
      entityId: getEntityId(store, transaction.asJson.entity),
      valueDate: dateFormat_YY_MM_DD(transaction.asJson.transactionDate) || "",
      transactionDate:
        dateFormat_YY_MM_DD(transaction.asJson.transactionDate) || "",
      transaction: `Cancelled`,
      amount: transaction.asJson.amount,
      runningBalance: transaction.asJson.amount,
      sortTime: new Date(transaction.asJson.executionTime || 0).toUTCString(),
      pBalance: transaction?.asJson.previousBalance || 0,
    });
  });

  const customSort = (a: Transaction, b: Transaction): number => {
    const dateA = new Date(a.sortTime);
    const dateB = new Date(b.sortTime);

    if (dateA > dateB) {
      return 1;
    } else if (dateA < dateB) {
      return -1;
    } else {
      return 0;
    }
  };

  const sortedData = combinedData.sort(customSort);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        await Promise.all([
          api.mma.getById(accountId || ""),
          api.clientDepositAllocation.getAll(),
          api.cancelledWithdrawals.getAll(),
          api.clientWithdrawalPayment.getAll(),
          api.switch.getAll(),
        ]);
        setLoading(false);
      } catch (error) {}
      setLoading(false);
    };
    loadAll();
  }, [
    accountId,
    api.cancelledWithdrawals,
    api.clientDepositAllocation,
    api.clientWithdrawalPayment,
    api.mma,
    api.switch,
  ]);

  const hasMoneyMarketAccountManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Money Market Account Management" &&
      feature.create === true
  );

  //stanza (mui)
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(emails[1]);

  const [tablesData, setTablesData] = useState<any[]>([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  const clients = [...store.client.naturalPerson.all];

  const getClient = (parentEntityId: string) => {
    const client = clients.find(
      (client) => client.asJson.entityId === parentEntityId
    );
    return client;
  };

  const handleExport = useCallback(() => {
    if (account) {
      const client = getClient(account.asJson.parentEntity)?.asJson;
      const data = [
        {
          heading: client?.entityDisplayName,
          summary: [client?.entityId],
          openingBalance: 0,
          closingBalance: account.asJson.balance,
          data: transactionExport,
        },
      ];
      setTablesData(data);
    }
  }, [account, getClient]);

  const transactionExport = combinedData.map((item) => ({
    transactionDate: item.transactionDate,
    valueDate: item.valueDate,
    transaction: item.transaction,
    amount: item.amount,
    runningBalance: item.runningBalance,
    pBalance: item.pBalance,
  }));

  const personName = getPersonNameMMA(
    account?.asJson.parentEntity || "",
    store
  );

  const accType = getAccountType(account?.asJson.accountType || "", store);

  const totalMonthlyInterest = account?.asJson.monthTotalInterest;

  return (
    <>
      {account && (
        <div className="page uk-section uk-section-small">
          {loading ? (
            <LoadingEllipsis />
          ) : (
            <div className="uk-container uk-container-expand">
              <div className="sticky-top">
                <Toolbar
                  title={`Money Market Account: ${account.asJson.accountNumber}`}
                  rightControls={
                    <div className="">
                      <button
                        className="btn btn-primary"
                        onClick={handleExport}
                      >
                        {tablesData.length === 0 && "Prepare Statement"}
                        {tablesData.length > 0 && (
                          <PDFDownloadLink
                            className="btn btn-success uk-margin-small-left"
                            document={
                              <MoneyMarketStatement
                                tablesData={tablesData}
                                mainHeading={"Account Statement"}
                                exportTimestamp={Date.now()}
                              />
                            }
                            fileName={`${
                              getClient(account.asJson.parentEntity)?.asJson
                                .entityDisplayName || ""
                            }Client Statement.pdf`}
                          >
                            {({ blob, url, loading, error }) =>
                              loading
                                ? "Loading document..."
                                : "Download Statement"
                            }
                          </PDFDownloadLink>
                        )}
                      </button>
                      {hasMoneyMarketAccountManagementPermission && (
                        <>
                          {/* <button className="btn btn-text">Edit</button> */}
                          {account.asJson.status === "Active" && (
                            <button
                              className="btn btn-primary"
                              onClick={handleClickOpen}
                            >
                              More <FontAwesomeIcon icon={faCircleDot} />
                            </button>
                          )}
                          {account.asJson.status === "Closed" && (
                            <IconButton data-uk-tooltip="Account Closed">
                              <DoNotDisturbIcon style={{ color: "red" }} />
                            </IconButton>
                          )}
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => onNavigate("/c/accounts")}
                          >
                            <FontAwesomeIcon icon={faArrowLeftLong} /> Back to
                            Accounts
                          </button>
                        </>
                      )}
                    </div>
                  }
                />
                <hr />
              </div>

              <div className="page-main-card uk-card uk-card-default uk-card-body mma-view">
                <div className="uk-grid uk-grid-small">
                  <div className="uk-width-expand">
                    <div
                      className="uk-grid uk-grid-small uk-child-width-1-1 uk-margin-left"
                      data-uk-grid
                    >
                      <div className="view-modal">
                        <h4 className="main-title-small">Account Overview</h4>
                        <Box sx={{ flexGrow: 1 }}>
                          <Grid container spacing={2}>
                            <Grid xs={6}>
                              <div
                                className="uk-grid uk-grid-medium uk-child-width-1-1 uk-padding-small"
                                data-uk-grid
                              >
                                <div className="">
                                  <span>Balance</span>
                                  <h4 className="amount uk-margin-remove">
                                    {currencyFormat(account.asJson.balance)}
                                  </h4>
                                </div>
                                <div className="">
                                  <span>Cession</span>
                                  <h4 className="amount uk-margin-remove">
                                    {currencyFormat(account.asJson.cession)}
                                  </h4>
                                </div>
                                <div>
                                  <span>Available Balance</span>
                                  <h4 className="amount uk-margin-remove">
                                    {currencyFormat(
                                      account.asJson.balance -
                                        account.asJson.cession
                                    )}
                                  </h4>
                                </div>
                              </div>
                            </Grid>
                            <Grid xs={6}>
                              {" "}
                              <div
                                className="uk-grid uk-grid-medium uk-child-width-1-1 uk-padding-small"
                                data-uk-grid
                              >
                                <div className="">
                                  <span>Base Rate</span>
                                  <h4 className="amount uk-margin-remove">
                                    {account.asJson.baseRate}
                                  </h4>
                                </div>
                                <div className="">
                                  <span>Fee Rate</span>
                                  <h4 className="amount uk-margin-remove">
                                    {account.asJson.feeRate}
                                  </h4>
                                </div>
                                <div>
                                  <span>Client Rate</span>
                                  <h4 className="amount uk-margin-remove">
                                    {account.asJson.baseRate -
                                      account.asJson.feeRate}
                                  </h4>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </Box>
                      </div>

                      <div className="view-modal">
                        <h4 className="main-title-small">Account Details</h4>
                        <div className="uk-grid uk-grid-small uk-padding-small">
                          <div className="uk-width-1-2">
                            <p className="uk-text-bold">Account Number:</p>
                          </div>
                          <div className="uk-width-1-2">
                            <p>{account.asJson.accountNumber}</p>
                          </div>
                          <hr className="uk-width-1-1" />
                          <div className="uk-width-1-2">
                            <p className="uk-text-bold">Account Name:</p>
                          </div>
                          <div className="uk-width-1-2">
                            <p>{account.asJson.accountName}</p>
                          </div>
                          <hr className="uk-width-1-1" />
                          <div className="uk-width-1-2">
                            <p className="uk-text-bold">Account Type:</p>
                          </div>
                          <div className="uk-width-1-2">
                            <p>
                              {getAccountType(
                                account.asJson.accountType,
                                store
                              )}
                            </p>
                          </div>
                          <hr className="uk-width-1-1" />
                          <div className="uk-width-1-2">
                            <p className="uk-text-bold">
                              Client Entity Number:
                            </p>
                          </div>
                          <div className="uk-width-1-2">
                            <p>{account.asJson.parentEntity}</p>
                          </div>
                          <hr className="uk-width-1-1" />
                          <div className="uk-width-1-2">
                            <p className="uk-text-bold">Client Name:</p>
                          </div>
                          <div className="uk-width-1-2">
                            <p>{personName}</p>
                          </div>
                          <hr className="uk-width-1-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-2-3">
                    <Toolbar
                      rightControls={
                        <ViewClientMoneyMarketAccountTabs
                          selectedTab={selectedTab}
                          setSelectedTab={setSelectedTab}
                        />
                      }
                    />
                    <div className="uk-margin-top">
                      {selectedTab === "transactions-tab" && (
                        <div>
                          <AccountTransactionsGrid
                            data={sortedData}
                            amount={account.asJson.balance}
                          />
                        </div>
                      )}
                      {selectedTab === "interest-tab" && (
                        <InterestDataTable account={account.asJson} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <div>
        <SimpleDialog
          selectedValue={selectedValue}
          open={open}
          onClose={handleClose}
        />
      </div>
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.CLOSE_MM_ACCOUNT}>
        <CloseMoneyMarketAccountModal
          balance={account?.asJson.balance || 0}
          cession={account?.asJson.cession || 0}
          availableBalance={
            (account?.asJson.balance || 0) - (account?.asJson.cession || 0)
          }
          baseRate={account?.asJson.baseRate || 0}
          feeRate={account?.asJson.feeRate || 0}
          clientRate={
            (account?.asJson.baseRate || 0) - (account?.asJson.feeRate || 0)
          }
          accountNumber={account?.asJson.accountNumber || ""}
          accountName={account?.asJson.accountName || ""}
          accountType={accType || ""}
          entity={account?.asJson.parentEntity || ""}
          clientName={personName || ""}
          monthlyInterest={totalMonthlyInterest || 0}
        />
      </Modal>
    </>
  );
});

export default ViewClientMoneyMarketAccount;

const emails = ["username@gmail.com", "user02@gmail.com"];

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const openCloseAccountDialog = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.CLOSE_MM_ACCOUNT);
    handleClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>More....</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton autoFocus onClick={openCloseAccountDialog}>
            <HighlightOffIcon style={{ fontSize: "25px", color: "grey" }} />{" "}
            <ListItemText style={{ color: "grey" }} primary="CLOSE ACCOUNT" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

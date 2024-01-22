import React, { useState } from "react";
import Card from "../../components/Cards/dashboard-card/DashboardCard";
import NewUsers from "../../components/download-statement-card/DownloadStatement";
import Table from "../../components/table/Table";
import DashboardCard from "../../components/Cards/dashboard-card/DashboardCard";
import BalanceCard from "../../components/Cards/balance-card/BalanceCard";
import MODAL_NAMES from "../../dialogs/ModalName";
import Modal from "../../../shared/components/Modal";
import showModalFromId from "../../../shared/functions/ModalShow";
import WithdrawalModal from "../../dialogs/transactions/client-withdrawal-payment/WithdrawalModal";

function Withdraw() {
  const recordWithdraw = () => {
    showModalFromId(MODAL_NAMES.WITHDRAWAL_MODAL);
  };

  const recordDeposit = () => {
    showModalFromId(MODAL_NAMES.DEPOSIT_MODAL);
  };

  return (
    <>
      <h1>Withdrawal</h1>
      <div className="analyse">
        <DashboardCard
          title="I want to withdraw"
          buttonLabel="Record Withdraw"
          onClickButton={recordWithdraw}
        />
        <DashboardCard
          title="Perform Transfers Within Accounts"
          buttonLabel="Transfer"
          onClickButton={recordDeposit}
        />

        <BalanceCard title="Account Balance" amount="$5000.00" />
      </div>
      <div>
        <Table
          heading="Recent Withdraw"
          showRecentTransactions={true}
          columns={["Date", "Transaction Type", "Amount", "Status"]}
          data={[
            {
              Date: "1 November 2023",
              "Transaction Type": "Deposit",
              Amount: "$5000",
              Status: "Pending",
            },
            {
              Date: "6 November 2023",
              "Transaction Type": "Deposit",
              Amount: "$1500",
              Status: "Pending",
            },
            {
              Date: "1 December 2023",
              "Transaction Type": "Deposit",
              Amount: "$2000",
              Status: "Approved",
            },
          ]}
        />
      </div>
      <NewUsers title="Download Statement" />
      <Modal modalId={MODAL_NAMES.WITHDRAWAL_MODAL}>
        <WithdrawalModal />
      </Modal>
    </>
  );
}

export default Withdraw;

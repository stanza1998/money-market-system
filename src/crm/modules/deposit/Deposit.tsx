import React, { useState } from "react";
import Table from "../../components/table/Table";
import DashboardCard from "../../components/Cards/dashboard-card/DashboardCard";
import BalanceCard from "../../components/Cards/balance-card/BalanceCard";
import MODAL_NAMES from "../../dialogs/ModalName";
import DepositModal from "../../dialogs/transactions/client-deposit-allocation/DepositModal";
import Modal from "../../../shared/components/Modal";
import showModalFromId from "../../../shared/functions/ModalShow";

import DownloadStatement from "../../components/download-statement-card/DownloadStatement";

function Deposit() {
  const recordDeposit = () => {
    showModalFromId(MODAL_NAMES.DEPOSIT_MODAL);
  };

  const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
  const [selectedAccount, setSelectedAccount] = useState<string>("moneyMarket");

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };

  const handleDownloadClick = () => {
    // Implement your download logic here using selectedPeriod and selectedAccount
    console.log("Download button clicked!");
  };

  return (
    <>
      <h1>Deposit</h1>
      <div className="analyse">
        <DashboardCard
          title="I want to Deposit"
          buttonLabel="Record Deposit"
          onClickButton={recordDeposit}
        />{" "}
        <DashboardCard
          title="Perform Transfers Within Accounts"
          buttonLabel="Transfer"
          onClickButton={recordDeposit}
        />
        {/* <DashboardCard title="" buttonLabel="Deposit" /> */}
        <BalanceCard title="Account Balance" amount="$5000.00" />
      </div>

      <div>
        <Table
          heading="Recent Deposits"
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
        <DownloadStatement title="Download Statement" />
      </div>
      <Modal modalId={MODAL_NAMES.DEPOSIT_MODAL}>
        <DepositModal />
      </Modal>
    </>
  );
}

export default Deposit;

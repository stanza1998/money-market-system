import React, { useState } from "react";
import Table from "../../components/table/Table";
import BalanceCard from "../../components/Cards/balance-card/BalanceCard";
import DashboardCard from "../../components/Cards/dashboard-card/DashboardCard";
import Modal from "../../../shared/components/Modal";
import MODAL_NAMES from "../../dialogs/ModalName";
import WithdrawalModal from "../../dialogs/transactions/client-withdrawal-payment/WithdrawalModal";
import DepositModal from "../../dialogs/transactions/client-deposit-allocation/DepositModal";
import showModalFromId from "../../../shared/functions/ModalShow";
import DownloadStatement from "../../components/download-statement-card/DownloadStatement";
import "./CrmDashboard.scss";

function CrmDashboard() {
  const recordDeposit = () => {
    showModalFromId(MODAL_NAMES.DEPOSIT_MODAL);
  };
  const recordWithdraw = () => {
    showModalFromId(MODAL_NAMES.WITHDRAWAL_MODAL);
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
      <div className="info">
        <h1>Dashboard</h1>
      </div>

      <div className="analyse">
        <DashboardCard
          title="I want to Deposit"
          buttonLabel="Record Deposit"
          onClickButton={recordDeposit}
        />
        <BalanceCard title="Account Balance" amount="N$5000.00" />
        <DashboardCard
          title="I want to withdraw"
          buttonLabel="Record Withdraw"
          onClickButton={recordWithdraw}
        />
      </div>

      <div>
        <Table
          heading="Recent Transactions"
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
              "Transaction Type": "Withdrawal",
              Amount: "$2000",
              Status: "Approved",
            },
          ]}
        />
      </div>

      <DownloadStatement title="Download Statement" />
      <Modal modalId={MODAL_NAMES.DEPOSIT_MODAL}>
        <DepositModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.WITHDRAWAL_MODAL}>
        <WithdrawalModal />
      </Modal>
    </>
  );
}

export default CrmDashboard;
//Plan

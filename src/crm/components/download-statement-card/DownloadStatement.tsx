import React, { useState } from "react";
import "./DownloadStatement.scss";

interface NewUsersProps {
  title: string;
}

const DownloadStatement: React.FC<NewUsersProps> = ({ title }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedAccount, setSelectedAccount] = useState("savings");

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  const handleAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAccount(event.target.value);
  };

  const handleDownloadClick = () => {
    // Handle download click logic
    console.log("Downloading statement...");
  };

  return (
    <div className="new-users">
      <div className="info">
        {" "}
        <h2>{title}</h2>
      </div>
      <div className="user-list">
        <div className="dropdowns">
          {/* Dropdown for selecting bank account */}
          <div className="dropdown">
            <label htmlFor="accountDropdown">Select Account:</label>
            <select
              id="accountDropdown"
              value={selectedAccount}
              onChange={handleAccountChange}>
              <option value="moneyMarket">Money Market</option>
              <option value="savings">Savings</option>
              {/* Add more account options as needed */}
            </select>
          </div>
          {/* Dropdown for selecting duration period */}
          <div className="dropdown">
            <label htmlFor="periodDropdown">Select Period:</label>
            <select
              id="periodDropdown"
              value={selectedPeriod}
              onChange={handlePeriodChange}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Download button */}
        <div className="info">
          <button className="custom-button" onClick={handleDownloadClick}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadStatement;

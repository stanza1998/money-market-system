// BalanceCard.tsx
import React from "react";
// import "./BalanceCard.scss";

interface CardProps {
  title: string;
  amount: string; // Add a new prop for the amount
}

const BalanceCard: React.FC<CardProps> = ({ title, amount }) => {
  return (
    <div className="balance-card">
      <div className="status">
        <div className="info">
          <h3>{title}</h3>
          <p>{amount}</p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;

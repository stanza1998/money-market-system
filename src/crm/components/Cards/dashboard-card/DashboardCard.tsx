// Card.tsx
import React from "react";
import "./Card.scss";

interface CardProps {
  title: string;
  buttonLabel: string;
  onClickButton?: () => void; // Define the type for the click event handler
}

const DashboardCard: React.FC<CardProps> = ({
  title,
  buttonLabel,
  onClickButton,
}) => {
  const handleButtonClick = () => {
    // Call the provided click event handler, if any
    if (onClickButton) {
      onClickButton();
    }
  };

  return (
    <div className="card">
      <div className="status">
        <div className="info">
          <h3>{title}</h3>
        </div>
      
      </div>
      <div className="button-container">
        <button className="custom-button" onClick={handleButtonClick}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default DashboardCard;

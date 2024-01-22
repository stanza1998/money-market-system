import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  totalItems: number;
  completedItems: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ totalItems, completedItems }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      if (totalItems > 0) {
        const percentage = (completedItems / totalItems) * 100;
        setProgress(percentage);
      }
    };

    calculateProgress();
  }, [totalItems, completedItems]);

  return (
    <div className="progress-bar">
      <div className="progress-bar__progress" style={{ width: `${progress}%` }}></div>
      <div className="progress-bar__text">
        {completedItems} / {totalItems} items completed
      </div>
    </div>
  );
};

export default ProgressBar;
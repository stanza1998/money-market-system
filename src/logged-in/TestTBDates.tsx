import React, { useState } from "react";

interface TestDatesProps {}

const TestDates: React.FC<TestDatesProps> = () => {
  const [inputCode, setInputCode] = useState<string>("");
  const [outputCode, setOutputCode] = useState<string>("");

  const formatDate = (inputCode: string): string => {
    // Check if the input code starts with "GT"
    if (!inputCode.startsWith("GT")) {
      return "Invalid input code. It should start with 'GT'.";
    }

    // Extract the relevant parts from the input code
    const [, daysToMaturity, settlementDateStr, maturityDateStr] =
      inputCode.match(/^GT(\d+)(\/\d{2}[A-Za-z]{3}\d{2})-(\d{2}[A-Za-z]{3}\d{2})$/) || [];

    if (!daysToMaturity || !settlementDateStr || !maturityDateStr) {
      return "Invalid input code.";
    }

    // Parse the days to maturity as a number
    const daysToMaturityNum = parseInt(daysToMaturity, 10);

    // Parse the settlement and maturity dates using the 'Date' object
    const settlementDate = new Date(settlementDateStr);
    const maturityDate = new Date(maturityDateStr);

    // Add the days to maturity to the maturity date
    maturityDate.setDate(maturityDate.getDate() + daysToMaturityNum);

    // Custom date formatting function
    const formatDateToString = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear().toString().slice(-2);
      return `${day}${month}${year}`;
    };

    // Format the dates to match the desired output format
    const formattedSettlementDate = formatDateToString(settlementDate);
    const formattedMaturityDate = formatDateToString(maturityDate);

    // Combine the parts to create the final output
    const outputCode = `GT${daysToMaturity}/${maturityDateStr}-${formattedMaturityDate}`;

    return outputCode;
  };

  const handleConvert = () => {
    const convertedCode = formatDate(inputCode);
    setOutputCode(convertedCode);
  };

  return (
    <div>
      <h1>Code Converter</h1>
      <div>
        <label>Enter Code:</label>
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleConvert}>Convert</button>
      </div>
      <div>
        <p>Converted Code:</p>
        <p>{outputCode}</p>
      </div>
    </div>
  );
};

export default TestDates;

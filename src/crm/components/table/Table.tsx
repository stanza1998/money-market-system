// Table.tsx
import React from "react";
import "./Table.scss";

interface TableProps {
  heading: string;
  showRecentTransactions: boolean;
  columns: string[];
  data: Array<{
    [key: string]: string;
  }>;
}

function Table(props: TableProps) {
  return (
    <div className="recent-orders">
      <div className="info">
        {" "}
        <h2>{props.heading}</h2>
      </div>

      <table>
        <thead className="new-class">
          <tr>
            {props.columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.map((item, index) => (
            <tr key={index}>
              {props.columns.map((column, columnIndex) => (
                <td key={columnIndex}>{item[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {props.showRecentTransactions && <a href="#">Show All</a>}
    </div>
  );
}

export default Table;

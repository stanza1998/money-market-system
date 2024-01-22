import { Row } from "../../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useNavigate } from "react-router-dom";

interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
}

export const TableBody = observer(
  ({
    rows,
    length,
    isFiltered,

  }: TableBodyProps) => {
    const hasNoData = rows.length === 0 && !isFiltered;
    const hasNoFilteredData = rows.length === 0 && isFiltered;
    const { store } = useAppContext();

    const onNavigate = useNavigate();

    const onContinue = (instrumentId: string) => {
      const selectedInstrument =
        store.instruments.treasuryBill.getItemById(instrumentId);
        console.log(selectedInstrument);
        
      if (selectedInstrument) {
        store.instruments.treasuryBill.select(selectedInstrument.asJson);
        onNavigate(`/c/purchases/submitted/${selectedInstrument.asJson.id}`);
      }
    };

    const onTender = (instrumentId: string) => {
      const selectedInstrument =
        store.instruments.treasuryBill.getItemById(instrumentId);

      if (selectedInstrument) {
        store.instruments.treasuryBill.select(selectedInstrument.asJson);
        onNavigate(`/c/purchases/allocation/${selectedInstrument.asJson.id}`);
      }
    };

    const hasAllocations = (instrumentId: string) => {
      const selectedInstrument =
        store.instruments.treasuryBill.getItemById(instrumentId);

      if (selectedInstrument) {
        if (selectedInstrument.asJson.instrumentStatus === "allocated" || selectedInstrument.asJson.instrumentStatus === "tendered") {
          return true
        }
        return false
      }
    };

    const canTender = (instrumentId: string) => {
      const selectedInstrument =
        store.instruments.treasuryBill.getItemById(instrumentId);
      const today = Date.now();
      if (selectedInstrument) {
        if (selectedInstrument.asJson.maturityDate) {
          const difference = selectedInstrument?.asJson.maturityDate - today;
          const millisecondsPerDay = 24 * 60 * 60 * 1000;
          const dtm = Math.floor(difference / millisecondsPerDay);

          if (dtm >= 0 && dtm <= 14) {
            return true;
          } else {
            return false;
          }
        }
      }
    };

    return (
      <tbody>
        {hasNoData && (
          <tr>
            <td colSpan={length} className="empty">
              No data available in table
            </td>
          </tr>
        )}
        {hasNoFilteredData && (
          <tr>
            <td colSpan={length} className="empty">
              No matching records found
            </td>
          </tr>
        )}
        {rows.map(({ data, key }) => (
          <tr className="custom-table-row" key={key}>
            {data.map(({ cellValue, key, isSorted }) => (
              <td key={key} className={isSorted ? "sorted" : ""}>
                {cellValue as string}
              </td>
            ))}
            <td className="uk-text-right">
              {canTender(key) && (
                <button
                  style={{ width: "50%", textAlign: "center" }}
                  className="btn btn-primary uk-margin-small-left"
                  onClick={() => onTender(key)}>
                  Tender
                </button>
              )}
              {hasAllocations(key) && (
                <button
                  style={{ width: "50%", textAlign: "center" }}
                  className="btn btn-primary uk-margin-small-left"
                  onClick={() => onContinue(key)}>
                  Continue
                </button>
              )}
              {!hasAllocations(key) && (
                <button
                  style={{ width: "50%", textAlign: "center" }}
                  className="btn btn-primary uk-margin-small-left"
                  onClick={() => onTender(key)}>
                  Tender
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    );
  }
);

import { Row } from "../../../../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../../../shared/functions/Context";
import showModalFromId from "../../../../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../../../../dialogs/ModalName";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  setSelectedInstrument: Dispatch<SetStateAction<string>>;
  setSelectedInstrumentType: Dispatch<SetStateAction<string>>;
}

export const TableBody = observer(
  ({
    rows,
    length,
    isFiltered,
    setSelectedTab,
    setSelectedInstrument,
    setSelectedInstrumentType,
  }: TableBodyProps) => {
    const hasNoData = rows.length === 0 && !isFiltered;
    const hasNoFilteredData = rows.length === 0 && isFiltered;
    const { api, store } = useAppContext();

    const onNavigate = useNavigate();

    const onViewMore = (clientId: string) => {
      const selectedclient = store.client.naturalPerson.getItemById(clientId);

      if (selectedclient) {
        store.client.naturalPerson.select(selectedclient.asJson);
        showModalFromId(MODAL_NAMES.ADMIN.VIEW_NATURAL_PERSON_MODAL);
      }
    };

    const onViewHoldings = (instrumentId: string) => {
      const selectedInstrument =
        store.purchase.treasuryBillAllocation.getItemById(instrumentId);
      if (selectedInstrument) {
        store.purchase.treasuryBillAllocation.select(selectedInstrument.asJson);
        showModalFromId(MODAL_NAMES.ADMIN.TREASURY_BILL_HOLDINGS_MODAL);
      }
    };

    const onContinue = (instrumentId: string) => {
      const selectedInstrument =
        store.purchase.treasuryBill.getItemById(instrumentId);
      if (selectedInstrument) {
        store.purchase.treasuryBill.select(selectedInstrument.asJson);
        onNavigate(`/c/purchases/submitted/${selectedInstrument.asJson.id}`);

        // c/purchases/submitted/:id
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

    const hasHoldings = (instrumentId: string) => {
      const selectedInstrument =
        store.instruments.treasuryBill.getItemById(instrumentId);
      if (selectedInstrument) {
        if (selectedInstrument.asJson.maturityDate) {
          if (
            selectedInstrument.asJson.instrumentStatus !== "pending" &&
            selectedInstrument.asJson.instrumentStatus !== "approved"
          ) {
            return true;
          } else {
            return false;
          }
        }
      }
    };

    const hasAllocations = (instrumentId: string) => {
      const selectedInstrument =
        store.instruments.treasuryBill.getItemById(instrumentId);

      if (selectedInstrument) {
        if (selectedInstrument.asJson.instrumentStatus === "allocated") {
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

    const canPurchase = (instrumentId: string) => {
      const selectedInstrument =
        store.instruments.treasuryBill.getItemById(instrumentId);
      const today = Date.now();
      if (selectedInstrument) {
        if (selectedInstrument.asJson.maturityDate) {
          const difference = selectedInstrument?.asJson.maturityDate - today;
          const millisecondsPerDay = 24 * 60 * 60 * 1000;
          const dtm = Math.floor(difference / millisecondsPerDay);

          if (
            dtm > 5 &&
            selectedInstrument.asJson.instrumentStatus === "purchased"
          ) {
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
                  className="btn btn-primary uk-margin-small-left"
                  onClick={() => onTender(key)}
                >
                  Tender
                </button>
              )}
              {hasAllocations(key) && (
                <button
                  className="btn btn-primary uk-margin-small-left"
                  onClick={() => onContinue(key)}
                >
                  Continue
                </button>
              )}
              {!hasAllocations(key) && (
                <button
                  className="btn btn-primary uk-margin-small-left"
                  onClick={() => onTender(key)}
                >
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

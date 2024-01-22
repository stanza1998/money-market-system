// react
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

// state management
import { observer } from "mobx-react-lite";

// custom hooks
import { useAppContext } from "../../../../../../shared/functions/Context";

// DataTable components
import { DataTable } from "./DataTable";
import { Column } from "../../../../../../shared/components/react-ts-datatable/DataTableTypes";

import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ErrorBoundary from "../../../../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../../../../shared/components/loading/Loading";
import { useExcelLikeFilters } from "../../../../../../shared/functions/AdvancedFilter";
import { currencyFormat } from "../../../../../../shared/functions/Directives";
import { dateFormat_YY_MM_DD_NEW } from "../../../../../../shared/utils/utils";
import MODAL_NAMES from "../../../../../dialogs/ModalName";
import Toolbar from "../../../../../shared/toolbar/Toolbar";
import Modal from "../../../../../../shared/components/Modal";
import AllocateTransactionModal from "../../../../../dialogs/transactions/client-deposit-allocation/AllocateTransactionModal";

interface IClientDepositAllocationData {
  index: number;
  reference: string;
  description: string;
  amountDisplay: string;
  transactionDate: string;
  valueDate: string;
}

interface IProps {
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

const columns: Column[] = [
  { id: "index", displayText: "#", sortMethod: "sortNumber" },
  { id: "transactionDate", displayText: "Transaction Date" },
  { id: "valueDate", displayText: "Value Date" },
  { id: "description", displayText: "Description" },
  { id: "reference", displayText: "Reference" },
  { id: "amountDisplay", displayText: "Amount" },
];

const UnAllocatedTransactions = observer((props: IProps) => {
  const { api, store } = useAppContext();

  const { setSelectedTab } = props;
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } =
    useExcelLikeFilters();

  const unAllocated = store.clientDepositAllocation.all.filter(
    (unAllocated) => unAllocated.asJson.allocationStatus === "un-allocated"
  );

  const allocations: IClientDepositAllocationData[] = unAllocated.map(
    (transaction, index) => ({
      index: index + 1,
      key: transaction.asJson.id,
      reference: transaction.asJson.reference,
      description: transaction.asJson.description,
      amountDisplay: currencyFormat(transaction.asJson.amount),
      transactionDate: dateFormat_YY_MM_DD_NEW(
        transaction.asJson.transactionDate
      ),
      valueDate: dateFormat_YY_MM_DD_NEW(transaction.asJson.valueDate),
      transactionStatus: transaction.asJson.transactionStatus,
    })
  );

  const unAllocatedTransactionsFiltered = allocations.filter((allocation) => {
    let filtered = true;
    if (
      filters.stringValueA &&
      !allocation.description
        .toLowerCase()
        .includes(filters.stringValueA.toLowerCase())
    ) {
      filtered = false;
    }
    return filtered;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.clientDepositAllocation.getAll();
        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.clientDepositAllocation]);

  if (loading) return <LoadingEllipsis />;

  return (
    <ErrorBoundary>
      <div className="uk-section uk-section-small">
        <div className="uk-container uk-container-expand">
          {/** Toolbar starts here */}
          <div
            className="uk-grid uk-grid-small uk-child-width-1-1"
            data-uk-grid
          >
            <Toolbar
              rightControls={
                <div className="filter">
                  <div className="uk-flex">
                    <button
                      className="btn btn-text btn-small"
                      type="button"
                      data-uk-toggle="target: #offcanvas-flip"
                    >
                      Filter <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>{" "}
                    </button>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={handleClearFilters}
                    >
                      Clear
                    </button>
                  </div>
                  <div
                    id="offcanvas-flip"
                    data-uk-offcanvas="flip: true; overlay: true"
                  >
                    <div className="uk-offcanvas-bar">
                      <button
                        className="uk-offcanvas-close"
                        type="button"
                        data-uk-close
                      ></button>
                      <h3 className="main-title-small">Filter</h3>
                      <hr />
                      <div className="uk-grid uk-grid-small" data-uk-grid>
                        <div className="uk-width-large">
                          <div className="uk-grid" data-uk-grid>
                            <div className="uk-width-1-1">
                              <label htmlFor="">Instrument Status</label>
                              <select
                                className="uk-select uk-form-small"
                                onChange={(e) =>
                                  handleFilterChange(
                                    "stringValueA",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">All</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Verified</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="uk-divider-horizontal uk-margin-left" />
                      <button
                        className="btn btn-small btn-danger uk-margin-top"
                        onClick={handleClearFilters}
                      >
                        Clear filters
                      </button>
                    </div>
                  </div>
                </div>
              }
              leftControls={
                <div>
                  <h4 className="main-title-lg">Un-Allocated Transactions</h4>
                </div>
              }
            />
          </div>
          {/** Toolbar ends here */}
          {/** DataTable starts here */}
          <div
            className="uk-grid uk-grid-small uk-child-width-1-1"
            data-uk-grid
          >
            {unAllocatedTransactionsFiltered && (
              <DataTable
                columns={columns}
                data={unAllocatedTransactionsFiltered}
              />
            )}
          </div>
          {/** DataTable ends here */}
        </div>
      </div>
      <Modal
        modalId={
          MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.ALLOCATE_TRANSACTION_MODAL
        }
      >
        <AllocateTransactionModal setSelectedTab={setSelectedTab} />
      </Modal>
    </ErrorBoundary>
  );
});

export default UnAllocatedTransactions;

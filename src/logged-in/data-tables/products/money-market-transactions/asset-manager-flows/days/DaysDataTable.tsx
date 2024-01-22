// react
import React, { useState, useEffect } from "react";

// state management
import { observer } from "mobx-react-lite";

// custom hooks
import { useAppContext } from '../../../../../../shared/functions/Context';

// DataTable components
import { DataTable } from './DataTable';
import { Column } from '../../../../../../shared/components/react-ts-datatable/DataTableTypes';

import { useExcelLikeFilters } from '../../../../../../shared/functions/AdvancedFilter';
import { dateFormat_YY_MM_DD } from '../../../../../../shared/utils/utils';

import MODAL_NAMES from "../../../../../dialogs/ModalName";
import { LoadingEllipsis } from '../../../../../../shared/components/loading/Loading';
import ErrorBoundary from "../../../../../../shared/components/error-boundary/ErrorBoundary";
import Toolbar from "../../../../../shared/toolbar/Toolbar";
import Modal from '../../../../../../shared/components/Modal';
import EditTransactionModal from '../../../../../dialogs/transactions/client-deposit-allocation/EditTransactionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

interface IAssetManagerFlowDaysData {
  index: number;
  flowDate: string;
}

const columns: Column[] = [
  { id: "index", displayText: "#", sortMethod: "sortNumber" },
  { id: "flowDate", displayText: "Clients" },
  { id: "opengingAssets", displayText: "Opening Balance" },
  { id: "closingAssets", displayText: "Netflows" },
  { id: "opengingLiabilities", displayText: "Deposit Amount" },
  { id: "opengingLiabilities", displayText: "Number of Units" },
  { id: "opengingLiabilities", displayText: "Withdrawal Amount" },
  { id: "opengingLiabilities", displayText: "Number of Units" },
  { id: "closingLiabilities", displayText: "Closing Balance" },
];

const DaysDataTable = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } =
    useExcelLikeFilters();

  const flowDays = store.assetManager.liability.all;

  const days: IAssetManagerFlowDaysData[] = flowDays.map((transaction, index) => ({
    index: index + 1,
    flowDate: dateFormat_YY_MM_DD(transaction.asJson.productId),

  }));

  const flowDaysTransactionsFiltered = days.filter((allocation) => {
    let filtered = true;
    if (
      filters.stringValueA &&
      !allocation.flowDate
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
        await api.assetManager.liability.getAll();
      } catch (error) { }
      setLoading(false);
    };
    loadData();
  }, [api.assetManager.liability]);

  if (loading) return (
    <LoadingEllipsis />
  )

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
                          {/* <div className="uk-grid" data-uk-grid>
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
                                <option value="approved">Approved</option>
                              </select>
                            </div>
                          </div> */}
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
            />
          </div>
          {/** Toolbar ends here */}
          {/** DataTable starts here */}
          <div
            className="uk-grid uk-grid-small uk-child-width-1-1"
            data-uk-grid
          >
            {flowDaysTransactionsFiltered && (
              <DataTable
                columns={columns}
                data={flowDaysTransactionsFiltered}
              />
            )}
          </div>
          {/** DataTable ends here */}
        </div>
      </div>
    </ErrorBoundary>
  );
});

export default DaysDataTable;

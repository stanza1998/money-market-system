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

import { currencyFormat } from '../../../../../../shared/functions/Directives';
import { dateFormat_YY_MM_DD_NEW } from '../../../../../../shared/utils/utils';
import { IClientDepositAllocation } from '../../../../../../shared/models/client-deposit-allocation/ClientDepositAllocationModel';
import MODAL_NAMES from "../../../../../dialogs/ModalName";
import { LoadingEllipsis } from '../../../../../../shared/components/loading/Loading';
import ErrorBoundary from "../../../../../../shared/components/error-boundary/ErrorBoundary";
import Toolbar from "../../../../../shared/toolbar/Toolbar";
import Modal from '../../../../../../shared/components/Modal';
import EditTransactionModal from '../../../../../dialogs/transactions/client-deposit-allocation/EditTransactionModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

interface IClientDepositAllocationData {
  index: number;
  reference: string;
  amount: number;
  description: string;
  transactionDate: string;
  valueDate: string;
  allocation: string;
  clientName: string;
  allocatedBy: string;
  allocationApprovedBy: string;
}

const columns: Column[] = [
  { id: "index", displayText: "#", sortMethod: "sortNumber" },
  { id: "transactionDate", displayText: "Transaction Date" },
  { id: "valueDate", displayText: "Value Date" },
  { id: 'description', displayText: 'Description' },
  { id: 'clientName', displayText: 'Client' },
  { id: "allocation", displayText: "Account" },
  { id: "amountDisplay", displayText: "Amount" },
  // { id: "reference", displayText: "Reference" },
  // { id: "allocatedBy", displayText: "Allocated By" },
  // { id: 'allocationApprovedBy', displayText: 'Verified By' },
];


const AllocatedTransactions = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } =
    useExcelLikeFilters();

  const allocated = store.clientDepositAllocation.all.filter(
    (allocated) => allocated.asJson.allocationStatus === "allocated"
  );

  const users = store.user.all;
  const mmAccounts = store.mma.all;

  const clients = [...store.client.naturalPerson.all, ...store.client.legalEntity.all];

  const getClientName = (transaction: IClientDepositAllocation) => {
    const account = mmAccounts.find(
      (account) => account.asJson.accountNumber === transaction.allocation
    );
    if (account) {
      const client = clients.find(
        (client) => client.asJson.entityId === account.asJson.parentEntity
      );
      if (client) {
        const clientName = client.asJson.entityDisplayName;
        return clientName;
      }
    } else {
      return "";
    }
  };

  const getAllocatorName = (transaction: IClientDepositAllocation) => {
    if (users) {
      const allocator = users.find(
        (user) => user.asJson.uid === transaction.allocatedBy
      );
      if (allocator) {
        const allocatorName = allocator.asJson.displayName;
        return allocatorName;
      }
      return "";
    }
    return "";
  };

  const getApproverName = (transaction: IClientDepositAllocation) => {
    if (users) {
      const approver = users.find(
        (user) => user.asJson.uid === transaction.allocationApprovedBy
      );
      if (approver) {
        const approverName = approver.asJson.displayName;
        return approverName;
      }
      return "";
    }
    return "";
  };

  const allocations: IClientDepositAllocationData[] = allocated.map((transaction, index) => ({
    index: index + 1,
    key: transaction.asJson.id,
    reference: transaction.asJson.reference,
    description: transaction.asJson.description,
    amount: transaction.asJson.amount,
    amountDisplay: currencyFormat(transaction.asJson.amount),
    transactionDate: dateFormat_YY_MM_DD_NEW(transaction.asJson.transactionDate),
    valueDate: dateFormat_YY_MM_DD_NEW(transaction.asJson.valueDate),
    allocation: transaction.asJson.allocation,
    clientName: getClientName(transaction.asJson) || "",
    allocatedBy: getAllocatorName(transaction.asJson) || "",
    allocationApprovedBy: getApproverName(transaction.asJson) || "",
  }));

  const allocatedTransactionsFiltered = allocations.filter((allocation) => {
    let filtered = true;
    if (
      filters.stringValueA &&
      !allocation.allocation
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
        await api.client.legalEntity.getAll();
        await api.client.naturalPerson.getAll();
      } catch (error) { }
      setLoading(false);
    };
    loadData();
  }, [
    api.client.naturalPerson,
    api.client.legalEntity,
    api.clientDepositAllocation,
  ]);

  if (loading) return (
    <LoadingEllipsis />
  )

  return (
    <ErrorBoundary>
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
                            <option value="approved">Approved</option>
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
              <h4 className="main-title-lg">Allocated Transactions</h4>
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
        {allocatedTransactionsFiltered && (
          <DataTable
            columns={columns}
            data={allocatedTransactionsFiltered}
          />
        )}
      </div>
      {/** DataTable ends here */}
      <Modal modalId={MODAL_NAMES.ADMIN.BOND_MODAL}>
        {/* <BondModal /> */}
      </Modal>
      <Modal
        modalId={MODAL_NAMES.BACK_OFFICE.TRANSACTIONS.EDIT_TRANSACTION_MODAL}
      >
        <EditTransactionModal />
      </Modal>
    
    </ErrorBoundary>
  );
});

export default AllocatedTransactions;

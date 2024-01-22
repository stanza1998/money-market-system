// react
import { useState, useEffect } from 'react';

// state management
import { observer } from 'mobx-react-lite';

// custom hooks
import { useAppContext } from '../../../../../../shared/functions/Context';

// DataTable components
import { DataTable } from './DataTable';
import { Column } from '../../../../../../shared/components/react-ts-datatable/DataTableTypes';

import ErrorBoundary from '../../../../../../shared/components/error-boundary/ErrorBoundary';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { LoadingEllipsis } from '../../../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../../../shared/functions/AdvancedFilter';
import { IClientWithdrawalPayment } from '../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel';
import { dateFormat_YY_MM_DD } from '../../../../../../shared/utils/utils';
import Toolbar from '../../../../../shared/toolbar/Toolbar';


interface IClientDepositAllocationData {
  index: number;
  reference: string;
  amount: string | number;
  transactionDate: string | number | Date;
  allocation: string;
  allocatedBy: string;
  allocationApprovedBy: string;
  allocationStatus: string;
}

const columns: Column[] = [
  { id: 'index', displayText: '#', sortMethod: 'sortNumber' },
  { id: 'transactionDate', displayText: 'Transaction Date' },
  { id: 'amount', displayText: 'Amount', sortMethod: 'sortNumber' },
  { id: 'reference', displayText: 'Reference' },
  { id: 'allocation', displayText: 'Allocated To' },
  { id: 'allocatedBy', displayText: 'Allocated By' },
  { id: 'allocationApprovedBy', displayText: 'Verified By' },
];

const VerifiedTransactionPayments = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const allocated = store.clientWithdrawalPayment.all.filter(allocated => allocated.asJson.transactionStatus === "verified");

  const users = store.user.all;

  const getAllocatorName = (transaction: IClientWithdrawalPayment) => {
    if (users) {
      const allocator = users.find(user => (user.asJson.uid === transaction.allocatedBy));
      if (allocator) {
        const allocatorName = allocator.asJson.displayName;
        return allocatorName;
      }
      return ""
    }
    return ""
  }

  const getVerifierName = (transaction: IClientWithdrawalPayment) => {
    if (users) {
      const verifier = users.find(user => (user.asJson.uid === transaction.allocationApprovedBy));
      if (verifier) {
        const verifierName = verifier.asJson.displayName;
        return verifierName;
      }
      return ""
    }
    return ""
  }

  const allocations: IClientDepositAllocationData[] = allocated.map((transaction, index) => ({
    index: index + 1,
    key: transaction.asJson.id,
    reference: transaction.asJson.reference,
    amount: transaction.asJson.amount,
    transactionDate: dateFormat_YY_MM_DD(transaction.asJson.transactionDate),
    allocation: transaction.asJson.allocation,
    allocatedBy: getAllocatorName(transaction.asJson) || "",
    allocationApprovedBy: getVerifierName(transaction.asJson) || "",
    allocationStatus: transaction.asJson.allocationStatus,
  }));

  const allocatedTransactionsFiltered = allocations.filter((allocation) => {
    let filtered = true;
    if (filters.stringValueA && !allocation.allocationStatus.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.clientWithdrawalPayment.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.clientWithdrawalPayment]);

  if (loading) return (
    <LoadingEllipsis />
  )

  return (
    <ErrorBoundary>
      {/** Toolbar starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        <Toolbar
          rightControls={
            <div className="filter">
              <div className="uk-flex">
                <button className="btn btn-text btn-small" type="button" data-uk-toggle="target: #offcanvas-flip">Filter <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon> </button>
                <button className="btn btn-danger btn-small" onClick={handleClearFilters}>Clear</button>
              </div>
              <div id="offcanvas-flip" data-uk-offcanvas="flip: true; overlay: true">
                <div className="uk-offcanvas-bar">
                  <button className="uk-offcanvas-close" type="button" data-uk-close></button>
                  <h3 className="main-title-small">Filter</h3>
                  <hr />
                  <div className="uk-grid uk-grid-small" data-uk-grid>
                    <div className="uk-width-large">
                      <div className="uk-grid" data-uk-grid>
                        <div className="uk-width-1-1">
                          <label htmlFor="">Instrument Status</label>
                          <select className="uk-select uk-form-small" onChange={(e) => handleFilterChange('stringValueA', e.target.value)}>
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="uk-divider-horizontal uk-margin-left" />
                  <button className="btn btn-small btn-danger uk-margin-top" onClick={handleClearFilters}>Clear filters</button>
                </div>
              </div>
            </div>
          }
          leftControls={
            <div>
              <h4 className="main-title-small">Verified Withdrawal Payments</h4>
            </div>
          }
        />
      </div>
      {/** Toolbar ends here */}
      {/** DataTable starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        {
          allocatedTransactionsFiltered &&
          <DataTable columns={columns} data={allocatedTransactionsFiltered} />
        }
      </div>
      {/** DataTable ends here */}
    </ErrorBoundary>
  );

});

export default VerifiedTransactionPayments;
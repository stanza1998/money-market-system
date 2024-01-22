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
import Modal from '../../../../../../shared/components/Modal';
import { LoadingEllipsis } from '../../../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../../../shared/functions/AdvancedFilter';
import { currencyFormat } from '../../../../../../shared/functions/Directives';
import { IClientWithdrawalPayment } from '../../../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel';
import { dateFormat_YY_MM_DD } from '../../../../../../shared/utils/utils';
import MODAL_NAMES from '../../../../../dialogs/ModalName';
import Toolbar from '../../../../../shared/toolbar/Toolbar';
import WithdrawalUpdateModal from '../../../../../dialogs/transactions/client-withdrawal-payment/WithdrawalUpdateModal';
import WithdrawalAuthorizeModal from '../../../../../dialogs/transactions/client-withdrawal-payment/WithdrawalAuthorizeModal';

interface IClientWithdrawalPaymentData {
  index: number;
  reference: string;
  amount: number;
  amountDisplay: string;
  transactionDate: string;
  bank: string;
  allocation: string;
  allocatedBy: string;
  allocationApprovedBy: string;
  transactionStatus: string;
}

const columns: Column[] = [
  { id: 'index', displayText: '#', sortMethod: 'sortNumber' },
  { id: 'transactionDate', displayText: 'Transaction Date' },
  { id: 'amountDisplay', displayText: 'Amount' },
  { id: 'reference', displayText: 'Reference' },
  { id: 'allocation', displayText: 'Allocated To' },
  { id: 'allocatedBy', displayText: 'Allocated By' },
];

const RecurringTransactionPayments = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const recurring = store.clientWithdrawalRecurringPayment.all.filter(recurring => recurring.asJson.isRecurring=== true);

  const users = store.user.all;
  const mmAccounts = store.mma.all;

  const clients = [...store.client.naturalPerson.all, ...store.client.legalEntity.all];

  const getClientName = (transaction: IClientWithdrawalPayment) => {
    const account = mmAccounts.find(account => account.asJson.accountNumber === transaction.allocation);
    if (account) {
      const client = clients.find(client => client.asJson.entityId === account.asJson.parentEntity);
      if (client) {
        const clientName = client.asJson.entityDisplayName;
        return clientName;
      }
    }
    else {
      return "";
    }
  }
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

  const allocations: IClientWithdrawalPaymentData[] = recurring.map((transaction, index) => ({
    index: index + 1,
    key: transaction.asJson.id,
    reference: transaction.asJson.reference,
    amount: transaction.asJson.amount,
    amountDisplay: currencyFormat(transaction.asJson.amount),
    transactionDate: dateFormat_YY_MM_DD(transaction.asJson.transactionDate),
    bank: transaction.asJson.bank,
    allocation: `${getClientName(transaction.asJson)} (${transaction.asJson.allocation})` || "",
    allocatedBy: getAllocatorName(transaction.asJson) || "",
    allocationApprovedBy: transaction.asJson.allocationApprovedBy,
    transactionStatus: transaction.asJson.transactionStatus,
    transection:transaction.asJson.isRecurring
  }));

  const unAllocatedTransactionsFiltered = allocations.filter((allocation) => {
    let filtered = true;
    if (filters.stringValueA && !allocation.transactionStatus.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.clientWithdrawalRecurringPayment.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.clientWithdrawalRecurringPayment]);

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
                                <option value="approved">Verified</option>
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
                  <h4 className="main-title-small">Recurring Withdrawal Payments</h4>
                </div>
              }
            />
          </div>
          {/** Toolbar ends here */}
          {/** DataTable starts here */}
          <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
            {
              unAllocatedTransactionsFiltered &&
              <DataTable columns={columns} data={unAllocatedTransactionsFiltered} />
            }
          </div>
          {/** DataTable ends here */}
      <Modal modalId={MODAL_NAMES.BACK_OFFICE.EDIT_WITHDRAWAL_MODAL}>
        <WithdrawalUpdateModal />
      </Modal>

      <Modal modalId={MODAL_NAMES.BACK_OFFICE.AUTHORIZE_WITHDRAWAL_MODAL}>
        <WithdrawalAuthorizeModal />
      </Modal>
    </ErrorBoundary>
  );

});

export default RecurringTransactionPayments;
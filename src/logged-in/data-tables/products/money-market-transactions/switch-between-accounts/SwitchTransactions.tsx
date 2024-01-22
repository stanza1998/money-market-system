// react
import { useState, useEffect } from "react";

// state management
import { observer } from "mobx-react-lite";

// custom hooks
import { useAppContext } from "../../../../../shared/functions/Context";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import { faExchange } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoadingEllipsis } from "../../../../../shared/components/loading/Loading";
import Toolbar from "../../../../shared/toolbar/Toolbar";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import Modal from "../../../../../shared/components/Modal";
import SwitchDataGrid from "./switch-data-grid/SwitchDataGrid";

const SwitchTransactions = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const switchTransactions = store.switch.all;

  const gridSwitchTransactions = switchTransactions.map((s) => {
    return s.asJson;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.switch.getAll();
        setLoading(false);
      } catch (error) {}
    };
    loadData();
  }, [api.switch]);

  if (loading) return <LoadingEllipsis />;

  return (
    <ErrorBoundary>
      {/** Toolbar starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        <Toolbar
          rightControls={<></>}
          leftControls={
            <div>
              <h4 className="main-title-lg">
                {" "}
                <FontAwesomeIcon
                  icon={faExchange}
                  className="uk-margin-small-right"
                />{" "}
                Switch Transactions
              </h4>
            </div>
          }
        />
      </div>
      {/** Toolbar ends here */}
      {/** DataTable starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        {gridSwitchTransactions && (
          // <DataTable columns={columns} data={allocatedTransactionsFiltered} />
          <SwitchDataGrid data={gridSwitchTransactions} />
        )}
      </div>
      {/** DataTable ends here */}
      <Modal modalId={MODAL_NAMES.ADMIN.BOND_MODAL}>
        {/* <BondModal /> */}
      </Modal>
    </ErrorBoundary>
  );
});

export default SwitchTransactions;

{
  /* <button
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
                </button> */
}

// const { filters, handleFilterChange, handleClearFilters } =
//   useExcelLikeFilters();

// const mmAccounts = store.mma.all;
// const clients = [
//   ...store.client.naturalPerson.all,
//   ...store.client.legalEntity.all,
// ];

// const getClientEntityId = (transaction: ISwitchTransaction) => {
//   const account = mmAccounts.find(
//     (account) => account.asJson.accountNumber === transaction.toAccount
//   );
//   if (account) {
//     const client = clients.find(
//       (client) => client.asJson.entityId === account.asJson.parentEntity
//     );
//     if (client) {
//       const clientName = client.asJson.entityId;
//       return clientName;
//     }
//   } else {
//     return "";
//   }
// };

// const getClientName = (transaction: ISwitchTransaction) => {
//   const account = mmAccounts.find(
//     (account) =>
//       account.asJson.accountNumber === transaction.fromAccount ||
//       transaction.toAccount
//   );
//   if (account) {
//     const client = clients.find(
//       (client) => client.asJson.entityId === account.asJson.parentEntity
//     );
//     if (client) {
//       const clientName = client.asJson.entityDisplayName;
//       return clientName;
//     }
//   } else {
//     return "";
//   }
// };

// const transactions: IClientDepositAllocationData[] = switchTransactions.map(
//   (transaction, index) => ({
//     index: index + 1,
//     key: transaction.asJson.id,
//     clientName: getClientName(transaction.asJson) || "",
//     clientEntityId: getClientEntityId(transaction.asJson) || "",
//     switchDate: dateFormat_YY_MM_DD_NEW(transaction.asJson.switchDate),
//     fromAccount: transaction.asJson.toAccount,
//     toAccount: transaction.asJson.toAccount,
//     amount: transaction.asJson.amount,
//     amountDisplay: currencyFormat(transaction.asJson.amount),
//     switchBy: transaction.asJson.switchedBy,
//   })
// );

// const allocatedTransactionsFiltered = transactions.filter((allocation) => {
//   let filtered = true;
//   // if (filters.stringValueA && !allocation.allocationStatus.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
//   return filtered;
// });

//side bar
// <div className="filter">
//   <div className="uk-flex"></div>
//   <div
//     id="offcanvas-flip"
//     data-uk-offcanvas="flip: true; overlay: true"
//   >
//     <div className="uk-offcanvas-bar">
//       <button
//         className="uk-offcanvas-close"
//         type="button"
//         data-uk-close
//       ></button>
//       <h3 className="main-title-small">Filter</h3>
//       <hr />
//       <div className="uk-grid uk-grid-small" data-uk-grid>
//         <div className="uk-width-large">
//           <div className="uk-grid" data-uk-grid>
//             <div className="uk-width-1-1">
//               <label htmlFor="">Instrument Status</label>
//               <select
//                 className="uk-select uk-form-small"
//                 onChange={(e) =>
//                   handleFilterChange("stringValueA", e.target.value)
//                 }
//               >
//                 <option value="">All</option>
//                 <option value="pending">Pending</option>
//                 <option value="approved">Approved</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="uk-divider-horizontal uk-margin-left" />
//       <button
//         className="btn btn-small btn-danger uk-margin-top"
//         onClick={handleClearFilters}
//       >
//         Clear filters
//       </button>
//     </div>
//   </div>
// </div>F

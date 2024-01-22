// react
import { useState, useEffect } from 'react';

// state management
import { observer } from 'mobx-react-lite';

// custom hooks
import { useAppContext } from '../../../../shared/functions/Context';

// DataTable components
import { DataTable } from './DataTable';
import { Column } from '../../../../shared/components/react-ts-datatable/DataTableTypes';

import ErrorBoundary from '../../../../shared/components/error-boundary/ErrorBoundary';

import { LoadingEllipsis } from '../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../shared/functions/AdvancedFilter';

import { useNavigate } from 'react-router-dom';
import MODAL_NAMES from '../../../dialogs/ModalName';
import showModalFromId from '../../../../shared/functions/ModalShow';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Toolbar from '../../../shared/toolbar/Toolbar';
import Modal from '../../../../shared/components/Modal';
import UserModal from '../../../dialogs/crud/user/UserModal';
import ClientUserModal from '../../../dialogs/crud/client-user/ClientUserModal';


const columns: Column[] = [
  { id: 'userName', displayText: 'Name' },
  { id: 'userEmail', displayText: 'Email' },
  { id: 'userRole', displayText: 'Role' },
  { id: 'department', displayText: 'Department' },
  { id: 'jobTitle', displayText: 'Job Title'},
];

interface IUserDataTable {
  key: string;
  userName: string;
  userEmail: string;
  userRole: string;
  department: string;
  jobTitle: string;
}

const Users = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const navigate = useNavigate();

  const users = store.user.all.map((user)=>{return user.asJson});

  const usersList: IUserDataTable[] = users.map((user) => ({
    key: user.uid,
    userName: user.displayName || "",
    userEmail: user.email,
    userRole: user.role,
    department: user.department || "",
    jobTitle: user.jobTitle || ""
  }));

  const usersFiltered = usersList.filter((tbill) => {
    let filtered = true;
    return filtered;
  });

  const onAddNewUser = () => {
    store.user.clearSelected();
    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL);
  }
    const onAddNewClient = () => {
      store.user.clearSelected();
      showModalFromId(MODAL_NAMES.ADMIN.CLIENT_MODAL);
    };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.user.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.user]);

  if (loading) return (
    <LoadingEllipsis />
  )

  return (
    <ErrorBoundary>
      <div className="settings uk-section uk-section-small">
        <div className="uk-container uk-container-expand">
          <div className="settings-main-card uk-card uk-card-default uk-card-body">
            {/** Toolbar starts here */}
            <div
              className="uk-grid uk-grid-small uk-child-width-1-1"
              data-uk-grid>
              <Toolbar
                // rightControls={
                //   <div className="filter">
                //     {/* <div className="uk-flex"> */}
                //       {/* <button
                //         className="btn btn-text btn-small"
                //         type="button"
                //         data-uk-toggle="target: #offcanvas-flip">
                //         Filter{" "}
                //         <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>{" "}
                //       </button>
                //       <button
                //         className="btn btn-danger btn-small"
                //         onClick={handleClearFilters}>
                //         Clear
                //       </button>
                //     </div> */}
                //     <div
                //       id="offcanvas-flip"
                //       data-uk-offcanvas="flip: true; overlay: true">
                //       <div className="uk-offcanvas-bar">
                //         <button
                //           className="uk-offcanvas-close"
                //           type="button"
                //           data-uk-close></button>
                //         <h3 className="main-title-small">Filter</h3>
                //         <hr />
                //         <div className="uk-grid uk-grid-small" data-uk-grid>
                //           <div className="uk-width-large">
                //             <div className="uk-grid" data-uk-grid>
                //               <div className="uk-width-1-1">
                //                 <label htmlFor="">Period</label>
                //                 <select
                //                   className="uk-select uk-form-small"
                //                   onChange={(e) =>
                //                     handleFilterChange(
                //                       "stringValueB",
                //                       e.target.value
                //                     )
                //                   }>
                //                   <option value="">All</option>
                //                   <option value="91">91</option>
                //                   <option value="182">182</option>
                //                   <option value="273">273</option>
                //                   <option value="364">364</option>
                //                 </select>
                //               </div>
                //             </div>
                //             <div className="uk-grid" data-uk-grid>
                //               <div className="uk-width-1-1">
                //                 <label htmlFor="">Instrument Status</label>
                //                 <select
                //                   className="uk-select uk-form-small"
                //                   onChange={(e) =>
                //                     handleFilterChange(
                //                       "stringValueA",
                //                       e.target.value
                //                     )
                //                   }>
                //                   <option value="">All</option>
                //                   <option value="pending">Pending</option>
                //                   <option value="approved">Approved</option>
                //                 </select>
                //               </div>
                //             </div>
                //           </div>
                //         </div>
                //         <div className="uk-divider-horizontal uk-margin-left" />
                //         <button
                //           className="btn btn-small btn-danger uk-margin-top"
                //           onClick={handleClearFilters}>
                //           Clear filters
                //         </button>
                //       </div>
                //     </div>
                // //   </div>
                // }
                leftControls={
                  <>
                    <button className="btn btn-primary" onClick={onAddNewUser}>
                      Add New User
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={onAddNewClient}>
                      Add New Client
                    </button>
                  </>
                }
              />
            </div>
            {/** Toolbar ends here */}
            {/** DataTable starts here */}
            <div
              className="uk-grid uk-grid-small uk-child-width-1-1"
              data-uk-grid>
              {usersFiltered && (
                <DataTable columns={columns} data={usersFiltered} />
              )}
            </div>
            {/** DataTable ends here */}
          </div>
        </div>
      </div>
      <ErrorBoundary>
        {/* <Modal modalId={MODAL_NAMES.ADMIN.USER_MODAL}>
          <UserModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.CLIENT_MODAL}>
          <ClientUserModal />
        </Modal> */}
      </ErrorBoundary>
    </ErrorBoundary>
  );

});

export default Users;
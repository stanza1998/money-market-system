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
import { faFilter, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { LoadingEllipsis } from '../../../../shared/components/loading/Loading';
import { useExcelLikeFilters } from '../../../../shared/functions/AdvancedFilter';
import Toolbar from '../../../shared/toolbar/Toolbar';

import showModalFromId from '../../../../shared/functions/ModalShow';
import MODAL_NAMES from '../../../dialogs/ModalName';
import React from 'react';
import ViewCompactIcon from '@mui/icons-material/ViewCompact';

const columns: Column[] = [
  { id: 'entityId', displayText: 'Entity ID' },
  { id: 'clientName', displayText: 'First Name' },
  { id: 'clientSurname', displayText: 'Last Name' },
  { id: 'idNumber', displayText: 'ID Number' },
  { id: 'contactNumber', displayText: 'Contact Number' },
  { id: 'emailAddress', displayText: 'Email' },
];

interface IClientDataTable {
  key: string;
  entityId: string;
  clientName: string;
  clientSurname: string;
  idNumber: string;
  contactNumber: string;
  emailAddress: string;
}

const NaturalPerson = observer(() => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const { filters, handleFilterChange, handleClearFilters } = useExcelLikeFilters();

  const naturalPersonEntities: IClientDataTable[] = store.client.naturalPerson.all.map((client) => ({
    key: client.asJson.id,
    entityId: client.asJson.entityId,
    clientName: client.asJson.clientName,
    clientSurname: client.asJson.clientSurname,
    idNumber: client.asJson.idNumber,
    contactNumber: client.asJson.contactDetail.cellphoneNumber,
    emailAddress: client.asJson.contactDetail.emailAddress,
  }));

  const naturalPersonEntitiesFiltered = naturalPersonEntities.filter((naturalPersonEntity) => {
    let filtered = true;
    if (filters.stringValueA && !naturalPersonEntity.clientName.toLowerCase().includes(filters.stringValueA.toLowerCase())) { filtered = false; }
    return filtered;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.client.naturalPerson.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();

  }, [api.client.naturalPerson]);

  if (loading) return (
    <LoadingEllipsis />
  )

  return (
    <ErrorBoundary>
      {/** Toolbar starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        <Toolbar
          // rightControls={
          //   <div className="filter">
          //     <div className="uk-flex">
          //       <button className="btn btn-text btn-small" type="button" data-uk-toggle="target: #offcanvas-flip">Filter <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon> </button>
          //       <button className="btn btn-danger btn-small" onClick={handleClearFilters}>Clear</button>
          //     </div>
          //     <div id="offcanvas-flip" data-uk-offcanvas="flip: true; overlay: true">
          //       <div className="uk-offcanvas-bar">
          //         <button className="uk-offcanvas-close" type="button" data-uk-close></button>
          //         <h3 className="main-title-small">Filter</h3>
          //         <hr />
          //         <div className="uk-grid uk-grid-small" data-uk-grid>
          //           <div className="uk-width-large">
          //             <div className="uk-grid" data-uk-grid>
          //               <div className="uk-width-1-1">
          //                 {/* <label htmlFor="">Client Type</label>
          //                       <select className="uk-select uk-form-small" onChange={(e) => handleFilterChange('stringValueA', e.target.value)}>
          //                         <option value="">Display All Entity Types</option>
          //                         <option value="Natural">Display Natural Person Entities</option>
          //                         <option value="Legal">Display Legal Entities</option>
          //                       </select> */}
          //               </div>
          //             </div>
          //           </div>
          //         </div>
          //         <div className="uk-divider-horizontal uk-margin-left" />
          //         <button className="btn btn-small btn-danger uk-margin-top" onClick={handleClearFilters}>Clear filters</button>
          //       </div>
          //     </div>
          //   </div>
          // }

          leftControls={
            <h4 className="main-title-small"><FontAwesomeIcon icon={faUsers}/> Client List</h4>
          }
        />
      </div>
      {/** Toolbar ends here */}
      {/** DataTable starts here */}
      <div className="uk-grid uk-grid-small uk-child-width-1-1" data-uk-grid>
        {
          naturalPersonEntitiesFiltered &&
          <DataTable columns={columns} data={naturalPersonEntitiesFiltered} />
        }
      </div>
      {/** DataTable ends here */}
    </ErrorBoundary>
  );

});

export default NaturalPerson;
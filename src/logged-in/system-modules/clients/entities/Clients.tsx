import { useState } from "react";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { observer } from "mobx-react-lite";
import Modal from "../../../../shared/components/Modal";
import MODAL_NAMES from "../../../dialogs/ModalName";
import Toolbar from "../../../shared/toolbar/Toolbar";

import ClientEntityTabs from "./ClientTabs";

import EntityModal from "../../../dialogs/client/EntityModal";
import NaturalPerson from "../../../data-tables/clients/natural-person/NaturalPerson";
import LegalEntity from "../../../data-tables/clients/legal-entity/LegalEntity";
import ViewClient from "../../../dialogs/client-views/natural-person-entity/ViewClient";

import NaturalPersonOfflineModal from "../../../dialogs/client/client-offline/NaturalPersonOfflineModal";
import ViewLegalEntity from "../../../dialogs/views/legal-entity/ViewLegalEntity";
import EntityImportModal from "../../../dialogs/client/import-natural-person/EntityImportModal";
import LegalEntityModal from "../../../dialogs/client/legal-entity/LegalEntityModal";

import DocFoxEntityModal from "../../../dialogs/client/DocFoxEntityModal";

const Clients = observer(() => {
  const [selectedTab, setSelectedTab] = useState("natural-person-tab");

  return (
    <ErrorBoundary>
      <div
        className="page uk-section uk-section-small"
        style={{ overflow: "auto" }}
      >
        <div className="uk-container uk-container-expand">
          <div className="sticky-top">
            <Toolbar
              title="Entities"
              rightControls={
                <ClientEntityTabs
                  selectedTab={selectedTab}
                  setSelectedTab={setSelectedTab}
                />
              }
            />
            <hr />
          </div>

          <div className="page-main-card uk-card uk-card-default uk-card-body">
            {selectedTab === "natural-person-tab" && <NaturalPerson />}
            {selectedTab === "legal-entity-tab" && <LegalEntity />}
          </div>
        </div>
      </div>

      {/** CRUD */}
      <Modal modalId={MODAL_NAMES.ADMIN.ENTITY_TYPE_MODAL}>
        <EntityModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.ADMIN.NATURAL_PERSON_MODAL}>
        <NaturalPersonOfflineModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.ADMIN.LEGAL_ENTITY_MODAL}>
        <LegalEntityModal />
      </Modal>

      <Modal modalId={MODAL_NAMES.BACK_OFFICE.DOC_FOX_ENTITY_TYPE_MODAL}>
        <DocFoxEntityModal />
      </Modal>

      <Modal modalId={MODAL_NAMES.BACK_OFFICE.DOC_FOX_LEGAL_ENTITY_MODAL}>
        <LegalEntityModal />
      </Modal>

      <Modal modalId={MODAL_NAMES.DATA_MIGRATION.IMPORT_CLIENT_ENTITY_MODAL}>
        <EntityImportModal />
      </Modal>

      {/** Views */}
      <Modal modalId={MODAL_NAMES.ADMIN.VIEW_NATURAL_PERSON_MODAL}>
        <ViewClient />
      </Modal>

      <Modal modalId={MODAL_NAMES.ADMIN.LEGAL_ENTITY_MODAL}>
        <ViewLegalEntity />
      </Modal>
    </ErrorBoundary>
  );
});
export default Clients;

import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";

import { useAppContext } from "../../../shared/functions/Context";
import Toolbar from "../../shared/toolbar/Toolbar";

import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import Modal from "../../../shared/components/Modal";
import CounterPartyModal from "../../dialogs/crud/counter-party/CounterPartyModal";

import { CounterPartyGrid } from "./CounterPartyGrid";

const CounterPartyList = observer(() => {

  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  const counterParties = store.counterParty.all.map((party)=>{return party.asJson});

  const newCounterParty = () => {
    showModalFromId(MODAL_NAMES.ADMIN.COUNTER_PARTY_MODAL);
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        await api.counterParty.getAll();
        setLoading(false);
      } catch (error) { }
      setLoading(false);
    };
    loadAll();
  }, [api.counterParty]);

  return (
    <div className="page uk-section uk-section-small">
      <div className="uk-container uk-container-expand">

        <div className="sticky-top">
          <Toolbar
            title="Counter parties"
            rightControls={
              <button className="btn btn-primary" onClick={newCounterParty} type="button" >
                <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                New
              </button>
            }
          />
          <hr />
        </div>

        <div className="page-main-card uk-card uk-card-default uk-card-body">
          <div className="settings-list">
            <CounterPartyGrid data={counterParties}/>
          </div>

          <Modal modalId={MODAL_NAMES.ADMIN.COUNTER_PARTY_MODAL}>
            <CounterPartyModal />
          </Modal>
        </div >
      </div>
    </div>
  );
});

export default CounterPartyList;
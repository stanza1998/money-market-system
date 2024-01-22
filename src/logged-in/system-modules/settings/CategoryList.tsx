import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import Modal from "../../../shared/components/Modal";
import { CustomCloseAccordion } from "../../../shared/components/accordion/Accordion";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import { useAppContext } from "../../../shared/functions/Context";
import MODAL_NAMES from "../../dialogs/ModalName";
import CounterPartyModal from "../../dialogs/crud/counter-party/CounterPartyModal";
import IssuerModal from "../../dialogs/crud/issuer/IssuerModal";
import { TreasuryBillItem, BondItem, UnitTrustItem, EquityItem, FixedDepositItem } from "./InstrumentItems";

const CategoryList = observer(() => {

  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await api.instruments.bond.getAll();
        await api.instruments.equity.getAll();
        await api.instruments.fixedDeposit.getAll();
        await api.instruments.unitTrust.getAll();
        await api.instruments.treasuryBill.getAll();
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    loadData();

  }, [api.instruments.bond, api.instruments.equity,
  api.instruments.fixedDeposit, api.instruments.treasuryBill,
  api.instruments.unitTrust]);

  return (
    <div className="settings uk-section uk-section-small">
      <div className="uk-container uk-container-xlarge">
        <div className="settings-main-card uk-card uk-card-default uk-card-body">
          {!loading &&
            <div>
              <CustomCloseAccordion title={"Treasury Bill"}>
                <ErrorBoundary>
                  {store.instruments.treasuryBill.all.map((bill, index) => (
                    <TreasuryBillItem key={index} tbill={bill.asJson} />
                  ))}
                </ErrorBoundary>
              </CustomCloseAccordion>
              <CustomCloseAccordion title={"Bond"}>
                <ErrorBoundary>
                  {store.instruments.bond.all.map((item, index) => (
                    <BondItem key={index} bond={item.asJson} />
                  ))}
                </ErrorBoundary>
              </CustomCloseAccordion>

              <CustomCloseAccordion title={"Unit Trust"}>
                <ErrorBoundary>
                  {store.instruments.unitTrust.all.map((item, index) => (
                    <UnitTrustItem key={index} unit={item.asJson} />
                  ))}
                </ErrorBoundary>
              </CustomCloseAccordion>

              <CustomCloseAccordion title={"Equity"}>
                <ErrorBoundary>
                  {store.instruments.equity.all.map((item, index) => (
                    <EquityItem key={index} equity={item.asJson} />
                  ))}
                </ErrorBoundary>
              </CustomCloseAccordion>

              <CustomCloseAccordion title={"Fixed Deposit"}>
                <ErrorBoundary>
                  {store.instruments.fixedDeposit.all.map((item, index) => (
                    <FixedDepositItem key={index} deposit={item.asJson} />
                  ))}
                </ErrorBoundary>
              </CustomCloseAccordion>
            </div>}
          {loading && <LoadingEllipsis />}
        </div>
      </div>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.ADMIN.ISSURE_MODAL}>
          <IssuerModal />
        </Modal>
        <Modal modalId={MODAL_NAMES.ADMIN.COUNTER_PARTY_MODAL}>
          <CounterPartyModal />
        </Modal>
      </ErrorBoundary>
    </div>
  );
});

export default CategoryList;
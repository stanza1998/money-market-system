import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import Toolbar from "../../../../shared/toolbar/Toolbar";
import { useAppContext } from "../../../../../shared/functions/Context";
import { CrmDepositTransactionsGrid } from "../client-deposit-allocation/crm-deposits/CrmDepositTransactionsGrid";
import { useEffect } from "react";

export const DepositNotices = observer(() => {
  const { store, api } = useAppContext();

  const notices = store.crmClientDepositAllocation.all.map((n) => {
    return n.asJson;
  });

  useEffect(() => {
    const getData = async () => {
      await Promise.all([api.crmClientDepositAllocation.getAll()]);
    };
    getData();
  }, [api.crmClientDepositAllocation]);

  return (
    <ErrorBoundary>
      <div className="page uk-section uk-section-small">
        <div className="uk-container uk-container-expand">
          <div className="sticky-top">
            <Toolbar
              title="Deposit Notices"
              rightControls={<div className="uk-margin-bottom"></div>}
            />
            <hr />
          </div>
          <ErrorBoundary>
            <div></div>
            <div className="page-main-card uk-card uk-card-default uk-card-body">
              <CrmDepositTransactionsGrid data={notices} />
            </div>
          </ErrorBoundary>
        </div>
      </div>
    </ErrorBoundary>
  );
});

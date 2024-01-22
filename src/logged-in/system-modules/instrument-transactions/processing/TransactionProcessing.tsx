import { observer } from "mobx-react-lite";

import Toolbar from "../../../shared/toolbar/Toolbar";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";

import TreasuryBills from "../../../data-tables/products/instrument-transaction-processing/treasury-bills/TreasuryBills";

const TransactionProcessing = observer(() => {
    // const [selectedTab, setSelectedTab] = useState("treasury-bills-tab");

    return (
        <ErrorBoundary>
            <div className="page uk-section uk-section-small">
                <div className="uk-container uk-container-expand">
                    <div className="sticky-top">
                        <Toolbar
                            title="Transaction Processing"
                        // rightControls={
                        //     <div className="uk-margin-bottom">
                        //         <TransactionProcessingTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                        //     </div>
                        // }
                        />
                        <hr />
                    </div>
                    <ErrorBoundary>
                        <div className="page-main-card uk-card uk-card-default uk-card-body">
                            {/* {selectedTab === "treasury-bills-tab" && < TreasuryBills/>} */}
                            <TreasuryBills />
                        </div>
                    </ErrorBoundary>
                </div>
            </div>
        </ErrorBoundary>
    )
});
export default TransactionProcessing;

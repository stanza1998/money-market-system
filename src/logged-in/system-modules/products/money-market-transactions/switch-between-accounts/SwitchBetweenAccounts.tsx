import { useEffect } from "react";

import { observer } from "mobx-react-lite";

import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import useTitle from "../../../../../shared/hooks/useTitle";
import MODAL_NAMES from "../../../../dialogs/ModalName";
import Toolbar from "../../../../shared/toolbar/Toolbar";
import Modal from "../../../../../shared/components/Modal";
import SwitchBetweenAccountsModal from "../../../../dialogs/transactions/switch/SwitchBetweenAccountsModal";
import { useAppContext } from "../../../../../shared/functions/Context";
import SwitchTransactions from "../../../../data-tables/products/money-market-transactions/switch-between-accounts/SwitchTransactions";

const SwitchBetweenAccounts = observer(() => {
    const { api } = useAppContext();

    const handleSwitchBetweenAccounts = () => {
        showModalFromId(MODAL_NAMES.BACK_OFFICE.SWITCH_BETWEEN_ACCOUNTS_MODAL);
    }

    useEffect(() => {
        const loadData = async () => {
            await api.client.legalEntity.getAll();
            await api.client.naturalPerson.getAll();
            await api.mma.getAll();
            await api.user.getAll();
        }
        loadData();
    }, [api.client.naturalPerson, api.client.legalEntity, api.mma, api.user]);

    return (
        <ErrorBoundary>
            <div className="page uk-section uk-section-small">
                <div className="uk-container uk-container-expand">
                    <div className="sticky-top">
                        <Toolbar
                            title="Switch Between Accounts"
                            rightControls={
                                <button className="btn btn-primary" onClick={handleSwitchBetweenAccounts}>Switch Between Accounts</button>
                            }
                        />
                        <hr />
                    </div>
                    <ErrorBoundary>
                        <div className="page-main-card uk-card uk-card-default uk-card-body">
                            <SwitchTransactions />
                        </div>
                    </ErrorBoundary>
                </div>
            </div>
            <Modal modalId={MODAL_NAMES.BACK_OFFICE.SWITCH_BETWEEN_ACCOUNTS_MODAL}>
                <SwitchBetweenAccountsModal />
            </Modal>
        </ErrorBoundary>
    )
});
export default SwitchBetweenAccounts;

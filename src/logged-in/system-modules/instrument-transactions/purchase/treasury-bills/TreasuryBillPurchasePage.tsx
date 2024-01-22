import { useNavigate } from 'react-router-dom';
import PurchaseTreasuryBillsDataTable from '../../../../data-tables/products/transactions-purchase/purchase-treasury-bills/PurchaseTreasuryBillsDataTable'
import Toolbar from '../../../../shared/toolbar/Toolbar'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TreasuryBillPurchasePage = () => {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/c/purchases');
    }

    return (
        <div className="page uk-section uk-section-small">
            <div className="uk-container uk-container-expand">
                <div className="sticky-top">
                    <Toolbar
                        title="Treasury Bill Purchasing"
                        rightControls={
                            <button className="btn btn-danger" onClick={handleBack}><FontAwesomeIcon icon={faArrowLeftLong} /> Back to Instrument Categories</button>
                        }
                    />
                    <hr />
                </div>
                <div className="page-main-card uk-card uk-card-body">
                    <PurchaseTreasuryBillsDataTable />
                </div>
            </div>
        </div>
    )
}

export default TreasuryBillPurchasePage

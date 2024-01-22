import { useNavigate } from 'react-router-dom';
import Toolbar from '../../../../shared/toolbar/Toolbar'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IFixedDeposit } from '../../../../../shared/models/instruments/FixedDepositModel';
import { useAppContext } from '../../../../../shared/functions/Context';
import { useEffect, useState } from 'react';
import { FixedDepositGrid } from '../../../../data-tables/products/transactions-purchase/Fixed-Deposit/FixedDepositGrid';

const FixedDepositPurchasePage = () => {
    const {store,api} = useAppContext();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/c/purchases');
    }
    const fixedDeposits: IFixedDeposit[] = store.instruments.fixedDeposit.all.map((instrument)=>{return instrument.asJson})

    useEffect(() => {
        const loadData = async () => {
          setLoading(true);
          try {
            await api.instruments.fixedDeposit.getAll();
            await api.issuer.getAll();
            setLoading(false);
          } catch (error) {}
        };
        loadData();
      }, [api.instruments.fixedDeposit, api.issuer]);
    
    return (
        <div className="page uk-section uk-section-small">
            <div className="uk-container uk-container-expand">
                <div className="sticky-top">
                    <Toolbar
                        title="Fixed Deposit Purchasing"
                        rightControls={
                            <button className="btn btn-danger" onClick={handleBack}><FontAwesomeIcon icon={faArrowLeftLong} /> Back to Instrument Categories</button>
                        }
                    />
                    <hr />
                </div>
                <div className="page-main-card uk-card uk-card-body">
                    <FixedDepositGrid data={fixedDeposits} />
                </div>
            </div>
        </div>
    )
}

export default FixedDepositPurchasePage;

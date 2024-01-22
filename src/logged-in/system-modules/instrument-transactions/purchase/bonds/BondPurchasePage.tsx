import { useNavigate } from 'react-router-dom';
import PurchaseTreasuryBillsDataTable from '../../../../data-tables/products/transactions-purchase/purchase-treasury-bills/PurchaseTreasuryBillsDataTable'
import Toolbar from '../../../../shared/toolbar/Toolbar'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppContext } from '../../../../../shared/functions/Context';
import { IBond } from '../../../../../shared/models/instruments/BondModel';
import { BondsGrid } from '../../../../data-tables/products/transactions-purchase/Bonds/BondsGrid';
import { useEffect, useState } from 'react';

const BondPurchasePage = () => {
    const {store,api} = useAppContext()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const handleBack = () => {
        navigate('/c/purchases');
    }
    const bonds: IBond[] = store.instruments.bond.all.map((instrument)=>{return instrument.asJson})

    useEffect(() => {
        const loadData = async () => {
          setLoading(true);
          try {
            await api.instruments.bond.getAll();
            await api.issuer.getAll();
            setLoading(false);
          } catch (error) {}
        };
        loadData();
      }, [api.instruments.bond, api.issuer]);
    
    return (
        <div className="page uk-section uk-section-small">
            <div className="uk-container uk-container-expand">
                <div className="sticky-top">
                    <Toolbar
                        title="Bonds Purchasing"
                        rightControls={
                            <button className="btn btn-danger" onClick={handleBack}><FontAwesomeIcon icon={faArrowLeftLong} /> Back to Instrument Categories</button>
                        }
                    />
                    <hr />
                </div>
                <div className="page-main-card uk-card uk-card-body">
                    <BondsGrid data={bonds}/>
                </div>
            </div>
        </div>
    )
}

export default BondPurchasePage

import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../../../shared/functions/Context';
import { ITreasuryBill, defaultTreasuryBill } from '../../../../shared/models/instruments/TreasuryBillModel';

const TreasuryBillHoldingsModal = () => {
    const { api, store} = useAppContext();
    const [treasuryBill, setTreasuryBill] = useState<ITreasuryBill>({ ...defaultTreasuryBill });

    const holdings = store.purchase.treasuryBillAllocation.all

    useEffect(() => {
        if (store.instruments.treasuryBill.selected) {
            setTreasuryBill(store.instruments.treasuryBill.selected);

            const loadHoldings = async () => {
                await api.purchase.treasuryBill.getAll();
            }
            loadHoldings();

        }
    }, [api.purchase.treasuryBill, store.instruments.treasuryBill.selected, treasuryBill.id]);

    return (
        <div className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
            <button
                className="uk-modal-close-default"
                type="button"
                data-uk-close
            ></button>
            <h3 className="uk-modal-title text-to-break">{treasuryBill.instrumentName} Holdings</h3>
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Client Name</th>
                        <th>Tender Rate</th>
                        <th>Client Rate</th>
                        <th>Nomimal</th>
                        <th>Profit on Deal</th>
                    </tr>
                </thead>
                <tbody>
                    {holdings.map((holding, index:number) => (
                        <tr key={holding.asJson.id}>
                            <td>
                                {index+1}
                            </td>
                            <td>{holding.asJson.clientName}</td>
                            <td>{holding.asJson.tenderRate}</td>
                            <td>{holding.asJson.clientRate}</td>
                            <td>{holding.asJson.newNominal}</td>
                            <td>{holding.asJson.profit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default TreasuryBillHoldingsModal

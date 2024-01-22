import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../../shared/functions/Context";
import MODAL_NAMES from "../../../ModalName";
import { hideModalFromId } from "../../../../../shared/functions/ModalShow";
import { useEffect, useState } from "react";
import { ITreasuryBill, defaultTreasuryBill } from "../../../../../shared/models/instruments/TreasuryBillModel";
import { dateFormat } from "../../../../../shared/utils/utils";
import TreasuryBillTabs from "./TreasuryBillTabs";
import "../ViewModal.scss"
import Holdings from "./datatables/holdings/Holdings";

const ViewTreasuryBillModal = observer(() => {

    const { api, store } = useAppContext();
    const [treasuryBill, setTreasuryBill] = useState<ITreasuryBill>({ ...defaultTreasuryBill });

    const [selectedTab, setSelectedTab] = useState("general-tab");

    const onClose = () => {
        hideModalFromId(MODAL_NAMES.ADMIN.VIEW_TREASURY_BILL_MODAL);
    };

    // useEffect(() => {
    //     const loadAll = async () => {
    //         try {
    //             await api.instruments.treasuryBill.getAll();
    //         } catch (error) { }
    //     };
    //     loadAll();
    // }, [api.instruments.treasuryBill]);

    useEffect(() => {
        if (store.instruments.treasuryBill.selected) {
            setTreasuryBill(store.instruments.treasuryBill.selected);
        }
    }, [store.instruments.treasuryBill.selected]);

    return (
        <div className="custom-modal-style uk-modal-dialog uk-width-4-5 uk-modal-body uk-margin-auto-vertical" data-uk-height-viewport>
            <h3 className="uk-modal-title">{treasuryBill.instrumentName}</h3>
            <button className="uk-modal-close-full uk-close-large" type="button" data-uk-close></button>
            <div className="uk-grid uk-text-center uk-margin">
                <TreasuryBillTabs
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                />
            </div>
            <div className="view-modal dialog-content uk-position-relative uk-align-center uk-child-width-1-1">
                {selectedTab === "general-tab" &&
                    <div className="uk-card uk-height-1-1">
                        <div className="uk-card-body">
                            <h4>General Information</h4>
                            <div className="uk-grid">
                                <div className="uk-width-1-3">
                                    <p>Instrument Name:</p>
                                </div>
                                <div className="uk-width-2-3">
                                    <p>{treasuryBill.instrumentName}</p>
                                </div>
                                <hr className="uk-width-1-1" />
                                <div className="uk-width-1-3">
                                    <p>SettlementDate:</p>
                                </div>
                                <div className="uk-width-2-3">
                                    <p>{dateFormat(treasuryBill.issueDate)}</p>
                                </div>
                                <hr className="uk-width-1-1" />
                                <div className="uk-width-1-3">
                                    <p>Maturity Date:</p>
                                </div>
                                <div className="uk-width-2-3">
                                    <p>{dateFormat(treasuryBill.maturityDate)}</p>
                                </div>
                                <hr className="uk-width-1-1" />
                                <div className="uk-width-1-3">
                                    <p>Day to Maturity:</p>
                                </div>
                                <div className="uk-width-2-3">
                                    <p>{`${treasuryBill.daysToMaturity}`}</p>
                                </div>
                                <hr className="uk-width-1-1" />
                                <div className="uk-width-1-3">
                                    <p>Status:</p>
                                </div>
                                <div className="uk-width-2-3">
                                    {
                                        treasuryBill.instrumentStatus === "approved" ? <span className="uk-label uk-label-success">Approved</span> :
                                            <span className="uk-label uk-label-danger">Pending</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {selectedTab === "holdings-tab" &&
                    <Holdings />
                }
                {selectedTab === "allocations-tab" &&
                    <div className="uk-card">
                        <h3 className="main-title-small">Allocations</h3>
                        <div className="uk-card-body">
                            <div className="uk-grid" data-uk-grid>
                                <div className="uk-width-1-2">
                                    <h4>Desking Dealing Sheet</h4>
                                    <table className="kit-table uk-table uk-table-divider purhase-page-form desk-dealing">
                                        <thead>
                                            <tr>
                                                <th>Instrument</th>
                                                <th>Tender Rate</th>
                                                <th>Nominal</th>
                                                <th>Consideration</th>
                                            </tr>
                                        </thead>
                                        <tbody className="uk-text-white uk-height-small" data-uk-overflow-auto>
                                            <tr className="uk-text-white">
                                                <td>{treasuryBill.instrumentName}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="uk-text-white" key="grandTotal">
                                                <td colSpan={2}></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="uk-grid" data-uk-grid>
                                <div className="uk-width-1-1">
                                    <h4>Client Tender Sheet</h4>
                                    <table className="kit-table uk-table uk-table-divider">
                                        <thead>
                                            <tr>
                                                <th>Client Name</th>
                                                <th>Client MM Acc</th>
                                                <th>Maturing Balance</th>
                                                <th>MM Balance</th>
                                                <th>Available Balance</th>
                                                <th>Net Balance</th>
                                                <th>Nominal New</th>
                                                <th>Alt TreasuryBill</th>
                                                <th>Tender Rate</th>
                                                <th>Margin</th>
                                                <th>Client Rate</th>
                                                <th>Counter Party</th>
                                                <th>Consideration BON</th>
                                                <th>Consideration Client</th>
                                                <th>Profit</th>
                                                <th>Notes</th>
                                                <th>Confirmation</th>
                                                <th>Contact Person</th>
                                            </tr>
                                        </thead>
                                        <tbody className="uk-text-white uk-height-small" data-uk-overflow-auto>
                                            <tr className="uk-text-white">
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="uk-text-white" key="grandTotal">
                                                <td colSpan={2}></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                            <div className="uk-grid" data-uk-grid>
                                <div className="uk-width-1-1">
                                    <h4>Client Transaction Sheet</h4>
                                    <table className="kit-table uk-table uk-table-divider">
                                        <thead>
                                            <tr>
                                                <th>Client Name</th>
                                                <th>Client MM Acc</th>
                                                <th>MM Balance</th>
                                                <th>Available Balance</th>
                                                <th>Net Balance</th>
                                                <th>Nominal New</th>
                                                <th>Alt TreasuryBill</th>
                                                <th>Tender Rate</th>
                                                <th>Margin</th>
                                                <th>Client Rate</th>
                                                <th>Counter Party</th>
                                                <th>Consideration BON</th>
                                                <th>Consideration Client</th>
                                                <th>Profit</th>
                                                <th>Notes</th>
                                                <th>Confirmation</th>
                                                <th>Contact Person</th>
                                            </tr>
                                        </thead>
                                        <tbody className="uk-text-white uk-height-small" data-uk-overflow-auto>
                                            <tr className="uk-text-white">
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr className="uk-text-white" key="grandTotal">
                                                <td colSpan={2}></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                {selectedTab === "transactions-tab" &&
                    <div className="uk-card">
                        <h3 className="main-title-small">Transactions</h3>
                        <div className="uk-card-body">
                            <div className="uk-grid uk-grid-small" data-uk-grid>
                                <div className="sold uk-width-2-5">
                                    <h4>Sold</h4>
                                    <table className="uk-table uk-table-divider">
                                        <thead>
                                            <tr>
                                                <th>Client Name</th>
                                                <th>Counter Party</th>
                                                <th>Nominal</th>
                                                <th>Rate</th>
                                                <th>DTM</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <hr className="uk-divider-vertical uk-margin-left" />
                                <div className="purchased uk-width-2-5">
                                    <h4>Purchased</h4>
                                    <table className="uk-table uk-table-divider">
                                        <thead>
                                            <tr>
                                                <th>Counter Party</th>
                                                <th>Client Name</th>
                                                <th>Nominal</th>
                                                <th>Rate</th>
                                                <th>DTM</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div >
    );
});

export default ViewTreasuryBillModal;

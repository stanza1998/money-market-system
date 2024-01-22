import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { INaturalPerson } from "../../../../shared/models/clients/NaturalPersonModel";

import { IClientBankingDetails, IClientRelatedPartyDetails } from "../../../../shared/models/clients/ClientShared";
import { useAppContext } from "../../../../shared/functions/Context";
import { ILegalEntity } from "../../../../shared/models/clients/LegalEntityModel";

interface IClientAddressProps {
    client: ILegalEntity;
}

export const ClientAddressContactDetail = observer((props: IClientAddressProps) => {
    const { client } = props;

    return (
        <ErrorBoundary>
            <div className="uk-grid uk-grid-small" data-uk-grid>
                <div className="uk-card uk-width-1-2">
                    <div className="uk-card-body">
                        <h4>Address</h4>
                        <div className="uk-grid">
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Address Line 1</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.address1}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Address Line 2</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.address2}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Suburb</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.suburb}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">City</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.city}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Region</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.state}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Country</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.country}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="uk-card uk-width-1-2">
                    <div className="uk-card-body">
                        <h4>Contact Lines</h4>
                        <div className="uk-grid">
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Cellphone No.</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.cellphoneNumber}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Cellphone No. (secondary)</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.cellphoneNumberSecondary}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Email Address</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.emailAddress}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Email Address (secondary)</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.emailAddressSecondary}</p>
                            </div>

                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Phone Number</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.phoneNumber}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-2">
                                <p className="uk-text-bold">Fax</p>
                            </div>
                            <div className="uk-width-1-2">
                                <p>{client.contactDetail.fax}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary >
    );
});

interface IRelatedPartyProps {
    client: ILegalEntity;
}

export const ClientRelatedParty = observer((props: IRelatedPartyProps) => {
    const { client } = props;

    const relatedParties: IClientRelatedPartyDetails[] = client.relatedParty
    console.log(relatedParties);


    return (
        <ErrorBoundary>
            <div className="uk-width-1-2">
                <p>Related Parties</p>
            </div>
            {relatedParties.map((relatedParty, index) => (
                <>
                    <div className="uk-width-1-2">
                        <p>{`${relatedParty.firstName}`}</p>
                    </div>
                    <hr className="uk-width-1-1" />
                </>
            ))}
        </ErrorBoundary >
    );
});

interface IBankAccountDetailProps {
    client: ILegalEntity;
}

export const BankAccountDetails = observer((props: IBankAccountDetailProps) => {
    const { client } = props;
    const bankAccounts: IClientBankingDetails[] = client.bankingDetail
    const { store } = useAppContext();
    const user = store.auth.meJson;
    const hasCreatePermission = user?.feature.some((feature) => feature.featureName === "Client Profile Management" && feature.create === true);


    return (
        <ErrorBoundary>
            <div className="uk-card">
                <div className="uk-card-body">
                    <h4>Bank Account(s)</h4>
                    {hasCreatePermission && <>
                        {
                            bankAccounts.length! < 3 &&
                            <button className="btn btn-primary">Add New Account</button>
                        }
                    </>}
                    <table className="uk-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Bank Name</th>
                                <th>Branc Name</th>
                                <th>Branch Number</th>
                                <th>Account Holder</th>
                                <th>Account Number</th>
                                <th>Account Type</th>
                                <th>Account Verification Status</th>
                                <th>Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bankAccounts.map((account, index) => (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{`${account.bankName}`}</td>
                                    <td>{`${account.branch}`}</td>
                                    <td>{`${account.branchNumber}`}</td>
                                    <td>{`${account.accountHolder}`}</td>
                                    <td>{`${account.accountNumber}`}</td>
                                    <td>{`${account.accountType}`}</td>
                                    <td>{`${account.accountVerificationStatus}`}</td>
                                    <td>
                                        {
                                            account.accountVerificationStatus === "not-verified" &&
                                            <button className="btn btn-primary">verifiy</button>
                                        }
                                        <button className="btn btn-text">edit</button>
                                    </td>
                                </tr>))
                            }
                        </tbody>
                    </table>
                    {/* <OtherClientFormsGrid data={bankAccounts}/> */}
                    <div className="uk-grid uk-grid-small">
                        <ErrorBoundary>
                            {/* {bankAccounts.map((account, index) => (
                                <div className="uk-width-1-2">
                                    <div className="uk-width-1-2">
                                        <p>Bank Name</p>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <p>{`${account.bankName}`}</p>
                                    </div>
                                    <hr className="uk-width-1-1" />
                                    <div className="uk-width-1-2">
                                        <p>Branch Name</p>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <p>{`${account.branch}`}</p>
                                    </div>
                                    <hr className="uk-width-1-1" />

                                    <div className="uk-width-1-2">
                                        <p>Branch Number</p>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <p>{`${account.branchNumber}`}</p>
                                    </div>
                                    <hr className="uk-width-1-1" />
                                    <div className="uk-width-1-2">
                                        <p>Account Holder</p>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <p>{`${account.accountHolder}`}</p>
                                    </div>
                                    <hr className="uk-width-1-1" />
                                    <div className="uk-width-1-2">
                                        <p>Accoount Number</p>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <p>{`${account.accountNumber}`}</p>
                                    </div>
                                    <hr className="uk-width-1-1" />
                                    <div className="uk-width-1-2">
                                        <p>Account Type</p>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <p>{`${account.accountType}`}</p>
                                    </div>
                                    <hr className="uk-width-1-1" />
                                    <div className="uk-width-1-2">
                                        <p>Account Verification Status</p>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <p>{`${account.accountVerificationStatus}`}</p>
                                    </div>
                                    <hr className="uk-width-1-1" />
                                </div>
                            ))} */}
                            {/* 
                            {
                                bankAccounts.map(detail => {
                                    console.log(`Bank Name: ${detail.bankName}`);
                                    console.log(`Branch: ${detail.branch}`);
                                    console.log(`Account Number: ${detail.accountNumber}`);
                                })
                            }
{/* 
                            {
                                client.bankingDetail && client.bankingDetail.map(
                                    account => (
                                        <h4 key={account.accountHolder}>{account.accountNumber}</h4>
                                    )
                                )
                            } */}

                        </ErrorBoundary >
                    </div>
                </div>
            </div>
        </ErrorBoundary >
    );
});
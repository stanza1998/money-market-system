import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { currencyFormat } from '../../../../shared/functions/Directives';
import { INaturalPerson } from "../../../../shared/models/clients/NaturalPersonModel";
import { dateFormat_YY_MM_DD } from "../../../../shared/utils/utils";

interface IPersonalDetailsProps {
    client: INaturalPerson;
}

export const PersonalDetails = (props: IPersonalDetailsProps) => {
    const { client } = props;

    return (
        <ErrorBoundary>
            <div className="uk-grid uk-grid-small" data-uk-grid>

                <div className="uk-card uk-width-1-2">
                    <div className="uk-card-body">
                        <h4>General Information</h4>
                        <div className="uk-grid">
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Client Name:</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{`${client.clientTitle}. ${client.clientName} ${client.clientSurname}`}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Date of Birth:</p>
                            </div>
                            <div className="uk-width-2-3">
                                {
                                    client.dateOfBirth &&
                                    <p>{dateFormat_YY_MM_DD(client.dateOfBirth)}</p>
                                }
                            </div>
                            {
                                client.deceased &&
                                <>
                                    <hr className="uk-width-1-1" />
                                    <div className="uk-width-1-3">
                                        <p className="uk-text-bold">Date of Death:</p>
                                    </div>
                                    <div className="uk-width-2-3">
                                        {
                                            client.dateOfDeath && <p>{`${dateFormat_YY_MM_DD(client.dateOfDeath)}`}</p>
                                        }

                                    </div>
                                </>
                            }
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Nationality:</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{`${client.countryNationality}`}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">ID Type:</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{`${client.idType}`}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">{client.idType === "ID:" ? "ID No." : "Passport No:"}</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{`${client.idNumber}`}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">{client.idType === "ID" ? "ID Issue Country:" : "Passport Issue Country:"}</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{`${client.idCountry}`}</p>
                            </div>
                            {client.idType === "Passport" &&
                                <>
                                    <hr className="uk-width-1-1" />
                                    <div className="uk-width-1-3">
                                        <p className="uk-text-bold">Passport Expiry Date:</p>
                                    </div>
                                    <div className="uk-width-2-3">
                                        <p>{dateFormat_YY_MM_DD(client.idExpiry)}</p>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div className="uk-card uk-width-1-2">
                    <div className="uk-card-body">
                        <h4>KYC</h4>
                        <div className="uk-grid">
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Annual Income:</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{currencyFormat(client.annualIncome)}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Annual Investment Limit:</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{currencyFormat(client.annualInvestmentLimit)}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Single Transaction Limit:</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{currencyFormat(client.singleTransactionLimit)}</p>
                            </div>

                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Risk Rating:</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{client.riskRating}</p>
                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Date Of Last FIA:</p>
                            </div>
                            <div className="uk-width-2-3">
                                {
                                    client.dateOfLastFIA && <p>{dateFormat_YY_MM_DD(client.dateOfLastFIA)}</p>
                                }

                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Date Of Next FIA:</p>
                            </div>
                            <div className="uk-width-2-3">
                                {
                                    client.dateOfNextFIA && <p>{dateFormat_YY_MM_DD(client.dateOfNextFIA)}</p>
                                }

                            </div>
                        </div>
                    </div>
                </div>

                <div className="uk-card uk-width-1-2">
                    <div className="uk-card-body">
                        <h4>Tax Details</h4>
                        <div className="uk-grid">
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">TIN:</p>
                            </div>
                            <div className="uk-width-2-3">
                                {
                                    client.taxDetail.tin && <p>{client.taxDetail.tin}</p>
                                }
                                {
                                    !client.taxDetail.tin && <p className="uk-text-danger">No TIN provided</p>
                                }

                            </div>
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold" >TIN Country Of Issues:</p>
                            </div>
                            <div className="uk-width-2-3">
                                {
                                    client.taxDetail.tinCountryOfIssue &&
                                    <p>{client.taxDetail.tinCountryOfIssue}</p>
                                }
                                {
                                    !client.taxDetail.tinCountryOfIssue &&
                                    <p className="uk-text-danger">No TIN provided</p>
                                }


                            </div>
                            {
                                client.taxDetail.reasonForNoTIN &&
                                <>
                                    <hr className="uk-width-1-1" />
                                    <div className="uk-width-1-3">
                                        <p className="uk-text-bold">Reason for no TIN:</p>
                                    </div>
                                    <div className="uk-width-2-3">
                                        <p>{client.taxDetail.reasonForNoTIN}</p>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

                <div className="uk-card uk-width-1-2">
                    <div className="uk-card-body">
                        <h4>System Information</h4>
                        <div className="uk-grid">
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Client Status:</p>
                            </div>
                            <div className="uk-width-2-3">
                                <p>{client.clientStatus}</p>
                            </div>
                            {client.restricted &&
                                <>
                                    <hr className="uk-width-1-1" />
                                    <div className="uk-width-1-3">
                                        <p className="uk-text-bold">Client Restriction:</p>
                                    </div>
                                    <div className="uk-width-2-3">
                                        <p>{client.reasonForRestriction}</p>
                                    </div>
                                </>
                            }
                            <hr className="uk-width-1-1" />
                            <div className="uk-width-1-3">
                                <p className="uk-text-bold">Date Created:</p>
                            </div>
                            <div className="uk-width-2-3">
                                {
                                    client.dateCreated &&
                                    <p>{dateFormat_YY_MM_DD(client.dateCreated)}</p>
                                }
                            </div>
                            <hr className="uk-width-1-1" />
                            {
                                client.dateDeactivated &&
                                <>
                                    <div className="uk-width-1-3">
                                        <p className="uk-text-bold">Date Deactivated:</p>
                                    </div>
                                    <div className="uk-width-2-3">
                                        {
                                            client.dateDeactivated &&
                                            <p>{client.dateDeactivated}</p>
                                        }
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>

            </div>
        </ErrorBoundary >
    );
};

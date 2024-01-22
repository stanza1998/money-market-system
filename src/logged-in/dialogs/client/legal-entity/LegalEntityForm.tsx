import React, { FormEvent } from "react";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { dateFormat_YY_MM_DD } from "../../../../shared/utils/utils";
import { ILegalEntity } from "../../../../shared/models/clients/LegalEntityModel";
import Toolbar from "../../../shared/toolbar/Toolbar";
import { CountryList } from "../../../../shared/functions/FormHelpers";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";

interface INaturalPersonFormProps {
    client: ILegalEntity;
    setClient: React.Dispatch<React.SetStateAction<ILegalEntity>>;
    onSubmitPersonalDetail: (e: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

export const LegalEntityForm = (props: INaturalPersonFormProps) => {
    const { client, setClient, onSubmitPersonalDetail, onCancel } = props;

    const countryList = CountryList;

    const countryOptions = countryList.map(country => ({
        label: country,
        value: country
    }));

    return (
        <ErrorBoundary>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid
                onSubmit={onSubmitPersonalDetail}>
                <div className="uk-width-1-1 uk-margin-top-small">
                    <hr className="uk-width-1-1" />
                    <Toolbar title={"General Information"}
                    />
                    <hr className="uk-width-1-1" />
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="clientRegisteredName">Registered Name</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="clientRegisteredName"
                            placeholder="e.g Prescient IJG Unit Trust"
                            type="text"
                            value={client.clientRegisteredName}
                            onChange={(e) => setClient({ ...client, clientRegisteredName: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="clientTradingName">Trading Name</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="clientTradingName"
                            placeholder="e.g Prescient IJG"
                            type="text"
                            value={client.clientTradingName}
                            onChange={(e) => setClient({ ...client, clientTradingName: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="legalEntityType">Entity Type</label>
                    <div className="uk-form-controls">
                        <select
                            className="uk-select uk-form-small"
                            value={client.legalEntityType}
                            id="legalEntityType"
                            onChange={(e) => setClient({ ...client, legalEntityType: e.target.value })}
                            required
                        >
                            <option value={""} disabled>Select...</option>
                            <option value="Limited Company">Limited Company</option>
                            <option value="Trust">Trust</option>
                            <option value="Closed Corp">Closed Corp</option>
                            <option value="Body Corporate">Body Corporate</option>
                            <option value="SOE">SOE</option>
                            <option value="NGO">NGO</option>
                            <option value="Section 21">Section 21</option>
                        </select>
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="yearEnd">Year End</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="yearEnd"
                            type="date"
                            value={dateFormat_YY_MM_DD(client.yearEnd)}
                            onChange={(e) => setClient({ ...client, yearEnd: new Date(e.target.value).getTime() })}
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="registrationNumber">Registration Number</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="registrationNumber"
                            placeholder="e.g 2020/066"
                            type="text"
                            value={client.registrationNumber}
                            onChange={(e) => setClient({ ...client, registrationNumber: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="registrationDate">Registration Date</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="registrationDate"
                            type="date"
                            value={dateFormat_YY_MM_DD(client.registrationDate)}
                            onChange={(e) => setClient({ ...client, registrationDate: new Date(e.target.value).getTime() })}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="countryOfRegistration">Country Of Registration</label>
                    <div className="uk-form-controls">
                        <SingleSelect
                            options={countryOptions}
                            name="country"
                            value={client.countryOfRegistration}
                            onChange={(value) => setClient({ ...client, countryOfRegistration: value })}
                            placeholder="Country"
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="dateCreated">Date Created</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="dateCreated"
                            type="date"
                            value={dateFormat_YY_MM_DD(client.dateCreated)}
                            onChange={(e) => setClient({ ...client, dateCreated: new Date(e.target.value).getTime() })}
                            required
                        />
                    </div>
                </div>

                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="dateDeactivated">Date Deactivated</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="dateDeactivated"
                            type="date"
                            value={dateFormat_YY_MM_DD(client.dateDeactivated)}
                            onChange={(e) => setClient({ ...client, dateDeactivated: new Date(e.target.value).getTime() })}
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="listed">Listed</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="listed"
                            placeholder="NSX"
                            type="text"
                            value={client.listed || ""}
                            onChange={(e) => setClient({ ...client, listed: e.target.value })}
                        />
                    </div>
                </div>
                <div className="uk-width-1-1 uk-text-right">
                    <button
                        className="btn-text uk-margin-right"
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        type="submit"
                    >
                        Next
                    </button>
                </div>
            </form>
        </ErrorBoundary >
    );
};

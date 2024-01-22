import { FormEvent } from "react";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import SingleSelect from "../../../../../shared/components/single-select/SingleSelect";
import { toTitleCase } from "../../../../../shared/functions/Directives";
import { INaturalPerson } from "../../../../../shared/models/clients/NaturalPersonModel";
import { NationalityList, CountryList } from "../../../../../shared/functions/FormHelpers";
import Toolbar from "../../../../shared/toolbar/Toolbar";

interface IPersonalDetailsFormProps {
    client: INaturalPerson;
    setClient: React.Dispatch<React.SetStateAction<INaturalPerson>>;
    onSubmitPersonalDetail: (e: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

export const PersonalDetailsForm = (props: IPersonalDetailsFormProps) => {
    const { client, setClient, onSubmitPersonalDetail, onCancel } = props;

    const nationalities = NationalityList;
    const countries = CountryList;

    const nationalityOptions = nationalities.map(nationality => ({
        label: toTitleCase(nationality),
        value: toTitleCase(nationality)
    }));

    const countryOptions = countries.map(country => ({
        label: toTitleCase(country),
        value: toTitleCase(country)
    }));

    return (
        <ErrorBoundary>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid
                onSubmit={onSubmitPersonalDetail}>
                <div className="uk-width-1-1 uk-margin-top-small">
                    <hr className="uk-width-1-1" />
                    <Toolbar title={"Personal Details"}
                    />
                    <hr className="uk-width-1-1" />
                </div>
                <div className="uk-width-1-3">
                    <label className="uk-form-label required" htmlFor="clientTitle">Client Title</label>
                    <div className="uk-form-controls">
                        <select
                            className="uk-select uk-form-small"
                            value={client.clientTitle}
                            id="clientTitle"
                            onChange={(e) => setClient({ ...client, clientTitle: e.target.value })}
                            required
                        >
                            <option value={""} disabled>Select...</option>
                            <option value="Mr">Mr</option>
                            <option value="Ms">Ms</option>
                            <option value="Mrs">Mrs</option>
                            <option value="Dr">Dr</option>
                        </select>
                    </div>
                </div>
                <div className="uk-width-1-3">
                    <label className="uk-form-label required" htmlFor="client-name">Client Name</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="client-name"
                            placeholder="Client Name"
                            type="text"
                            value={client.clientName}
                            onChange={(e) => setClient({ ...client, clientName: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-3">
                    <label className="uk-form-label required" htmlFor="client-surname">Client Surname</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="client-surname"
                            placeholder="Client Surname"
                            type="text"
                            value={client.clientSurname}
                            onChange={(e) => setClient({ ...client, clientSurname: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="dateOfBirth">Date Of Birth</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="dateOfBirth"
                            type="date"
                            value={client.dateOfBirth}
                            onChange={(e) => setClient({ ...client, dateOfBirth: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="Nationality">Nationality</label>
                    <div className="uk-form-controls">
                        <SingleSelect
                            options={nationalityOptions}
                            name="nationality"
                            value={client.countryNationality}
                            onChange={(value) => setClient({ ...client, countryNationality: value })}
                            placeholder="Namibian"
                            required
                        />
                    </div>
                </div>
                <div className={`${client.idType === "ID" ? "uk-width-1-3" : "uk-width-1-4"}`}>
                    <label className="uk-form-label required" htmlFor="idType">ID Type</label>
                    <div className="uk-form-controls">
                        <select
                            className="uk-select uk-form-small"
                            value={client.idType}
                            id="idType"
                            onChange={(e) => setClient({ ...client, idType: e.target.value })}
                            required
                        >
                            <option value="ID">ID</option>
                            <option value="Passport">Passport</option>
                        </select>
                    </div>
                </div>
                <div className={`${client.idType === "ID" ? "uk-width-1-3" : "uk-width-1-4"}`}>
                    <label className="uk-form-label required" htmlFor="idNumber">{client.idType === "ID" ? "ID Number" : "Passport Number"}</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="idNumber"
                            placeholder={client.idType === "ID" ? "ID" : "Passport No"}
                            type="text"
                            value={client.idNumber}
                            onChange={(e) => setClient({ ...client, idNumber: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className={`${client.idType === "ID" ? "uk-width-1-3" : "uk-width-1-4"}`}>
                    <label className="uk-form-label required" htmlFor="idCountry">ID Country</label>
                    <div className="uk-form-controls">
                        <SingleSelect
                            options={countryOptions}
                            name="idCountry"
                            value={client.idCountry}
                            onChange={(value) => setClient({ ...client, idCountry: value })}
                            placeholder="Namibia"
                            required
                        />
                    </div>
                </div>
                {client.idType === "Passport" &&
                    <div className="uk-width-1-4">
                        <label className="uk-form-label required" htmlFor="passportExpiry">Passport Expiry Date</label>
                        <div className="uk-form-controls">
                            <input
                                className="uk-input uk-form-small"
                                id="passportExpiry"
                                type="date"
                                value={client.idExpiry}
                                onChange={(e) => setClient({ ...client, idExpiry: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                }
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="dateCreated">Date Created</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="dateCreated"
                            type="date"
                            // value={client.dateCreated.getDate()}
                            onChange={(e) => setClient({ ...client, dateCreated: e.target.value })}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="dateDeactivated">Date Deactivated</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-input uk-form-small"
                            id="dateDeactivated"
                            type="date"
                            value={client.dateDeactivated}
                            onChange={(e) => setClient({ ...client, dateDeactivated: e.target.value })}
                        />
                    </div>
                </div>


                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="clientStatus">Client Status</label>
                    <div className="uk-form-controls">
                        <select
                            className="uk-select uk-form-small"
                            value={client.clientStatus}
                            id="clientStatus"
                            onChange={(e) => setClient({ ...client, clientStatus: e.target.value })}
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Closed">Closed</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                <div className="uk-width-1-1">
                    <label className="uk-form-label" htmlFor="deceased">Deceased</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-checkbox"
                            id="deceased"
                            type="checkbox"
                            checked={client.deceased}
                            onChange={(e) => setClient({ ...client, deceased: e.target.checked })}
                        />
                    </div>
                    {client.deceased && (
                        <div className="uk-form-controls">
                            <input
                                className="uk-input uk-form-small"
                                id="dateOfDeath"
                                type="date"
                                value={client.dateOfDeath} // Ensure it's either a valid date string or an empty string
                                onChange={(e) => setClient({ ...client, dateOfDeath: e.target.value })}
                                required
                            />
                        </div>
                    )}
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

import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import { CountryDialingCodeList, CountryList, NamibiaRegionList } from "../../../../../shared/functions/FormHelpers";
import SingleSelect from "../../../../../shared/components/single-select/SingleSelect";
import { INaturalPerson } from "../../../../../shared/models/clients/NaturalPersonModel";
import { FormEvent, useState } from "react";
import Toolbar from "../../../../shared/toolbar/Toolbar";

interface IContactDetailsFormProps {
    client: INaturalPerson;
    setClient: React.Dispatch<React.SetStateAction<INaturalPerson>>;
    onSubmitContactDetail: (e: FormEvent<HTMLFormElement>) => void;
    onBackToPersonalDetail: () => void;
}

export const ContactDetailsForm = observer((props: IContactDetailsFormProps) => {
    const { client, setClient, onSubmitContactDetail, onBackToPersonalDetail } = props;

    const [userInput, setUserInput] = useState('');
    const [isValid, setIsValid] = useState(false);

    const [userInputSecondary, setUserInputSecondary] = useState('');
    const [isValidSecondary, setIsValidSecondary] = useState(false);

    const namibiaRegions = NamibiaRegionList;

    const regionOptions = namibiaRegions.map(region => ({
        label: region,
        value: region
    }));

    const countryList = CountryList;

    const countryOptions = countryList.map(country => ({
        label: country,
        value: country
    }));

    const onChange = (name: | "address1" | "address2" | "suburb" | "city" | "region" |
        "country" | "phoneNumber" | "cellphoneNumber" | "cellphoneNumberSecondary" | "emailAddressSecondary" | "fax" | "emailAddress", value: string) => {
        const contact = { ...client.contactDetail };

        if (name === "address1") {
            contact.address1 = value;
        }

        if (name === "address2") {
            contact.address2 = value;
        }

        if (name === "suburb") {
            contact.suburb = value;
        }

        if (name === "city") {
            contact.city = value;
        }

        if (name === "region") {
            contact.state = value;
        }

        if (name === "country") {
            contact.country = value;
        }

        if (name === "phoneNumber") {
            contact.phoneNumber = value;
        }

        if (name === "cellphoneNumber") {
            const inputValue = value;
            setUserInput(inputValue);
            // Define the regex pattern
            const regexPattern = /^\+264\d{9}$/;
            // Test if the input matches the pattern
            setIsValid(regexPattern.test(inputValue));
            contact.cellphoneNumber = value;
        }

        if (name === "cellphoneNumberSecondary") {
            const inputValue = value;
            setUserInputSecondary(inputValue);
            // Define the regex pattern
            const regexPattern = /^\+264\d{9}$/;
            // Test if the input matches the pattern
            setIsValidSecondary(regexPattern.test(inputValue));

            contact.cellphoneNumberSecondary = value;

        }

        if (name === "fax") {
            contact.fax = value;
        }

        if (name === "emailAddress") {
            contact.emailAddress = value;
        }

        if (name === "emailAddressSecondary") {
            contact.emailAddressSecondary = value;
        }

        setClient({ ...client, contactDetail: contact });
    };

    return (
        <ErrorBoundary>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid
                onSubmit={onSubmitContactDetail}>
                <div className="uk-width-1-1 uk-margin-top-small">
                    <hr className="uk-width-1-1" />
                    <Toolbar title={"Contact Details"}
                    />
                    <hr className="uk-width-1-1" />
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="address1">Address Line 1</label>
                    <div className="uk-form-controls">
                        <input
                            id="address1"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.address1}
                            name={"address1"}
                            onChange={(e) => onChange("address1", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="address2">Address Line 2</label>
                    <div className="uk-form-controls">
                        <input
                            id="address2"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.address2}
                            name={"address2"}
                            onChange={(e) => onChange("address2", e.target.value)}
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="suburb">Suburb</label>
                    <div className="uk-form-controls">
                        <input
                            id="suburb"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.suburb}
                            name={"suburb"}
                            onChange={(e) => onChange("suburb", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="city">City</label>
                    <div className="uk-form-controls">
                        <input
                            id="city"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.city}
                            name={"city"}
                            onChange={(e) => onChange("city", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="region">Region</label>
                    <div className="uk-form-controls">
                        <SingleSelect
                            options={regionOptions}
                            name="region"
                            value={client.contactDetail.state}
                            onChange={(value) => onChange("region", value)}
                            placeholder="Khomas"
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="country">Country</label>
                    <div className="uk-form-controls">
                        <SingleSelect
                            options={countryOptions}
                            name="country"
                            value={client.contactDetail.state}
                            onChange={(value) => onChange("country", value)}
                            placeholder="Country"
                            required
                        />
                    </div>
                </div>

                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="cellphoneNumber">Cellphone Number</label>
                    <input
                        id="cellphoneNumber"
                        className="uk-input uk-form-small"
                        type="text"
                        placeholder="+264815534382"
                        value={client.contactDetail.cellphoneNumber}
                        name={"cellphoneNumber"}
                        onChange={(e) => onChange("cellphoneNumber", e.target.value)}
                        required

                        minLength={13}
                        maxLength={13}
                    />
                    {
                        isValid &&
                        <p className="valid uk-text-success">Valid cellphone number format</p>
                    }
                    {
                        !isValid && client.contactDetail.cellphoneNumber.length > 10 &&
                        <p className="invalid uk-text-danger">Cellphone number format is not valid, the number should start with +264 and should be 12 characters long excluding (+)</p>
                    }
                </div>

                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="cellphoneNumber">Cellphone Number (secondary)</label>
                    <input
                        id="cellphoneNumberSecondary"
                        className="uk-input uk-form-small"
                        type="text"
                        placeholder="+264815534382"
                        value={client.contactDetail.cellphoneNumberSecondary}
                        name={"cellphoneNumberSecondary"}
                        onChange={(e) => onChange("cellphoneNumberSecondary", e.target.value)}
                        minLength={13}
                        maxLength={13}
                    />
                    {
                        isValidSecondary &&
                        <p className="valid uk-text-success">Valid cellphone number format</p>
                    }
                    {
                        !isValidSecondary && client.contactDetail.cellphoneNumberSecondary.length > 10 &&
                        <p className="invalid uk-text-danger">Cellphone number format is not valid, the number should start with +264 and should be 12 characters long excluding (+)</p>
                    }
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="emailAddress">Email Address</label>
                    <div className="uk-form-controls">
                        <input
                            id="emailAddress"
                            className="uk-input uk-form-small"
                            type="email"
                            value={client.contactDetail.emailAddress}
                            name={"emailAddress"}
                            onChange={(e) => onChange("emailAddress", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="emailAddressSecondary">Email Address (secondary)</label>
                    <div className="uk-form-controls">
                        <input
                            id="emailAddressSecondary"
                            className="uk-input uk-form-small"
                            type="email"
                            value={client.contactDetail.emailAddressSecondary}
                            name={"emailAddressSecondary"}
                            onChange={(e) => onChange("emailAddressSecondary", e.target.value)}
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="phoneNumber">Phone Number</label>
                    <div className="uk-form-controls">
                        <input
                            id="phoneNumber"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.phoneNumber}
                            name={"phoneNumber"}
                            onChange={(e) => onChange("phoneNumber", e.target.value)}
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="fax">Fax</label>
                    <div className="uk-form-controls">
                        <input
                            id="fax"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.fax}
                            name={"fax"}
                            onChange={(e) => onChange("fax", e.target.value)}
                        />
                    </div>
                </div>
                <div className="uk-width-1-1 uk-text-right">
                    <button
                        className="btn-text uk-margin-right"
                        type="button"
                        onClick={onBackToPersonalDetail}
                    >
                        Back
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
});
import { observer } from "mobx-react-lite";
import { ChangeEvent, FormEvent, useState } from "react";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { ILegalEntity } from "../../../../shared/models/clients/LegalEntityModel";
import { runInAction } from "mobx";
import { IClientBankingDetails, IClientRelatedPartyDetails } from "../../../../shared/models/clients/ClientShared";
import { RelatedPartyItem } from "./RelatedPartyItem";
import { BankingDetailsItem } from "./BankingDetailsItem";
import Toolbar from "../../../shared/toolbar/Toolbar";
import { NamibiaRegionList, CountryList } from "../../../../shared/functions/FormHelpers";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../../shared/functions/Context";

interface IClientAddressProps {
    client: ILegalEntity;
    setClient: React.Dispatch<React.SetStateAction<ILegalEntity>>;
    onSubmitContactDetail: (e: FormEvent<HTMLFormElement>) => void;
    onBackToPersonalDetail: () => void;
}

export const ClientAddressContactDetail = observer((props: IClientAddressProps) => {

    const [userInput, setUserInput] = useState('');
    const [isValid, setIsValid] = useState(false);

    const [userInputSecondary, setUserInputSecondary] = useState('');
    const [isValidSecondary, setIsValidSecondary] = useState(false);

    const [userContactInput, setUserContactInput] = useState('');
    const [isContactValid, setIsContactValid] = useState(false);

    const [userContactAltInput, setUserContactAltInput] = useState('');
    const [isContactAltValid, setIsContactAltValid] = useState(false);

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

    const { client, setClient, onSubmitContactDetail, onBackToPersonalDetail } = props;

    const onChange = (name: | "address1" | "address2" | "suburb" | "city" | "region" |
        "country" | "phoneNumber" | "cellphoneNumber" | "cellphoneNumberSecondary" | "contactPersonName" | "contactPersonNameAlt" | "contactPersonCellphone" | "contactPersonCellphoneAlt" | "emailAddressSecondary" | "fax" | "emailAddress", value: string) => {
        const contact = { ...client.contactDetail };
        const contactPerson = { ...client.contactPerson };
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

        if (name === "contactPersonName") {
            contactPerson.contactPersonName = value;
        }
        if (name === "contactPersonCellphone") {
            const inputValue = value;
            setUserContactInput(inputValue);
            // Define the regex pattern
            const regexPattern = /^\+264\d{9}$/;
            // Test if the input matches the pattern
            setIsContactValid(regexPattern.test(inputValue));


            contactPerson.contactPersonCellphone = value;
        }

        if (name === "contactPersonNameAlt") {
            contactPerson.contactPersonNameAlt = value;
        }
        if (name === "contactPersonCellphoneAlt") {
            const inputValue = value;
            setUserContactAltInput(inputValue);
            // Define the regex pattern
            const regexPattern = /^\+264\d{9}$/;
            // Test if the input matches the pattern
            setIsContactAltValid(regexPattern.test(inputValue));


            contactPerson.contactPersonCellphoneAlt = value;
        }

        setClient({ ...client, contactDetail: contact, contactPerson: contactPerson });
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
                            name={"tin"}
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
                            name={"tin"}
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
                    <label className="uk-form-label required" htmlFor="contactPersonName">Contact Person Name</label>
                    <div className="uk-form-controls">
                        <input
                            id="contactPersonName"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactPerson.contactPersonName}
                            name={"contactPersonName"}
                            onChange={(e) => onChange("contactPersonName", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="contactPersonCellphone">Contact Person Cellphone</label>
                    <div className="uk-form-controls">
                        <input
                            id="contactPersonCellphone"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactPerson.contactPersonCellphone}
                            name={"contactPersonCellphone"}
                            onChange={(e) => onChange("contactPersonCellphone", e.target.value)}
                            required
                            minLength={13}
                            maxLength={13}
                        />
                        {
                            isContactValid &&
                            <p className="valid uk-text-success">Valid cellphone number format</p>
                        }
                        {
                            !isContactValid && client.contactPerson.contactPersonCellphone.length > 10 &&
                            <p className="invalid uk-text-danger">Cellphone number format is not valid, the number should start with +264 and should be 12 characters long excluding (+)</p>
                        }
                    </div>
                </div>

                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="contactPersonNameAlt">Contact Person Name (secondary)</label>
                    <div className="uk-form-controls">
                        <input
                            id="contactPersonNameAlt"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactPerson.contactPersonNameAlt}
                            name={"contactPersonName"}
                            onChange={(e) => onChange("contactPersonNameAlt", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="contactPersonCellphoneAlt">Contact Person Cellphone (secondary)</label>
                    <div className="uk-form-controls">
                        <input
                            id="contactPersonCellphoneAlt"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactPerson.contactPersonCellphoneAlt}
                            name={"contactPersonCellphoneAlt"}
                            onChange={(e) => onChange("contactPersonCellphoneAlt", e.target.value)}
                            required
                            minLength={13}
                            maxLength={13}
                        />
                        {
                            isContactAltValid &&
                            <p className="valid uk-text-success">Valid cellphone number format</p>
                        }
                        {
                            !isContactAltValid && client.contactPerson.contactPersonCellphoneAlt.length > 10 &&
                            <p className="invalid uk-text-danger">Cellphone number format is not valid, the number should start with +264 and should be 12 characters long excluding (+)</p>
                        }
                    </div>
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

interface ITaxDetailProps {
    client: ILegalEntity;
    setClient: React.Dispatch<React.SetStateAction<ILegalEntity>>;
    onSubmitTaxDetail: (e: FormEvent<HTMLFormElement>) => void;
    onBackToAccountDetail: () => void;
}

export const ClientTaxDetail = observer((props: ITaxDetailProps) => {
    const { client, setClient, onSubmitTaxDetail, onBackToAccountDetail } = props;

    const onChange = (name: | "tin" | "tinCountryOfIssue" | "vatNumber" | "reasonForNoTIN", value: string) => {
        const taxDetail = { ...client.taxDetail };
        if (name === "tin") {
            taxDetail.tin = value;
        }
        if (name === "tinCountryOfIssue") {
            taxDetail.tinCountryOfIssue = value;
        }
        if (name === "vatNumber") {
            taxDetail.vatNumber = value;
        }
        if (name === "reasonForNoTIN") {
            taxDetail.reasonForNoTIN = value;
        }
        setClient({ ...client, taxDetail: taxDetail });
    };

    return (
        <ErrorBoundary>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid
                onSubmit={onSubmitTaxDetail}>
                <div className="uk-width-1-1 uk-margin-top-small">
                    <hr className="uk-width-1-1" />
                    <Toolbar title={"Tax Details"}
                    />
                    <hr className="uk-width-1-1" />
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="tin">TIN</label>
                    <div className="uk-form-controls">
                        <input
                            id="tin"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.taxDetail.tin}
                            name={"tin"}
                            onChange={(e) => onChange("tin", e.target.value)}
                            required={client.legalEntityType === "Section 21" || client.legalEntityType === "NGO"}
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="tinCountryOfIssue">TIN Country Of Issue</label>
                    <div className="uk-form-controls">
                        <input
                            id="tinCountryOfIssue"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.taxDetail.tinCountryOfIssue}
                            name={"tinCountryOfIssue"}
                            onChange={(e) => onChange("tinCountryOfIssue", e.target.value)}
                            required={client.legalEntityType === "Section 21" || client.legalEntityType === "NGO"}
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="vatNumber">VAT Number</label>
                    <div className="uk-form-controls">
                        <input
                            id="vatNumber"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.taxDetail.vatNumber}
                            name={"vatNumber"}
                            onChange={(e) => onChange("vatNumber", e.target.value)}
                        />
                    </div>
                </div>
                {
                    (client.legalEntityType === "Section 21" || client.legalEntityType === "NGO") &&
                    <div className="uk-width-1-2">
                        <label className="uk-form-label required" htmlFor="reasonForNoTIN">Reason For No TIN</label>
                        <div className="uk-form-controls">
                            <input
                                id="reasonForNoTIN"
                                className="uk-input uk-form-small"
                                type="text"
                                value={client.taxDetail.reasonForNoTIN}
                                name={"reasonForNoTIN"}
                                onChange={(e) => onChange("reasonForNoTIN", e.target.value)}
                            />
                        </div>
                    </div>
                }
                <div className="uk-width-1-1 uk-text-right">
                    <button
                        className="btn-text uk-margin-right"
                        type="button"
                        onClick={onBackToAccountDetail}
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
        </ErrorBoundary>
    );
});


interface IRelatedPartyProps {
    client: ILegalEntity;
    setClient: React.Dispatch<React.SetStateAction<ILegalEntity>>;
    onSubmitRelatedParty: (e: FormEvent<HTMLFormElement>) => void;
    onBackToTaxDetail: () => void;
    loading: boolean;
}

export const ClientRelatedParty = observer((props: IRelatedPartyProps) => {

    const { client, setClient, onSubmitRelatedParty, onBackToTaxDetail, loading } = props;

    const { store } = useAppContext();
    const user = store.auth.meJson;

    const hasCreatePersmission = user?.feature.some((feature) => feature.featureName === "Client Profile Management" && feature.create === true);

    const hasEditingPermission = user?.feature.some((feature) => feature.featureName === "Client Profile Management" && feature.update === true);


    const onAddItem = () => {
        const newItem: IClientRelatedPartyDetails = {
            firstName: "",
            surname: "",
            idNumber: "",
            relationship: "",
            riskRating: "",
        };
        const related = client.relatedParty;
        related.push(newItem);
        setClient({ ...client, relatedParty: related });
        console.log(client.relatedParty);

    };

    const onItemChange = (index: number) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        runInAction(() => {
            const related = client.relatedParty;
            const name = e.target.name;
            const value = e.target.value;
            related[index] = { ...related[index], [name]: value };
            setClient({ ...client, relatedParty: related });
        })
    };

    const onItemRemove = (index: number) => {
        const related = client.relatedParty;
        related.splice(index, 1);
        setClient({ ...client, relatedParty: related });
    };

    return (
        <ErrorBoundary>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid
                onSubmit={onSubmitRelatedParty}>
                <div className="uk-width-1-1 uk-margin-top-small">
                    <hr className="uk-width-1-1" />
                    <Toolbar title={"Related Parties"} rightControls={
                        <>
                            {hasCreatePersmission && client.relatedParty.length !== 3 &&
                                <button className="btn btn-primary uk-margin" type="button"
                                    onClick={onAddItem}>
                                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                                    Related party
                                </button>
                            }

                        </>
                    }
                    />
                    <hr className="uk-width-1-1" />
                </div>
                {client.relatedParty.map((item, index) => (
                    <RelatedPartyItem
                        key={index}
                        index={index}
                        onItemChange={onItemChange}
                        onItemRemove={onItemRemove}
                        firstName={item.firstName || ""}
                        surname={item.surname || ""}
                        idNumber={item.idNumber || ""}
                        relationship={item.relationship || ""} 
                        riskRating={item.riskRating || ""}
                    />
                ))}

                <div className="uk-width-1-1 uk-text-right">
                    <button
                        className="btn-text uk-margin-right"
                        type="button"
                        onClick={onBackToTaxDetail}
                    >
                        Back
                    </button>
                    <button className="btn btn-primary" type="submit" disabled={loading} >
                        Save {loading && <div data-uk-spinner="ratio: .5"></div>}
                    </button>
                </div>
            </form>
        </ErrorBoundary >
    );
});

interface IBankAccountDetailProps {
    client: ILegalEntity;
    setClient: React.Dispatch<React.SetStateAction<ILegalEntity>>;
    onSubmitAccountDetail: (e: FormEvent<HTMLFormElement>) => void;
    onBackToContactDetail: () => void;
}

export const BankAccountDetails = observer((props: IBankAccountDetailProps) => {
    const { client, setClient, onSubmitAccountDetail, onBackToContactDetail } = props;

    const { store } = useAppContext();
    const user = store.auth.meJson;

    const hasCreatePersmission = user?.feature.some((feature) => feature.featureName === "Client Profile Management" && feature.create === true);

    const hasEditingPermission = user?.feature.some((feature) => feature.featureName === "Client Profile Management" && feature.update === true);

    const onAddItem = () => {
        const newItem: IClientBankingDetails = {
            bankName: "",
            branch: "",
            branchNumber: "",
            accountHolder: "",
            accountType: "",
            accountNumber: "",
            accountVerificationStatus: "Pending"
        };
        const bankAccount = client.bankingDetail;
        bankAccount.push(newItem);
        setClient({ ...client, bankingDetail: bankAccount });
    };

    const onItemChange = (index: number) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        runInAction(() => {
            const bankAccount = client.bankingDetail;
            const name = e.target.name;
            const value = e.target.value;
            bankAccount[index] = { ...bankAccount[index], [name]: value };
            setClient({ ...client, bankingDetail: bankAccount });
        })
    };

    const onItemRemove = (index: number) => {
        const bankAccount = client.bankingDetail;
        bankAccount.splice(index, 1);
        setClient({ ...client, bankingDetail: bankAccount });
    };


    return (
        <ErrorBoundary>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid
                onSubmit={onSubmitAccountDetail}>
                <div className="uk-width-1-1 uk-margin-top-small">
                    <hr className="uk-width-1-1" />
                    <Toolbar title={"Banking Details"} rightControls={
                        <>
                            {hasCreatePersmission && client.relatedParty.length !== 3 &&
                                <button className="btn btn-primary uk-margin" type="button"
                                    onClick={onAddItem}>
                                    <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                                    Bank account
                                </button>
                            }

                        </>
                    }
                    />
                    <hr className="uk-width-1-1" />
                </div>

                {client.bankingDetail.map((item, index) => (
                    <BankingDetailsItem
                        key={index}
                        index={index}
                        onItemChange={onItemChange}
                        onItemRemove={onItemRemove}
                        accountNumber={item.accountNumber}
                        accountHolder={item.accountHolder}
                        accountType={item.accountType}
                        bankName={item.bankName}
                        branch={item.branch}
                        branchNumber={item.branchNumber}
                    />
                ))}

                <div className="uk-width-1-1 uk-text-right">
                    <button
                        className="btn-text uk-margin-right"
                        type="button"
                        onClick={onBackToContactDetail}
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
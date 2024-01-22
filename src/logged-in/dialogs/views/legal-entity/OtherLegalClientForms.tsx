import { observer } from "mobx-react-lite";
import { ChangeEvent } from "react";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import { ILegalEntity } from "../../../../shared/models/clients/LegalEntityModel";
import { runInAction } from "mobx";
import { IClientBankingDetails, IClientRelatedPartyDetails } from "../../../../shared/models/clients/ClientShared";
import { RelatedPartyItem } from "./RelatedPartyItem";
import { BankingDetailsItem } from "./BankingDetailsItem";

interface IClientAddressProps {
    client: ILegalEntity;
    setClient: React.Dispatch<React.SetStateAction<ILegalEntity>>;
}

export const ClientAddressContactDetail = observer((props: IClientAddressProps) => {
    const { client, setClient } = props;

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
            contact.cellphoneNumber = value;
        }
        if (name === "cellphoneNumberSecondary") {
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
            contactPerson.contactPersonCellphone = value;
        }

        if (name === "contactPersonNameAlt") {
            contactPerson.contactPersonNameAlt = value;
        }
        if (name === "contactPersonCellphoneAlt") {
            contactPerson.contactPersonCellphoneAlt = value;
        }

        setClient({ ...client, contactDetail: contact, contactPerson: contactPerson });
    };

    return (
        <ErrorBoundary>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid>
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
                        <input
                            id="region"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.state}
                            name={"region"}
                            onChange={(e) => onChange("region", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="country">Country</label>
                    <div className="uk-form-controls">
                        <input
                            id="country"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.country}
                            name={"country"}
                            onChange={(e) => onChange("country", e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="uk-width-1-2">
                    <label className="uk-form-label required" htmlFor="cellphoneNumber">Cellphone Number</label>
                    <div className="uk-form-controls">
                        <input
                            id="cellphoneNumber"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.cellphoneNumber}
                            name={"cellphoneNumber"}
                            onChange={(e) => onChange("cellphoneNumber", e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="uk-width-1-2">
                    <label className="uk-form-label" htmlFor="cellphoneNumberSecondary">Cellphone Number (secondary)</label>
                    <div className="uk-form-controls">
                        <input
                            id="cellphoneNumberSecondary"
                            className="uk-input uk-form-small"
                            type="text"
                            value={client.contactDetail.cellphoneNumberSecondary}
                            name={"cellphoneNumberSecondary"}
                            onChange={(e) => onChange("cellphoneNumberSecondary", e.target.value)}
                        />
                    </div>
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
                        />
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
                        />
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
            </form>
        </ErrorBoundary >
    );
});

interface ITaxDetailProps {
    client: ILegalEntity;
    setClient: React.Dispatch<React.SetStateAction<ILegalEntity>>;
}

export const ClientTaxDetail = observer((props: ITaxDetailProps) => {
    const { client, setClient } = props;

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
            <form className="uk-form-stacked uk-grid-small" data-uk-grid>
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
                            required
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
                            required
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
            </form>
        </ErrorBoundary>
    );
});


interface IRelatedPartyProps {
    client: ILegalEntity;
    setClient: React.Dispatch<React.SetStateAction<ILegalEntity>>;
}

export const ClientRelatedParty = observer((props: IRelatedPartyProps) => {
    const { client, setClient } = props;

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
        console.log(client.relatedParty);
    };

    return (
        <ErrorBoundary>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid>
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
            </form>
        </ErrorBoundary >
    );
});

interface IBankAccountDetailProps {
    client: ILegalEntity;
    setClient: React.Dispatch<React.SetStateAction<ILegalEntity>>;
}

export const BankAccountDetails = observer((props: IBankAccountDetailProps) => {
    const { client, setClient } = props;

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
            <form className="uk-form-stacked uk-grid-small" data-uk-grid>
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
            </form>
        </ErrorBoundary >
    );
});
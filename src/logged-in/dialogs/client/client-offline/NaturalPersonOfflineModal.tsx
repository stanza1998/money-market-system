import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId, { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import { IEntityId } from "../../../../shared/models/clients/EntityIdModel";
import { generateNextValue } from "../../../../shared/utils/utils";

import swal from "sweetalert";
import { PersonalDetailsForm } from "./forms/PersonalDetailsForm";
import { FICA } from "./forms/FICAForm";
import { ContactDetailsForm } from "./forms/ContactDetailsForm";
import { BankAccountDetailsForm } from "./forms/BankAccountDetailsForm";
import { TaxDetailsForm } from "./forms/TaxDetailsForm";
import { RelatedPartyDetailsForm } from "./forms/RelatedPartyDetailsForm";
import { INaturalPerson, defaultNaturalPerson } from "../../../../shared/models/clients/NaturalPersonModel";

interface ITabsProps {
    tab: "Personal" | "Contact" | "Banking" | "FICA" | "Tax" | "Related";
    setTab: React.Dispatch<React.SetStateAction<"Personal" | "Contact" | "Banking" | "FICA" | "Tax" | "Related">>;
}
const Tabs = (props: ITabsProps) => {
    const activeClass = (tab: "Personal" | "Contact" | "Banking" | "FICA" | "Tax" | "Related") => {
        if (props.tab === tab) return "uk-active";
        return "";
    };

    return (
        <div className="uk-margin-small-bottom">
            <ul className="kit-tabs" data-uk-tab>
                <li
                    className={activeClass("Personal")}
                    onClick={() => props.setTab("Personal")}
                >
                    <a href="void(0)">Personal Details</a>
                </li>
                <li
                    className={activeClass("Contact")}
                    onClick={() => props.setTab("Contact")}
                >
                    <a href="void(0)">Contact Detail</a>
                </li>
                <li
                    className={activeClass("Banking")}
                    onClick={() => props.setTab("Banking")}
                >
                    <a href="void(0)">Banking Detail</a>
                </li>
                <li
                    className={activeClass("FICA")}
                    onClick={() => props.setTab("FICA")}
                >
                    <a href="void(0)">FICA</a>
                </li>
                <li
                    className={activeClass("Tax")}
                    onClick={() => props.setTab("Tax")}
                >
                    <a href="void(0)">Tax Detail</a>
                </li>
                <li
                    className={activeClass("Related")}
                    onClick={() => props.setTab("Related")}
                >
                    <a href="void(0)">Related Party</a>
                </li>
            </ul>
        </div>
    );
};

const NaturalPersonOfflineModal = observer(() => {

    const { api, store } = useAppContext();

    const [tab, setTab] = useState<"Personal" | "Contact" | "Banking" | "FICA" | "Tax" | "Related">("Personal");
    const [loading, setLoading] = useState(false);
    const [client, setClient] = useState<INaturalPerson>({ ...defaultNaturalPerson });
    const [entityId, setEntityId] = useState("");
    const [currentId, setCurrentId] = useState("");
    const selected = store.client.naturalPerson.selected;

    const onSubmitRelatedParty = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const createItem: INaturalPerson = {
            ...client,
            entityId: currentId,
        };

        const saveId: IEntityId = {
            id: "TURwHEkCzkSRVcbjdtTk",
            entityId: currentId,
            createdOn: Date.now()
        }

        if (selected) await update(client);
        else {
            await create(createItem, saveId);
            store.client.naturalPerson.select(createItem);
            showModalFromId(MODAL_NAMES.ADMIN.NATURAL_PERSON_MODAL);
        }
        setLoading(false);
        onCancel();
    };

    const update = async (item: INaturalPerson) => {
        try {
            await api.client.naturalPerson.update(item);
            swal({
                icon: "Success",
                text: "Entity details updated!"
            })
        } catch (error) {
        }
    };

    const create = async (item: INaturalPerson, saveId: IEntityId) => {
        item.entityDisplayName = `${item.clientSurname} ${item.clientName}`
        try {
            await api.client.naturalPerson.create(item);
            await api.client.entityId.update(saveId);

            //send the request to verify the account
            swal({
                icon: "success",
                text: "Successful entity on-boarding!"
            })
        } catch (error) {
            console.log(error);
        }
    };

    const onCancel = () => {
        store.client.naturalPerson.clearSelected();
        setTab("Personal")
        setClient({ ...defaultNaturalPerson });
        hideModalFromId(MODAL_NAMES.ADMIN.NATURAL_PERSON_MODAL);
    };

    const onSubmitPersonalDetail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTab("Contact");
    };

    const onBackToPersonalDetail = () => {
        setTab("Personal");
    };

    const onSubmitContactDetail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTab("Banking");
    };

    const onBackToContactDetail = () => {
        setTab("Contact");
    };

    const onSubmitAccountDetail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTab("FICA");
    };

    const onBackToAccountDetail = () => {
        setTab("Banking");
    };

    const onSubmitFICA = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTab("Tax");
    };

    const onBackToFICA = () => {
        setTab("FICA");
    };

    const onSubmitTaxDetail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTab("Related");
    };

    const onBackToTaxDetail = () => {
        setTab("Tax");
    };

    useEffect(() => {
        if (store.client.naturalPerson.selected) {
            setClient(store.client.naturalPerson.selected);
        }
    }, [store.client.naturalPerson.selected]);

    useEffect(() => {
        const loadAll = async () => {
            try {
                // await api.docfox.getKYCProfiles();
                await api.client.entityId.getId();
                setEntityId(store.entityId.id)
                const nextEntityId = generateNextValue(entityId);
                setCurrentId(nextEntityId)
            } catch (error) { }
        };
        loadAll();
    }, [api.client.entityId, api.docfox, entityId, store.entityId.id]);

    return (
        <div className="custom-modal-style uk-modal-dialog uk-modal-body uk-padding-large uk-margin-auto-vertical uk-width-1-2">
            <button className="uk-modal-close-default" type="button" data-uk-close onClick={onCancel} />
            <h4 className="main-title-small">New Entity (Natural Person) - Offline Onboarding</h4>
            <h3 className="uk-modal-title uk-margin-remove">New Entity ID {currentId}</h3>
            <div className="dialog-content uk-position-relative">
                <Tabs tab={tab} setTab={setTab} />
                {tab === "Personal" && (
                    <PersonalDetailsForm
                        client={client}
                        setClient={setClient}
                        onSubmitPersonalDetail={onSubmitPersonalDetail}
                        onCancel={onCancel}
                    />
                )}

                {tab === "Contact" && (
                    <ContactDetailsForm
                        client={client}
                        setClient={setClient}
                        onSubmitContactDetail={onSubmitContactDetail}
                        onBackToPersonalDetail={onBackToPersonalDetail} />
                )}
                {tab === "Banking" && (
                    <BankAccountDetailsForm
                        client={client}
                        setClient={setClient}
                        onSubmitAccountDetail={onSubmitAccountDetail}
                        onBackToContactDetail={onBackToContactDetail}
                    />
                )}

                {tab === "FICA" && (
                    <FICA
                        client={client}
                        setClient={setClient}
                        onSubmitFICA={onSubmitFICA}
                        onBackToBankDetail={onBackToAccountDetail} />
                )}

                {tab === "Tax" && (
                    <TaxDetailsForm
                        client={client}
                        setClient={setClient}
                        onSubmitTaxDetail={onSubmitTaxDetail}
                        onBackToAccountDetail={onBackToFICA}
                    />
                )}
                {tab === "Related" && (
                    <RelatedPartyDetailsForm
                        client={client}
                        setClient={setClient}
                        onSubmitRelatedParty={onSubmitRelatedParty}
                        onBackToTaxDetail={onBackToTaxDetail}
                        loading={loading}
                    />
                )}
            </div>
        </div>
    );
});

export default NaturalPersonOfflineModal;
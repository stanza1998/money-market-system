import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";

import { ILegalEntity, defaultlegalEntity } from "../../../../shared/models/clients/LegalEntityModel";
import { BankAccountDetails, ClientAddressContactDetail, ClientRelatedParty, ClientTaxDetail } from "./OtherLegalClientForms";
import { generateNextValue } from "../../../../shared/utils/utils";
import { LegalEntityForm } from "./LegalEntityForm";

interface ITabsProps {
    tab: "Personal" | "Contact" | "Banking" | "Tax" | "Related";
    setTab: React.Dispatch<React.SetStateAction<"Personal" | "Contact" | "Banking" | "Tax" | "Related">>;
}
const Tabs = (props: ITabsProps) => {
    const activeClass = (tab: "Personal" | "Contact" | "Banking" | "Tax" | "Related") => {
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
                    <a href="void(0)">Entity Details</a>
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
                    className={activeClass("Tax")}
                    onClick={() => props.setTab("Tax")}
                >
                    <a href="void(0)">Tax Detail</a>
                </li>
                <li
                    className={activeClass("Related")}
                    onClick={() => props.setTab("Related")}
                >
                    <a href="void(0)">Related Parties</a>
                </li>
            </ul>
        </div>
    );
};

const LegalEntityModal = observer(() => {

    const { api, store } = useAppContext();
    const [tab, setTab] = useState<"Personal" | "Contact" | "Banking" | "Tax" | "Related">("Personal");
    const [client, setClient] = useState<ILegalEntity>({ ...defaultlegalEntity });

    const [entityId, setEntityId] = useState("");
    const [currentId, setCurrentId] = useState("");
    const selected = store.client.naturalPerson.selected;

    const onCancel = () => {
        store.client.legalEntity.clearSelected();
        setTab("Personal");
        setClient({ ...defaultlegalEntity });
        hideModalFromId(MODAL_NAMES.ADMIN.LEGAL_ENTITY_MODAL);
    };


    useEffect(() => {
        if (store.client.legalEntity.selected) {
            setClient(store.client.legalEntity.selected);
        }
    }, [store.client.legalEntity.selected]);

    useEffect(() => {
        const loadAll = async () => {
            try {
                await api.client.entityId.getId();
                setEntityId(store.entityId.id)
                const nextEntityId = generateNextValue(entityId);
                setCurrentId(nextEntityId)
            } catch (error) { }
        };
        loadAll();
    }, [api.client.entityId, entityId, store.entityId.id]);

    return (
        <div className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical uk-width-3-4">
            <button className="uk-modal-close-default" type="button" data-uk-close onClick={onCancel} />
            <h3 className="uk-modal-title">Entity ID: {selected ? client.entityId : currentId}</h3>
            <div className="dialog-content uk-position-relative">
                <Tabs tab={tab} setTab={setTab} />
                {tab === "Personal" && (
                    <LegalEntityForm
                        client={client}
                        setClient={setClient}
                    />
                )}

                {tab === "Contact" && (
                    <ClientAddressContactDetail
                        client={client}
                        setClient={setClient}
                    />
                )}
                {tab === "Banking" && (
                    <BankAccountDetails
                        client={client}
                        setClient={setClient}
                    />
                )}
                {tab === "Tax" && (
                    <ClientTaxDetail
                        client={client}
                        setClient={setClient}
                    />
                )}
                {tab === "Related" && (
                    <ClientRelatedParty
                        client={client}
                        setClient={setClient}
                    />
                )}
            </div>
        </div>
    );
});

export default LegalEntityModal;
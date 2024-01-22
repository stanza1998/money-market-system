import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import ClientEntityApi from "./clients/ClientEntityApi";
import EntityIdApi from "./clients/EntityIdApi";
import LegalEntityApi from "./clients/LegalEntityApi";

export default class ClientsApi {
    legalEntity: LegalEntityApi;
    naturalPerson: ClientEntityApi;
    entityId: EntityIdApi;

    constructor(api: AppApi, store: AppStore) {
        this.legalEntity = new LegalEntityApi(api, store);
        this.naturalPerson = new ClientEntityApi(api, store);
        this.entityId = new EntityIdApi(api, store)
    }
}
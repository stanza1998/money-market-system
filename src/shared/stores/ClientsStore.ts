import AppStore from "./AppStore";
import ClientEntityStore from "./ClientEntityStore";
import LegalEntityStore from "./LegalEntityStore";

export default class ClientsStore {
    legalEntity: LegalEntityStore;
    naturalPerson: ClientEntityStore;

    constructor(store: AppStore) {
        this.legalEntity = new LegalEntityStore(store);
        this.naturalPerson = new ClientEntityStore(store);
    }
}
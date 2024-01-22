import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultClientDeposit: IClientDeposit = {
    id: "",
    uploadedBankStatement: {
        fileName: "",
        fileUrl: "",
        fileType: "",
    },
    dateUploaded: Date.now(),
    uploadedBy:""
}

export interface IClientDeposit {
    id: string;
    uploadedBankStatement: IBankStatement;
    dateUploaded: number | null;
    uploadedBy: string;
}

interface IBankStatement {
    fileName: "",
    fileUrl: "",
    fileType: "",
}

export default class ClientDepositModel {
    private ClientDeposit: IClientDeposit;

    constructor(private store: AppStore, ClientDeposit: IClientDeposit) {
        makeAutoObservable(this);
        this.ClientDeposit = ClientDeposit;
    }

    get uploader() {
        // return this.store.company.getById(this._companyDeduction.company);
        return null
    }


    get asJson(): IClientDeposit {
        return toJS(this.ClientDeposit);
    }
}
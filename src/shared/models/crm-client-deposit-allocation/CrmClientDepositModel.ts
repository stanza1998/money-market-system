import { makeAutoObservable, toJS } from "mobx";
import AppStore from "../../stores/AppStore";

export const defaultCrmClientDeposit: ICrmClientDeposit = {
    id: "",
    uploadedBankStatement: {
        fileName: "",
        fileUrl: "",
        fileType: "",
    },
    dateUploaded: Date.now(),
    uploadedBy:""
}

export interface ICrmClientDeposit {
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

export default class CrmClientDepositModel {
    private ClientDeposit: ICrmClientDeposit;

    constructor(private store: AppStore, CrmClientDeposit: ICrmClientDeposit) {
        makeAutoObservable(this);
        this.ClientDeposit = CrmClientDeposit;
    }

    get uploader() {
        // return this.store.company.getById(this._companyDeduction.company);
        return null
    }


    get asJson(): ICrmClientDeposit {
        return toJS(this.ClientDeposit);
    }
}
import { observer } from "mobx-react-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { read, utils } from "xlsx";
import "./AccountImport.scss";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../../shared/functions/ModalShow";
import { IMoneyMarketAccount } from "../../../../../shared/models/MoneyMarketAccount";
import FormFieldInfo from "../../../../shared/form-field-info/FormFieldInfo";
import ProgressBar from "../../../../shared/progress-bar/ProgressBar";
import MODAL_NAMES from "../../../ModalName";

interface IMoneyMarketAccountImport {
  id: string;
  entityOldCPNumber: string;
  TasmanAccNr: string;
  Description: string;
  IncludedOnStatement: boolean;
}

const AccountImportForm = observer(() => {
  const { api, store } = useAppContext();

  const [importFile, setImportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [importAccounts, setAccountImports] = useState<IMoneyMarketAccount[]>([]);
  const [completedItems, setCompletedItems] = useState(0);

  const handleChangeAccountFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImportFile(event.target.files[0]);
    }
  }

  const product = store.product.getItemById("oU2sIjtXHAJnslqFqw8Y" || "");

  const clients = [...store.client.naturalPerson.all, ...store.client.legalEntity.all];

  const getParentEntity = (entityOldCPNumber: string) => {
    const client = clients.find(client => client.asJson.oldCPNumber === entityOldCPNumber);
    if (client) {
      return client.asJson.entityId
    }
    return "";
  }

  const handleAccountImport = async () => {
    if (importFile) {
      const wb = read(await importFile.arrayBuffer());
      const data = utils.sheet_to_json<IMoneyMarketAccountImport>(wb.Sheets[wb.SheetNames[0]]);

      const importDataAsJson: IMoneyMarketAccount[] = data.map((account: IMoneyMarketAccountImport, index) => ({
        key: index,
        id: "",
        parentEntity: getParentEntity(`${account.entityOldCPNumber}`),
        accountNumber: `A0${account.TasmanAccNr}`,
        accountName: account.Description || "",
        accountType: product?.asJson.id || "",
        baseRate: product?.asJson.baseRate || 0,
        feeRate: 1.3,
        cession: 0,
        balance: 0,
        runningBalance: 0,
        displayOnEntityStatement: account.IncludedOnStatement ? true : false ,
        status: "Active"
      }));

      setAccountImports(importDataAsJson);

      try {
        setLoading(true);
        for (let index = 0; index < importDataAsJson.length; index++) {
          const accountRecord = importDataAsJson[index];
          
          setCompletedItems(index + 1); // Update the progress bar and text
          await api.mma.create(accountRecord);
          await new Promise(resolve => setTimeout(resolve, 200)); // Wait two seconds before adding the next record to the database
        }
      } catch (error) {
        setLoading(false);
      }
      setLoading(false);
      await new Promise(resolve => setTimeout(resolve, 2000));
      onCancel();
    }
  }

  const onCancel = () => {
    setImportFile(null);
    hideModalFromId(MODAL_NAMES.DATA_MIGRATION.IMPORT_CLIENT_ACCOUNTS_MODAL);
  }

  useEffect(() => {
    const loadAll = async () => {
      try {
        await api.client.naturalPerson.getAll();
        await api.client.legalEntity.getAll();
        await api.mma.getById("oU2sIjtXHAJnslqFqw8Y");
      } catch (error) { }
    };
    loadAll();
  }, [api.client.legalEntity, api.client.naturalPerson, api.mma]);

  return (
    <ErrorBoundary>
      <div className="uk-width-1-1 uk-margin" data-uk-margin>
        <div data-uk-form-custom="target: true">
          <input type="file" aria-label="Custom controls" onChange={handleChangeAccountFile} accept="xls" required />
          <input className="uk-input uk-form-width-large" type="text" placeholder="Select file" aria-label="Custom controls" disabled />
        </div>
        <FormFieldInfo>
          You can only upload Excel Files
        </FormFieldInfo>
        {
          !loading && importFile &&
          <button type="button" className="btn btn-primary" onClick={handleAccountImport}>
            Import
          </button>
        }
        {
          loading && importFile &&
          <ProgressBar totalItems={importAccounts.length} completedItems={completedItems} />
        }

      </div>
    </ErrorBoundary>
  )
});

export default AccountImportForm

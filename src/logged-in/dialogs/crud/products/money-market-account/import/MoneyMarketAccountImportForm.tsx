import { observer } from "mobx-react-lite";
import { ChangeEvent, useEffect, useState } from "react";
import { read, utils } from "xlsx";
import "./EntityImport.scss";
import ErrorBoundary from "../../../../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../../../shared/functions/ModalShow";
import FormFieldInfo from "../../../../../shared/form-field-info/FormFieldInfo";
import ProgressBar from "../../../../../shared/progress-bar/ProgressBar";
import MODAL_NAMES from "../../../../ModalName";
import { INaturalPerson, defaultNaturalPerson } from '../../../../../../shared/models/clients/NaturalPersonModel';
import { generateNextValue, generateNextValueWithIncrement } from "../../../../../../shared/utils/utils";

interface INaturalPersonImport {
  entityOldCPNumber: string,
  entityID: string,
  entityDescription: string,
  clientFirstName: string,
  clientMiddleName: string,
  clientSurname: string,
  clientPreferredName: string,
  clientTitle: string,
  clientClassification: string,
  idNumber: string,
  idType: string,
  idCountry: string,
  idExpiry: string,
  dateCreated: string,
  riskRating: string,
  dateOfLastFIA: string,
  dateOfNextFIA: string,
  clientDOB: string,
  deceased: number,
  dateOfDeath: string,
  annualIncome: number,
  clientStatus: string,
  annualInvestmentLimit: number,
  singleTransactionLimit: number,
  countryNationality: string,
  restrictions: string,
  postalAddressLine1: string,
  postalSuburb: string,
  postalCity: string,
  postalState: string,
  postalCountry: string,
  postalAreaCode: string,
  physicalAddressLine1: string,
  physicalAddressLine2: string,
  physicalSurburb: string,
  physicalCity: string,
  physicalState: string,
  physicalArea: string,
  workPhoneNumber: string,
  homePhoneNumber: string,
  mobilePhoneNumber: string,
  emailAddress1: string,
  emailAddress2: string,
  emailAddress3: string,
  tin: string,
  tinCountryOfIssue: string,
  reasonForNoTIN: string,
  bank: string,
  branchName: string,
  branchCode: string,
  accountNumber: string,
  accountHolder: string,
  relatedPartyName: string,
  relatedPartySurname: string,
  relatedPartId: string,
  relationship: string,
  relatedPartyRiskRating: string
}

const MoneyMarketAccountImportForm = observer(() => {
  const { api, store } = useAppContext();

  const [importFile, setImportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [importEntitys, setEntityImports] = useState<INaturalPerson[]>([]);
  const [completedItems, setCompletedItems] = useState(0);

  const [entityId, setEntityId] = useState("");
  const [currentId, setCurrentId] = useState("");

  const handleChangeEntityFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImportFile(event.target.files[0]);
    }
  }

  const handleEntityImport = async () => {
    if (importFile) {
      const wb = read(await importFile.arrayBuffer());
      const data = utils.sheet_to_json<INaturalPersonImport>(wb.Sheets[wb.SheetNames[0]]);

      const importDataAsJson: INaturalPerson[] = data.map((client: INaturalPersonImport, index) => ({
        ...defaultNaturalPerson,
        key: index,
        entityId: client.entityID ? `${client.entityID}` : client.entityOldCPNumber ? `${client.entityOldCPNumber}` : `${generateNextValueWithIncrement(entityId, index + 1)}`,
        entityDisplayName: `${client.clientFirstName} ${client.clientSurname}`,
        clientName: client.clientFirstName || "",
        clientSurname: client.clientSurname || "",
        clientTitle: client.clientTitle || "", 
        clientClassification: client.clientClassification || "",
        idType: client.idType || "", 
        idNumber: client.idNumber || "",
        idCountry: client.idCountry || "", 
        dateCreated: client.dateCreated || "",
        dateDeactivated: client.dateCreated || "",
        riskRating: client.riskRating || "",
        dateOfLastFIA: client.dateOfLastFIA || "", 
        dateOfNextFIA: client.dateOfNextFIA || "", 
        dateOfBirth: client.clientDOB || "",
        deceased: client.dateOfDeath ? true : false,
        annualInvestmentLimit: client.annualInvestmentLimit || 0,
        singleTransactionLimit: client.singleTransactionLimit || 0,
        countryNationality: client.countryNationality || "",
        restricted: client.restrictions ? true : false,
        reasonForRestriction: client.restrictions || "",
        taxDetail:{
          tin: client.tin || "",
          tinCountryOfIssue: client.tinCountryOfIssue || "",
          vatNumber: "", 
          reasonForNoTIN: client.reasonForNoTIN || ""
        },
        bankingDetail:[
          {
            bankName: client.bank || "",
            accountType: "", 
            branch: client.branchCode || "", 
            branchNumber: client.branchCode || "",
            accountNumber: client.accountNumber || "",
            accountHolder: client.accountHolder || "",
            accountVerificationStatus: "not-verfied",
          }
        ],
        relatedParty:[
          {
            firstName: client.relatedPartyName || "",
            surname: client.relatedPartySurname || "",
            idNumber: client.relatedPartId || "",
            riskRating: client.relatedPartyRiskRating || "",
            relationship: client.relationship || ""
          }
        ],

        contactDetail: {
          address1: client.physicalAddressLine1 || "",
          address2: client.physicalAddressLine2 || "",
          suburb: client.physicalSurburb || "",
          city: client.physicalCity || "",
          state: client.physicalState || "",
          country: client.postalCountry || "",
          phoneNumber: client.homePhoneNumber || "",
          cellphoneNumber: client.mobilePhoneNumber || "",
          cellphoneNumberSecondary: client.workPhoneNumber || "",
          fax: "",
          emailAddress: client.emailAddress1 || "",
          emailAddressSecondary: client.emailAddress2 || "",
        }
        
      }));

      setEntityImports(importDataAsJson);

      try {
        setLoading(true);
        for (let index = 0; index < importDataAsJson.length; index++) {
          const clientRecord = importDataAsJson[index];
          
          setCompletedItems(index + 1); // Update the progress bar and text
          await api.client.naturalPerson.create(clientRecord);
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
    hideModalFromId(MODAL_NAMES.DATA_MIGRATION.IMPORT_CLIENT_ENTITY_MODAL);
  }

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
  }, [api.client.entityId, api.docfox, entityId, store.entityId.id]);

  return (
    <ErrorBoundary>
      <div className="uk-width-1-1 uk-margin" data-uk-margin>
        <div data-uk-form-custom="target: true">
          <input type="file" aria-label="Custom controls" onChange={handleChangeEntityFile} accept="xls" required />
          <input className="uk-input uk-form-width-large" type="text" placeholder="Select file" aria-label="Custom controls" disabled />
        </div>
        <FormFieldInfo>
          You can only upload Excel Files
        </FormFieldInfo>
        {
          !loading && importFile &&
          <button type="button" className="btn btn-primary" onClick={handleEntityImport}>
            Import
          </button>
        }
        {
          loading && importFile &&
          <ProgressBar totalItems={importEntitys.length} completedItems={completedItems} />
        }

      </div>
    </ErrorBoundary>
  )
});

export default MoneyMarketAccountImportForm

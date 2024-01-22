import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../../../shared/functions/Context';
import ErrorBoundary from '../../../../shared/components/error-boundary/ErrorBoundary';
import { LoadingEllipsis } from '../../../../shared/components/loading/Loading';
import { treasuryBillAllocation, currencyFormat } from '../../../../shared/functions/Directives';
import { formatDate } from '../../../../shared/functions/MyFunctions';
import useTitle from '../../../../shared/hooks/useTitle';
import { IMoneyMarketAccount } from '../../../../shared/models/MoneyMarketAccount';
import { IMoneyMarketAccountPurchase } from '../../../../shared/models/MoneyMarketAccountPurchase';
import { ITransactionOutflow } from '../../../../shared/models/TransactionOutflowModel';
import { ITreasuryBill, defaultTreasuryBill } from '../../../../shared/models/instruments/TreasuryBillModel';
import { ITreasuryBillPurchaseAllocation } from '../../../../shared/models/purchases/treasury-bills/TreasuryBillPurchaseAllocationModel';
import { dateFormat } from '../../../../shared/utils/utils';
import swal from 'sweetalert';

const TreasuryBillPurchaseProcessingSheet = () => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const onNavigate = useNavigate();
  const { purchaseId } = useParams<{ purchaseId: string }>();

  const processor = store.auth.meJson;

  const executionFile = store.purchase.treasuryBillExecution.all;
  const dealingDeskSheet = store.purchase.treasuryBillDeskDealingSheet.all;

  const [treasuryBill, setTreasuryBill] = useState<ITreasuryBill>({ ...defaultTreasuryBill });

  const [title] = useTitle(`Treasury Bill Purchase Allocation: ${treasuryBill.instrumentName}`);

  const tb = store.instruments.treasuryBill.getItemById(purchaseId ? purchaseId : "");
  const [clientExecutionFile, setClientExecutionFile] = useState<any[]>([]);

  const totalsOnClientSheet = treasuryBillAllocation(clientExecutionFile);

  const groupedClients = clientExecutionFile.reduce((grouped, client: ITreasuryBillPurchaseAllocation) => {
    const { tenderRate, newNominal, considerationBON } = client;

    if (!grouped[tenderRate]) {
      grouped[tenderRate] = { totalConsideration: 0, totalNominal: 0, clientExecutionFile: [] };
    }
    grouped[tenderRate].totalNominal += newNominal;
    grouped[tenderRate].totalConsideration += considerationBON;
    grouped[tenderRate].clientExecutionFile.push(client);
    return grouped;
  }, {});

  const moneyMarketAccountNumber = (moneyMarketAccountId: string) => {
    const account = store.mma.all.find((mma) => mma.asJson.id === moneyMarketAccountId);
    return account ? account.asJson.accountNumber : "";
  }

  const clientBalance = (moneyMarketAccountNumber: string) => {
    const account = store.mma.all.find((mma) => mma.asJson.id === moneyMarketAccountNumber);
    return account ? account.asJson.balance : 0;
  }

  const clients = [...store.client.naturalPerson.all, ...store.client.legalEntity.all];

  const getClientName = (parentEntityId: string) => {
    const client = clients.find(client => client.asJson.entityId === parentEntityId)
    if (client) {
      return client.asJson.entityDisplayName
    }
    return "";
  }

  const onProcess = async (allocation: any) => {
    swal({
      title: "Are you sure?",
      icon: "warning",
      buttons: ["Cancel", "Process"],
      dangerMode: true,
    }).then(async (edit) => {
      if (edit) {
        if (allocation) {

          const _allocation: ITreasuryBillPurchaseAllocation = {
            ...allocation,
            status: "successfull"
          }
          await api.purchase.treasuryBill.createPurchaseOldTenderSheet(treasuryBill.id, _allocation);
          console.log(_allocation);


          const mmaPurchase: IMoneyMarketAccountPurchase = {
            instrumentType: "Treasury Bill",
            ...allocation
          }
          await api.purchase.treasuryBill.createPurchaseInAccount(allocation.moneyMarketAccountNumber, mmaPurchase);

          const mmAccounts = store.mma.all;
          const account = mmAccounts.find(account => account.asJson.id === allocation.moneyMarketAccountNumber);

          if (account) {

            const newBalace = account.asJson.balance - allocation.considerationClient;
            const runningBalance = (account.asJson.balance - account.asJson.cession) - allocation.considerationClient;

            const accountUpdate: IMoneyMarketAccount = {
              id: account.asJson.id,
              parentEntity: account.asJson.parentEntity,
              accountNumber: account.asJson.accountNumber,
              accountName: account.asJson.accountName,
              accountType: account.asJson.accountType,
              baseRate: account.asJson.baseRate || 0,
              feeRate: account.asJson.feeRate,
              cession: account.asJson.cession,
              displayOnEntityStatement: account.asJson.displayOnEntityStatement,
              balance: newBalace,
              runningBalance: runningBalance,
              status: "Active"
            }
            await api.mma.update(accountUpdate);

            //record as outflow
            const outflow: ITransactionOutflow = {
              id: "",
              transactionDate: Date.now(),
              amount: allocation.considerationClient,
              bank: "",
              product: accountUpdate.accountType,
              status: "running"
            }

            try {
              await api.outflow.create(outflow);
            } catch (error) {
            }
          }
          // TODO save the clients transaction file to the database under the purchase

          // TODO send the wealth manage and client
          // const email = MAIL_TB_DESK_DEALING_SHEET(allocator?.displayName, purchase.instrumentName, dealingDesk)
          // await api.mail.sendMail(["peangesheya@yahoo.com"], "np-reply@ijgmms.net", "TB Tender Submission", email.BODY)
        }
        else {
        }
        swal({
          text: "Tender processed!",
          icon: "success",
        })
      } else {
        swal({
          text: "The tender has not been processed, the user has cancelled the action!",
          icon: "error",
        })
      }
    })
  };

  useEffect(() => {
    if (tb) {
      setTreasuryBill(tb.asJson);
    } else onNavigate("purchases");
    document.title = title;
  }, [onNavigate, tb, title]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await api.client.legalEntity.getAll();
        await api.client.naturalPerson.getAll();
        await api.mma.getAll();

        if (purchaseId) {
          await api.purchase.treasuryBill.getAll();
          await api.purchase.treasuryBill.getAll();
          await api.purchase.treasuryBill.getAllPurchaseExecutionFileItems(purchaseId);
          await api.purchase.treasuryBill.getAllPurchaseDeskDealing(purchaseId);
        }
        await api.instruments.treasuryBill.getAll();
        setLoading(false);
      } catch (error) { }
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.instruments.treasuryBill, api.mma, api.purchase.treasuryBill, purchaseId]);

  return (
    <div className="purchases-view-page uk-section uk-section-small">
      <div className="uk-container uk-container-expand">
        {!loading &&
          <ErrorBoundary>
            <div className="purhases-main-card uk-card uk-padding-small uk-margin">
              <div className="uk-grid" data-uk-grid>
                <div className="uk-width-1-1">
                  <table className="kit-table uk-table uk-table-divider purhase-page-form">
                    <thead>
                      <tr>
                        <th className="uk-text-bold">Instrument(Maturing)</th>
                        <th>{treasuryBill.instrumentName}</th>
                      </tr>
                      <tr>
                        <th className="uk-text-bold">Settlement Date</th>
                        <th>{dateFormat(treasuryBill.issueDate)}</th>
                      </tr>
                      <tr>
                        <th className="uk-text-bold">Maturity Date</th>
                        <th>{dateFormat(treasuryBill.maturityDate)}</th>
                      </tr>
                      <tr>
                        <th className="uk-text-bold">New Instrument</th>
                        <th>{formatDate(treasuryBill.instrumentName)}</th>
                      </tr>
                      <tr>
                        <th className="uk-text-bold">DTM</th>
                        <th>{treasuryBill.daysToMaturity}</th>
                      </tr>
                    </thead>
                  </table>
                </div>

                {/* <div className="uk-width-expand">
                  <h4 className="main-title-small">Dealing Desk - Tender Sheet</h4>
                  <table className="kit-table uk-table uk-table-divider purhase-page-form desk-dealing">
                    <thead>
                      <tr>
                        <th>Instrument</th>
                        <th>Tender Rate</th>
                        <th>Nominal</th>
                        <th>Consideration</th>
                      </tr>
                    </thead>
                    <tbody className="uk-text-white">
                      {dealingDeskSheet.map(tenderRate => (
                        <tr className="uk-text-white" key={tenderRate.asJson.id}>
                          <td>{formatDate(treasuryBill.instrumentName)}</td>
                          <td>{tenderRate.asJson.tenderRate}</td>
                          <td>{currencyFormat(tenderRate.asJson.nominal)}</td>
                          <td>{currencyFormat(tenderRate.asJson.considerationBON)}</td>
                        </tr>
                      ))
                      }
                    </tbody>
                    <tfoot>
                      <tr className="uk-text-white" key="grandTotal">
                        <td colSpan={2}></td>
                        <td>{currencyFormat(totalsOnClientSheet.considerationBON)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3}></td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>

                </div> */}

                <div className="purhases-main-card uk-card uk-padding-small">
                  <div className="uk-margin">
                    <div className="purhase-page-table">

                      <div className="uk-width-1-1 uk-padding-small">
                        <div className="table-container uk-height-medium">
                          <table className="kit-table uk-table uk-table-small uk-table-middle uk-table-responsive">
                            <thead className="header">
                              <tr>
                                <th>Client Name</th>
                                <th>MM Account</th>
                                <th>MM Account Balance</th>
                                <th>Available Balance</th>
                                <th>Net Balance</th>
                                <th>Nominal</th>
                                <th>Tender Rate</th>
                                <th>Client Rate</th>
                                <th>Consideration BON</th>
                                <th>Consideration Client</th>
                                <th>Counter Party</th>
                                <th>Profit</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                executionFile.map(tender => (
                                  <tr key={tender.asJson.id}>
                                    <td>{getClientName(tender.asJson.clientName)}-{tender.asJson.clientName}</td>
                                    <td>{moneyMarketAccountNumber(tender.asJson.moneyMarketAccountNumber)}</td>
                                    <td>{currencyFormat(clientBalance(tender.asJson.moneyMarketAccountNumber))}</td>
                                    <td>{currencyFormat(clientBalance(tender.asJson.moneyMarketAccountNumber))}</td>
                                    <td>{currencyFormat(clientBalance(tender.asJson.moneyMarketAccountNumber) - tender.asJson.considerationClient)}</td>
                                    <td>{currencyFormat(tender.asJson.newNominal)}</td>
                                    <td>{tender.asJson.tenderRate}</td>
                                    <td>{tender.asJson.clientRate}</td>
                                    <td>{currencyFormat(tender.asJson.considerationBON)}</td>
                                    <td>{currencyFormat(tender.asJson.considerationClient)}</td>
                                    <td>{tender.asJson.counterParty}</td>
                                    <td>{currencyFormat(tender.asJson.profit)}</td>
                                    <td>
                                      {
                                        <button className="btn btn-primary" disabled={tender.asJson.status === "successful"} onClick={() => onProcess(tender.asJson)}>Process {tender.asJson.status}</button>
                                      }
                                    </td>
                                  </tr>
                                ))
                              }
                              {
                                executionFile.length === 0 &&
                                <td colSpan={13}>
                                  No data
                                </td>
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>


          </ErrorBoundary >
        }
        {
          loading && <LoadingEllipsis />
        }
      </div >

    </div >
  )
}

export default TreasuryBillPurchaseProcessingSheet

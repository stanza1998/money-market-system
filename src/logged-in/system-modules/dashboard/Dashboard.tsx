import { useEffect, useRef, useState } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../../shared/functions/Context";
import InflowsOutflows from "./daily-inflows/InflowsOutflows";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import Toolbar from "../../shared/toolbar/Toolbar";
import DashboardCard from "./dashboard-components/cards";
import { Box, Grid, Tab, Tabs } from "@mui/material";
import { LegalEntityTable } from "./dashboard-components/NewClients";
import { TransactionsGraphs } from "./dashboard-components/BarGraph";
import LineGraphChart from "./dashboard-components/LineGraph";
// import { LineGraphChart } from "./dashboard-components/LineGraph";
import BusinessIcon from "@mui/icons-material/Business";
import MoneyIcon from "@mui/icons-material/Money";
import PersonIcon from "@mui/icons-material/Person";
import DoughnutChart from "./dashboard-components/DoughNutChart";
import { CalendarView } from "./CalendarView";
import { PurchasesGraph } from "./dashboard-components/PurchasesGraph";
import { useNavigate } from "react-router-dom";
import MoneyMarketAccount from "../../../shared/models/MoneyMarketAccount";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import Modal from "../../../shared/components/Modal";
import AllProductMoneyMarketAccountsModal from "../../dialogs/products/product-money-market-accounts/AllProductMoneyMarketAccountsModal";

const Dashboard = () => {
  const { api, store } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("trends");
  const [transactionsTabs, setTransactionsTab] = useState("deposits");
  const navigate = useNavigate();
  const legalClients = store.client.legalEntity.all
    .map((client) => {
      return client.asJson;
    })
    .filter((client) => {
      const currentDate: Date = new Date();
      const clientDate: Date = new Date(client.dateCreated);
      const daysThreshold = 7;
      const timeDifference = currentDate.getTime() - clientDate.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);
      return daysDifference <= daysThreshold;
    });

  const colorRef = useRef(null);
  const getTitleFontColor = () => {
    if (colorRef.current) {
      const computedStyle = window.getComputedStyle(colorRef.current);
      return computedStyle.color;
    }
    return "var(--color-text);";
  };

  const fontColor = getTitleFontColor();
  const toggleTrendsTab = () => {
    setTab("trends");
  };
  const toggleCalendarTab = () => {
    setTab("calendar");
  };
  const toggleDailyFlowsTab = () => {
    setTab("dailyFlows");
  };
  const toggleDepositsTab = () => {
    setTransactionsTab("deposits");
  };
  const togglePurchasesTab = () => {
    setTransactionsTab("purchases");
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await api.inflow.getAll();
        setLoading(false);
      } catch (error) {}
    };
    loadDashboardData();
  }, [api.inflow]);

  const _corporateId = "1AxqDiOAwMf0WPKjMib8";
  const _taxId = "lLgaoiwKyYlJPfnCE0nD";
  const _individualId = "oU2sIjtXHAJnslqFqw8Y";

  const [productAccounts, setProductAccounts] =
    useState<MoneyMarketAccount[]>();

  // const onViewInstruments = async (productId: string,store:AppStore) => {
  //   setProductAccounts(store.mma.allProductAccounts(productId));
  //   showModalFromId(MODAL_NAMES.BACK_OFFICE.ALL_PRODUCT_ACCOUNTS_MODAL);
  // }

  async function viewCorporateAccounts() {
    // await api.mma.getAll();
    // Assuming allProductAccounts returns an array or a default value when no accounts are found
    console.log("Corporate accounts are here");
    setProductAccounts(store.mma.allProductAccounts(_corporateId));
    showModalFromId(MODAL_NAMES.BACK_OFFICE.ALL_PRODUCT_ACCOUNTS_MODAL);
  }

  async function viewIndividualAccounts() {
    // await api.mma.getAll();
    // Assuming allProductAccounts returns an array or a default value when no accounts are found
    console.log("Individual accounts are here");
    const productAccounts = store.mma.allProductAccounts(_taxId);
    setProductAccounts(productAccounts);
    showModalFromId(MODAL_NAMES.BACK_OFFICE.ALL_PRODUCT_ACCOUNTS_MODAL);
  }
  async function viewTaxFreeAccounts() {
    // await api.mma.getAll();
    // Assuming allProductAccounts returns an array or a default value when no accounts are found
    console.log("Tax accounts are here");
    const productAccounts = store.mma.allProductAccounts(_individualId);
    setProductAccounts(productAccounts);
    showModalFromId(MODAL_NAMES.BACK_OFFICE.ALL_PRODUCT_ACCOUNTS_MODAL);
  }

  return (
    <ErrorBoundary>
      {!loading && (
        <div className="page uk-section uk-section-small overview">
          <div
            className="uk-container uk-container-expand"
            style={{ margin: "2rem" }}
          >
            <div className="sticky-top">
              <Toolbar title="Dashboard" />
              <hr />
            </div>
            <div style={{ marginLeft: "1rem" }}>
              <Grid spacing={2} container>
                <Grid xs={12} sm={12} md={4} lg={8}>
                  <div className="uk-flex uk-flex-column">
                    {/*cards*/}
                    <div
                      className="uk-child-width-1-3@m uk-grid-small uk-grid-match"
                      data-uk-grid
                      style={{ marginRight: "15px" }}
                    >
                      <div>
                        <div className="page-main-card uk-card uk-card-default uk-card-body">
                          <h3 className="uk-card-title">IJG Corporate Money</h3>
                          <span>3</span>
                          <hr />
                          <button
                            style={{ color: "white" }}
                            className="btn btn-primary"
                            onClick={() => viewCorporateAccounts()}
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="page-main-card uk-card uk-card-default uk-card-body">
                          <h3 className="uk-card-title">
                          IJG Tax Free{/*  (Institutional) */}
                          </h3>
                          <span>3</span>
                          <hr />
                          <button
                            style={{ color: "white" }}
                            className="btn btn-primary"
                            onClick={() => viewCorporateAccounts()}
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div>
                        <div className="page-main-card uk-card uk-card-default uk-card-body">
                          <h3 className="uk-card-title">IJG Individual</h3>
                          <span>3</span>
                          <hr />
                          <button
                            style={{ color: "white" }}
                            className="btn btn-primary"
                            onClick={() => viewCorporateAccounts()}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* <div
                    className="uk-flex page-main-card"
                    style={{ width: "98%" }}
                  >
                   
                    <DashboardCard
                      title={"IJG Corporate Money"}
                      total={3}
                      button={
                        <button className="btn btn-primary" onClick={() => viewCorporateAccounts()}>
                          View
                        </button>
                      }
                      // icon={<BusinessIcon />}
                    />
                    <DashboardCard
                      title={"IJG Tax Free (Institutional)"}
                      // text={"Total Number of Accounts"}
                      total={14}
                      button={
                        <button className="btn btn-primary" onClick={() => viewTaxFreeAccounts()}>
                          View
                        </button>
                      }
                      // icon={<MoneyIcon />}
                    />
                    <DashboardCard
                      title={"IJG Individual"}
                      // text={"Total Number of Accounts"}
                      total={18}
                      // icon={<PersonIcon />}
                      button={
                        <button className="btn btn-primary" onClick={() => viewIndividualAccounts()}>
                          View
                        </button>
                      }
                    />
                  </div> */}
                    {/*Maturities Section */}
                    {/* <div className="page-main-card uk-card uk-padding">
                    <div className="uk-margin-large-botton"> */}
                    <div
                      className="uk-flex uk-flex-column page-main-card"
                      style={{
                        marginTop: "2rem",
                        width: "98%",
                      }}
                    >
                      <div>
                        {/* <h4>Maturities</h4> */}
                        <ul className="tabs-container uk-flex" uk-tab>
                          <li
                            className="uk-tab uk-padding-small"
                            style={{ marginRight: "2rem" }}
                            onClick={toggleTrendsTab}
                          >
                            <span className="main-title-small" ref={colorRef}>
                              Trends
                            </span>
                          </li>
                          <li
                            className="uk-tab uk-padding-small"
                            style={{ marginRight: "2rem" }}
                            onClick={toggleDailyFlowsTab}
                          >
                            <span className="main-title-small" ref={colorRef}>
                              Daily Flows
                            </span>
                          </li>
                          <li
                            className="uk-tab uk-padding-small"
                            onClick={toggleCalendarTab}
                          >
                          
                            <span className="main-title-small">Calendar</span>
                          </li>
                        </ul>
                        {/*Charts*/}
                        {tab === "trends" && (
                          <>
                            <div
                              className="page-main-card"
                              style={{ height: "auto" }}
                            >
                              <h4 className="main-title-small">
                                Maturities Line Charts
                              </h4>
                              <LineGraphChart fontColor={fontColor} />
                            </div>
                          </>
                        )}
                        {tab === "calendar" && (
                          <>
                            <div
                              className="page-main-card"
                              style={{ height: "auto" }}
                            >
                              <h4 className="main-title-small">
                                Calendars Charts
                              </h4>
                              <CalendarView />
                            </div>
                          </>
                        )}
                          {tab === "dailyFlows" && (
                          <>
                            <div
                              className="page-main-card"
                              style={{ height: "auto" }}
                            >
                              <h4 className="main-title-small">
                                Daily Flows
                              </h4>
                              <InflowsOutflows />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {/**Transactions Section */}
                    <div
                      className="uk-flex uk-flex-column page-main-card"
                      style={{
                        marginTop: "2rem",
                        width: "98%",
                        // height: "100%",
                        // overflowY:"scroll",
                      }}
                    >
                      <div className="" style={{ width: "98%" }}>
                        {/* <h4>Maturities</h4> */}
                        <ul className="tabs-container uk-flex" uk-tab>
                          <li
                            className="uk-tab uk-padding-small"
                            style={{ marginRight: "2rem" }}
                            onClick={toggleDepositsTab}
                          >
                            <span className="main-title-small" ref={colorRef}>
                              Deposits
                            </span>
                          </li>
                          <li
                            className="uk-tab uk-padding-small"
                            onClick={togglePurchasesTab}
                          >
                            <span className="main-title-small">Purchases</span>
                          </li>
                        </ul>
                        {/*Charts*/}
                        {transactionsTabs === "deposits" && (
                          <div
                            className="uk-card uk-card-small uk-card-default uk-card-body page-main-card"
                            style={{
                              width: "98%",
                            }}
                          >
                            <h4 className="main-title-small">
                              Total Deposits Per Instrument
                            </h4>
                            <div
                              className="page-main-card"
                              style={{ height: "40%" }}
                            >
                              <TransactionsGraphs />
                            </div>
                          </div>
                        )}
                        {transactionsTabs === "purchases" && (
                          <>
                            <div
                              className="uk-card uk-card-default uk-card-body"
                              style={{
                                // overflow: "hidden",
                                width: "98%",
                                height: "auto",
                              }}
                            >
                              <h4 className="main-title-small">
                                Purchases Charts
                              </h4>
                              <div
                                className="page-main-card"
                                // style={{height:"40%"}}
                              >
                                <PurchasesGraph />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid xs={12} sm={12} md={4} lg={4}>
                  <div className="uk-flex uk-flex-column">
                    <div className="uk-card page-main-card">
                      <h4
                        className="uk-heading main-title-small"
                        style={{ textAlign: "center" }}
                      >
                        Total Fee Rate Distribution
                      </h4>
                      <DoughnutChart fontColor={fontColor} />
                    </div>
                    {/* <div
                      className="uk-card uk-card-default page-main-card"
                      style={{ marginTop: "2rem" }}
                    >
                      <h4
                        className="uk-heading main-title-small"
                        style={{ textAlign: "center", marginTop: "1rem" }}
                      >
                        Daily Flows
                      </h4>
                      <div className="uk-card-body " style={{ width: "100%" }}>
                        <div>
                          <InflowsOutflows />
                        </div>
                      </div>
                    </div> */}
                    <div
                      className="uk-card uk-card-default page-main-card"
                      style={{ marginTop: "2rem" }}
                    >
                      <h4
                        className="uk-heading main-title-small"
                        style={{ textAlign: "center", marginTop: "2rem" }}
                      >
                        Recently Added Legal Clients
                      </h4>
                      <div className="uk-card-body" style={{ width: "100%" }}>
                        <LegalEntityTable data={legalClients} />
                      </div>
                    </div>
                    <div
                      className="uk-card uk-card-default page-main-card"
                      style={{ marginTop: "2rem" }}
                    >
                      <h4
                        className="uk-heading main-title-small"
                        style={{ textAlign: "center", marginTop: "2rem" }}
                      >
                        Recently Added  Natural Clients
                      </h4>
                      <div className="uk-card-body" style={{ width: "100%" }}>
                        <LegalEntityTable data={legalClients} />
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
          <Modal modalId={MODAL_NAMES.BACK_OFFICE.ALL_PRODUCT_ACCOUNTS_MODAL}>
            {productAccounts && (
              <AllProductMoneyMarketAccountsModal accounts={productAccounts} />
            )}
          </Modal>
        </div>
      )}
      {loading && <LoadingEllipsis />}
    </ErrorBoundary>
  );
};
export default Dashboard;

{
  /* <div className="uk-width-2-3">
<div className="page-main-card uk-card uk-card-default uk-card-body">
  <h4 className="main-title-small">Daily Flows</h4>
  <div className="uk-padding-small">
   
  </div>
</div>
</div> */
}

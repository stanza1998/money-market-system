import {
  faBriefcase,
  faCaretDown,
  faCaretRight,
  faChartLine,
  faDollarSign,
  faExchange,
  faGear,
  faPeopleArrows,
  faRedo,
  faThLarge,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import { useAppContext } from "../../shared/functions/Context";

export const AccountLogo = () => {
  return (
    <div className="account-settings">
      <img src={`${process.env.PUBLIC_URL}/IJG.png`} alt="" />
    </div>
  );
};

const USER_DRAWER = () => {
  const { store } = useAppContext();
  const user = store.auth.meJson;
  const hasViewDashboardPermission = user?.feature.some(
    (feature) => feature.featureName === "Dashboard" && feature.read === true
  );
  const hasViewAssetManagerFlowPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Asset Manager Flows" && feature.read === true
  );
  const hasViewClientProfileManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Client Profile Management" &&
      feature.read === true
  );
  const hasViewMoneyMarketAccountPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Money Market Account Management" &&
      feature.read === true
  );
  const hasViewProductManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Product Management" && feature.read === true
  );
  const hasViewPricingPermission = user?.feature.some(
    (feature) => feature.featureName === "Pricing" && feature.read === true
  );
  const hasViewInstrumentManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Instrument Management" && feature.read === true
  );
  const hasViewClientDepositAndDepositPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Client Deposits and Allocations" &&
      feature.read === true
  );
  const hasViewWithdrawalAndPaymentPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Client Withdrawals and Payments" &&
      feature.read === true
  );
  const hasViewSwitchesPermission = user?.feature.some(
    (feature) => feature.featureName === "Switches" && feature.read === true
  );
  const hasViewPurchasePermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Instrument Tendering/Purchase/Sales" &&
      feature.read === true
  );
  const hasViewProcessPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Instrument Purchase/Sales Processing" &&
      feature.read === true
  );
  const hasViewCounterPartyManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Counterparty Management" && feature.read === true
  );
  const hasViewUserManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "User Management" && feature.read === true
  );
  const hasViewBankReconciliationPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Client Deposits and Allocations" &&
      feature.read === true
  );

  return (
    <div className="drawer-list">
      <ul className="main-list uk-nav-default" data-uk-nav>
        {hasViewDashboardPermission && (
          <>
            {" "}
            <ul className="main-list uk-nav-default" data-uk-nav>
              <li className="list-item">
                <NavLink to={"dashboard"} className="navlink">
                  <FontAwesomeIcon
                    icon={faChartLine}
                    className="icon uk-margin-small-right"
                  />
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </>
        )}
        {(hasViewClientProfileManagementPermission ||
          hasViewMoneyMarketAccountPermission) && (
          <>
            {" "}
            <ul className="main-list uk-nav-default" data-uk-nav>
              <li className="list-item uk-parent">
                <NavLink to={"clients/view"} className="navlink">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="icon uk-margin-small-right"
                  />
                  Clients
                  <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
                </NavLink>
                <ul className="uk-nav-sub">
                  <li>
                    <NavLink to={"client-intelligence"} className="navlink">
                      <FontAwesomeIcon
                        icon={faChartLine}
                        className="icon uk-margin-small-right"
                      />
                      Client Intelligence
                    </NavLink>
                  </li>
                  {hasViewClientProfileManagementPermission && (
                    <>
                      <li>
                        <NavLink to={"clients"} className="navlink">
                          <FontAwesomeIcon
                            icon={faUsers}
                            className="icon uk-margin-small-right"
                          />
                          Entities
                        </NavLink>
                      </li>
                    </>
                  )}
                  {hasViewMoneyMarketAccountPermission && (
                    <>
                      {" "}
                      <li>
                        <NavLink to={"accounts"} className="navlink">
                          <FontAwesomeIcon
                            icon={faBriefcase}
                            className="icon uk-margin-small-right"
                          />
                          Accounts
                        </NavLink>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </>
        )}

        {hasViewProductManagementPermission && (
          <>
            {" "}
            <li className="list-item">
              <NavLink to={"products"} className="navlink">
                <FontAwesomeIcon
                  icon={faThLarge}
                  className="icon uk-margin-small-right"
                />
                Products
              </NavLink>
            </li>
          </>
        )}
        {hasViewPricingPermission && (
          <>
            {" "}
            <li className="list-item">
              <NavLink to={"pricing"} className="navlink">
                <FontAwesomeIcon
                  icon={faDollarSign}
                  className="icon uk-margin-small-right"
                />
                Daily Pricing Upload
              </NavLink>
            </li>
          </>
        )}
        {hasViewInstrumentManagementPermission && (
          <>
            {" "}
            <li className="list-item">
              <NavLink to={"instruments"} className="navlink">
                <FontAwesomeIcon
                  icon={faThLarge}
                  className="icon uk-margin-small-right"
                />
                Instruments
              </NavLink>
            </li>
          </>
        )}
        {(hasViewBankReconciliationPermission ||
          hasViewClientDepositAndDepositPermission ||
          hasViewWithdrawalAndPaymentPermission ||
          hasViewAssetManagerFlowPermission ||
          hasViewSwitchesPermission ||
          hasViewPurchasePermission ||
          hasViewProcessPermission) && (
          <>
            <ul className="main-list uk-nav-default" data-uk-nav>
              <li className="list-item uk-parent">
                <NavLink to={"/transactions"} className="navlink">
                  <FontAwesomeIcon
                    icon={faExchange}
                    className="icon uk-margin-small-right"
                  />
                  Transactions
                  <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
                </NavLink>
                <ul className="uk-nav-sub">
                  {/* {hasViewBankReconciliationPermission && ( */}
                  <>
                    {" "}
                    <li>
                      <NavLink to={"transactions-overview"} className="navlink">
                        <FontAwesomeIcon
                          icon={faCaretRight}
                          className="icon uk-margin-small-right"
                        />
                        Transactions Intelligence
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to={"bank-recon"} className="navlink">
                        <FontAwesomeIcon
                          icon={faCaretRight}
                          className="icon uk-margin-small-right"
                        />
                        Deposits (Bank Upload)
                      </NavLink>
                    </li>
                  </>
                  {/* // )} */}
                  {hasViewClientDepositAndDepositPermission && (
                    <>
                      {" "}
                      <li>
                        <NavLink
                          to={"client-deposit-allocation"}
                          className="navlink">
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            className="icon uk-margin-small-right"
                          />
                          Deposits
                        </NavLink>
                      </li>
                    </>
                  )}
                  {hasViewClientDepositAndDepositPermission && (
                    <>
                      {" "}
                      <li>
                        <NavLink
                          to={"client-deposit-notices"}
                          className="navlink">
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            className="icon uk-margin-small-right"
                          />
                          Deposit Notices
                        </NavLink>
                      </li>
                    </>
                  )}
                  {hasViewWithdrawalAndPaymentPermission && (
                    <>
                      <li>
                        <NavLink
                          to={"client-withdrawal-recurring-payment"}
                          className="navlink">
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            className="icon uk-margin-small-right"
                          />
                          Recurring Withdrawals
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          to={"client-withdrawal-payment"}
                          className="navlink">
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            className="icon uk-margin-small-right"
                          />
                          Withdrawals
                        </NavLink>
                      </li>
                    </>
                  )}
                  {hasViewWithdrawalAndPaymentPermission && (
                    <>
                      {" "}
                      <li>
                        <NavLink to={"client-payment"} className="navlink">
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            className="icon uk-margin-small-right"
                          />
                          Payments
                        </NavLink>
                      </li>
                    </>
                  )}
                  {hasViewAssetManagerFlowPermission && (
                    <>
                      {" "}
                      <li>
                        <NavLink to={"asset-manager-flows"} className="navlink">
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            className="icon uk-margin-small-right"
                          />
                          Asset Manager Flows
                        </NavLink>
                      </li>
                    </>
                  )}
                  {hasViewSwitchesPermission && (
                    <>
                      {" "}
                      <li>
                        <NavLink to={"switch"} className="navlink">
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            className="icon uk-margin-small-right"
                          />
                          Switch
                        </NavLink>
                      </li>
                    </>
                  )}
                  {hasViewPurchasePermission && (
                    <>
                      {" "}
                      <li>
                        <NavLink to={"purchases"} className="navlink">
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            className="icon uk-margin-small-right"
                          />
                          Purchase
                        </NavLink>
                      </li>
                    </>
                  )}
                  {hasViewProcessPermission && (
                    <>
                      <li>
                        <NavLink
                          to={"transaction-processing"}
                          className="navlink">
                          <FontAwesomeIcon
                            icon={faCaretRight}
                            className="icon uk-margin-small-right"
                          />
                          Processing
                        </NavLink>
                      </li>
                    </>
                  )}
                </ul>
              </li>
            </ul>
          </>
        )}

        <ul className="main-list uk-nav-default" data-uk-nav>
          <li className="list-item uk-parent">
            <NavLink to={"/transactions"} className="navlink">
              <FontAwesomeIcon
                icon={faChartLine}
                className="icon uk-margin-small-right"
              />
              Reports
              <FontAwesomeIcon icon={faCaretDown} className="down-arrow" />
            </NavLink>
            <ul className="uk-nav-sub">
              {/* {hasViewBankReconciliationPermission && ( */}
              <>
                {" "}
                <li>
                  <NavLink to={"daily-transaction-report"} className="navlink">
                    <FontAwesomeIcon
                      icon={faCaretRight}
                      className="icon uk-margin-small-right"
                    />
                    Daily Transaction Report
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink to={"bank-recon"} className="navlink">
                    <FontAwesomeIcon
                      icon={faCaretRight}
                      className="icon uk-margin-small-right"
                    />
                    Deposits (Bank Upload)
                  </NavLink>
                </li> */}
              </>
            </ul>
          </li>
        </ul>

        {hasViewCounterPartyManagementPermission && (
          <>
            {" "}
            <li className="list-item">
              <NavLink to={"counterparty"} className="navlink">
                <FontAwesomeIcon
                  icon={faPeopleArrows}
                  className="icon uk-margin-small-right"
                />
                Counterparty
              </NavLink>
            </li>
          </>
        )}
        {hasViewUserManagementPermission && (
          <>
            <li className="list-item">
              <NavLink to={"settings"} className="navlink">
                <FontAwesomeIcon
                  icon={faGear}
                  className="icon uk-margin-small-right"
                />
                Settings
              </NavLink>
            </li>
          </>
        )}

        <li className="list-item">
          <NavLink to={"logout"} className="navlink">
            <FontAwesomeIcon
              icon={faRedo}
              className="icon uk-margin-small-right"
            />
            Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

const DrawerContent = () => {
  return (
    <div className="drawer-content">
      <USER_DRAWER />
    </div>
  );
};

const OverlayDrawer = () => {
  return (
    <div id="navbar-drawer" data-uk-offcanvas="overlay: true">
      <div className="uk-offcanvas-bar">
        <button
          className="uk-offcanvas-close"
          type="button"
          data-uk-close></button>
        <DrawerContent />
      </div>
    </div>
  );
};

const FixedDrawer = () => {
  return (
    <div className="drawer-layout uk-visible@s">
      <AccountLogo />
      <DrawerContent />
    </div>
  );
};

const Drawer = () => {
  return (
    <ErrorBoundary>
      <OverlayDrawer />
      <FixedDrawer />
    </ErrorBoundary>
  );
};

export default Drawer;

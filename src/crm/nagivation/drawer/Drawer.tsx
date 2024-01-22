import { NavLink, useNavigate } from "react-router-dom";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import "./Drawer.scss";

import { useState } from "react";
import { useAppContext } from "../../../shared/functions/Context";

const USER_DRAWER = () => {
 const { api, store, ui } = useAppContext();
 const THEME_KEY = "theme";
 const [theme, setTheme] = useState(localStorage.getItem(THEME_KEY) || ":root");

 const navigate = useNavigate();

 const me = store.auth.meJson;
 const name = me ? me.displayName || " " : " ";
 const initials = name
   .split(" ")
   .map((name) => name[0])
   .join("");
  const handleLogOut = () => {
    api.auth.onSignedOut();
  };
  return (
    <aside className="crm-container">
      <div className="toggle ">
        <div className="crm-logo">
          <img src={process.env.PUBLIC_URL + "/IJG.png"} alt="Logo" />
          {/* <h2>
            I<span className="danger">JG</span>
          </h2> */}
        </div>
        <div className="close" id="close-btn">
          <span className="material-icons-sharp">close</span>
        </div>
      </div>

      <div className="sidebar">
        <NavLink to="/l/dashboard">
          <span className="material-icons-sharp">dashboard</span>
          <h3>Dashboard</h3>
        </NavLink>
        <NavLink to="/l/deposit">
          <span className="material-icons-sharp">person_outline</span>
          <h3>Deposits</h3>
        </NavLink>

        <NavLink to="/l/withdraw">
          <span className="material-icons-sharp">receipt_long</span>
          <h3>Withdrawals</h3>
        </NavLink>
        <NavLink to="/l/user-settings">
          <span className="material-icons-sharp">insights</span>
          <h3>User settings</h3>
        </NavLink>

        {/* <NavLink to="/reports">
          <span className="material-icons-sharp">report_gmailerrorred</span>
          <h3>Reports</h3>
        </NavLink> */}

        {/* <NavLink to="/new-login">
          <span className="material-icons-sharp">add</span>
          <h3>New Login</h3>
        </NavLink> */}
        <NavLink to="/logout" onClick={handleLogOut}>
          <span className="material-icons-sharp">logout</span>
          <h3>Logout</h3>
        </NavLink>
      </div>
    </aside>
  );
};

const DrawerContent = () => {
  return (
    <>
      <USER_DRAWER />
    </>
  );
};

const FixedDrawer = () => {
  return <DrawerContent />;
};

const Drawer = () => {
  return (
    <ErrorBoundary>
      <FixedDrawer />
    </ErrorBoundary>
  );
};

export default Drawer;

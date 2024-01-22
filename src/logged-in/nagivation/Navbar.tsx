import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import Dropdown from "../../shared/components/dropdown/Dropdown";
import { useAppContext } from "../../shared/functions/Context";
import icons from "../../shared/utils/icons";
import { useEffect, useState } from "react";

const Navbar = observer(() => {
  const { api, store, ui } = useAppContext();
  const THEME_KEY = "theme";
  const [theme, setTheme] = useState(localStorage.getItem(THEME_KEY) || ":root");

  const navigate = useNavigate();

  const me = store.auth.meJson;
  const name = me ? me.displayName || " " : " ";
  const initials = name.split(" ").map((name) => name[0]).join("");

  const handleLogOut = () => {
    api.auth.onSignedOut();
  };

  const navigateBack = () => {
    if (ui.backPath) navigate(ui.backPath);
    else navigate(-1);
    ui.hideBackButton();
  };

  const handleToggle = () => {
    const body = document.body;
    body.classList.toggle("dark");
    setTheme(body.classList.contains("dark") ? "dark" : ":root");
  };

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <div className="sticky" data-uk-sticky="sel-target: .uk-navbar; cls-active: uk-navbar-sticky">
      <nav className="ijg-navbar" data-uk-navbar>
        <div className="uk-navbar-left uk-hidden@s">
          <button
            className="uk-navbar-toggle"
            data-uk-navbar-toggle-icon
            data-uk-toggle="target: #navbar-drawer"
          ></button>
        </div>
        <div className="navbar-title uk-navbar-left uk-margin-left">
          {ui.backButton && (
            <div className="icon">
              <span
                data-uk-icon="icon: arrow-left; ratio: 1.2"
                onClick={navigateBack}
              ></span>
            </div>
          )}
          <p>{ui.title}</p>
        </div>
        <div className="uk-navbar-center">
          <button className="btn-primary theme-btn" onClick={handleToggle}> {theme === ":root" ? "🌙" : "☀️"}</button>
        </div>
        <div className="navbar-right uk-navbar-right">
          <ul className="uk-navbar-nav">
            <li className="avartar-li-item">
              <p className="avartar-username">
                <span className="name">{me?.displayName}</span>
                <br />
                <span className="job-title">{me?.jobTitle || "Unknown"}</span>
              </p>
              <button className="user-avartar">
                <img src={icons.user} alt={initials} width="24" height="24" data-uk-svg />
              </button>
              <Dropdown>
                <li>
                  <button className="kit-dropdown-btn" onClick={handleLogOut}>
                    <span
                      className="uk-margin-small-right"
                      data-uk-icon="sign-out"
                    ></span>
                    Sign out
                  </button>
                </li>
              </Dropdown>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
});

export default Navbar;

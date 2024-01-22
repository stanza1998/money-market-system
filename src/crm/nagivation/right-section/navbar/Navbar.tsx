import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router";
import Dropdown from "../../../../shared/components/dropdown/Dropdown";
import { useAppContext } from "../../../../shared/functions/Context";
import icons from "../../../../shared/utils/icons";
import { useEffect, useState } from "react";
import DarkModeToggle from "../../../components/darkModeToggle/DarkModeToggle";
import "./Navbar.scss";

const Navbar = observer(() => {
  const { api, store, ui } = useAppContext();
  const THEME_KEY = "theme";
  const [theme, setTheme] = useState(
    localStorage.getItem(THEME_KEY) || ":root"
  );

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


  const sideMenu: HTMLElement | null = document.querySelector("aside");
  const menuBtn: HTMLElement | null = document.getElementById("menu-btn");
  const closeBtn: HTMLElement | null = document.getElementById("close-btn");
  const darkMode: HTMLElement | null = document.querySelector(".dark-mode");

  const handleToggle = () => {
    const body = document.body;
    body.classList.toggle("dark-mode-variables");
    setTheme(
      body.classList.contains("dark-mode-variables")
        ? "dark-mode-variables"
        : ":root"
    );
  };

  //bad practice
  const toggleSidebar = () => {
    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        if (sideMenu) {
          console.log("Show me");
          sideMenu.style.display = "block";
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (sideMenu) {
          sideMenu.style.display = "none";
        }
      });
    }

    if (darkMode) {
      darkMode.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode-variables");
        const firstSpan: Element | null =
          darkMode.querySelector("span:nth-child(1)");
        const secondSpan: Element | null =
          darkMode.querySelector("span:nth-child(2)");

        if (firstSpan) {
          firstSpan.classList.toggle("active");
        }

        if (secondSpan) {
          secondSpan.classList.toggle("active");
        }
      });
    }
    console.log("Clicked");
  };

  // useEffect(() => {
  //   document.body.classList.toggle(
  //     "dark-mode-variables",
  //     theme === "dark-mode-variables"
  //   );
  //   localStorage.setItem(THEME_KEY, theme);
  // }, [theme]);

  return (
    <div className="nav">
      <button type="button" id="menu-btn" onClick={toggleSidebar}>
        <span className="material-icons-sharp">menu</span>
      </button>
      <DarkModeToggle />

      <div className="profile">
        <div className="info">
          <p>
            Hey, <b>{me?.displayName}</b>
          </p>
          <small className="text-muted">{me?.role || "Unknown"}</small>
        </div>
        <div className="profile-photo">
          <img src="/IJG.png"/>
        </div>
      </div>
    </div>
  );
});

export default Navbar;

import React, { useState } from "react";
import Navbar from "./navbar/Navbar";
import UserProfile from "./userProfiles/UserProfile";
import Reminders from "./reminders/Reminders";
import { useAppContext } from "../../../shared/functions/Context";
import { useNavigate } from "react-router-dom";

function RightSection() {
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

  //  const handleLogOut = () => {
  //    api.auth.onSignedOut();
  //  };

  return (
    <div className="right-section">
      <Navbar />
      <UserProfile
        username="IJG"
        jobTitle="Web Developer"
        logoSrc="/logo_1.png"
      />

      <Reminders />
    </div>
  );
}

export default RightSection;

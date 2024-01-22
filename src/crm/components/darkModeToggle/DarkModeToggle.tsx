import React, { useState, useEffect } from "react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

const toggleDarkMode = () => {
  const newMode = !isDarkMode;
  setIsDarkMode(newMode);

  const body = document.body;
  const darkModeVariables = document.querySelector(".crm-container");

  if (darkModeVariables) {
    console.log("Dark mode toggled:", newMode);

    body.classList.toggle("dark-mode-variables", newMode);
    // Store the current mode in localStorage
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  } else {
    console.error("Could not find .dark-mode-variables element.");
  }
};

  useEffect(() => {
    // Retrieve the stored mode from localStorage and apply it on component mount
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      const parsedDarkMode = JSON.parse(storedDarkMode);
      setIsDarkMode(parsedDarkMode);
      document.body.classList.toggle("dark-mode-variables", parsedDarkMode);

      const firstSpan = document.querySelector(".dark-mode span:nth-child(1)");
      const secondSpan = document.querySelector(".dark-mode span:nth-child(2)");

      if (firstSpan && secondSpan) {
        firstSpan.classList.toggle("active", parsedDarkMode);
        secondSpan.classList.toggle("active", !parsedDarkMode);
      }
    }
  }, []);
  return (
    <div
      className={`dark-mode ${isDarkMode ? "dark-mode-variables" : ""}`}
      onClick={toggleDarkMode}>
      <span className={`material-icons-sharp ${isDarkMode ? "active" : ""}`}>
        light_mode
      </span>
      <span className="material-icons-sharp">dark_mode</span>
    </div>
  );
};

export default DarkModeToggle;

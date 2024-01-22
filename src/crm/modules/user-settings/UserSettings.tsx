import React, { useState } from "react";
import "./UserSettings.scss";

const UserSettings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handlePasswordReset = () => {
    // Implement password reset logic
    console.log("Password reset logic here");
  };

  const handleChangeContactDetails = () => {
    // Implement change contact details logic
    console.log("Change contact details logic here");
  };

  return (
    <div className="user-settings">
      <h2>User Settings</h2>
      <div className="settings-section">
        <h3>Password Reset</h3>
        <div className="input-group">
          <label htmlFor="currentPassword">Current Password:</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmNewPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <button onClick={handlePasswordReset}>Reset Password</button>
      </div>

      <div className="settings-section">
        <h3>Contact Details</h3>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button onClick={handleChangeContactDetails}>Save Changes</button>
      </div>
    </div>
  );
};

export default UserSettings;

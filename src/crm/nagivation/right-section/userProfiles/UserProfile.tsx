import React from "react";
import "./UserProfile.scss";

interface UserProfileProps {
  username: string;
  jobTitle: string;
  logoSrc: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  username,
  jobTitle,
  logoSrc,
}) => {
  return (
    <div className="user-profile">
      <div className="logo">
        {/* <img src={logoSrc} alt="User Logo" /> */}
        <h2>{username}</h2>
        <p>{jobTitle}</p>
      </div>
    </div>
  );
};

export default UserProfile;

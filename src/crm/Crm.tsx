import { observer } from "mobx-react-lite";
import MainLayout from "./logged-in/main-layout/MainLayout";
import Drawer from "./nagivation/drawer/Drawer";
import Navbar from "./nagivation/right-section/navbar/Navbar";
import UserProfile from "./nagivation/right-section/userProfiles/UserProfile";
import Reminders from "./nagivation/right-section/reminders/Reminders";
import RightSection from "./nagivation/right-section/RightSection";

const LoggedOut = observer(() => {
  return (
    <div className="crm-container">
      <div className="container">
        <Drawer />
        <main>
          <MainLayout />
        </main>
        {/*  Right Section */}
        <RightSection />
      </div>
    </div>
  );
});

export default LoggedOut;

import { useState } from "react";
import { observer } from "mobx-react-lite";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import Toolbar from "../../shared/toolbar/Toolbar";
import SettingsTabs from "./SettingsTabs";
import IssuerList from "./IssuerList";
import CouterPartyList from "./CouterPartyList";
import Products from "../../data-tables/products/all-products/ProductsDataTable";
import Users from "../../data-tables/settings/users/Users";

const AdminSettings = observer(() => {
  const [selectedTab, setselectedTab] = useState("users-tab");

  return (
    <ErrorBoundary>
      <div className="admin-settings uk-section uk-section-small">
        <div className="uk-container uk-container-xlarge">
          <div className="sticky-top">
            <ErrorBoundary>
              <Toolbar
                leftControls={
                  <SettingsTabs
                    selectedTab={selectedTab}
                    setSelectedTab={setselectedTab}
                  />
                }
                rightControls={<></>}
              />
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            <div className="uk-margin">
              {/* {selectedTab === "users-tab" &&
                <>
                  <h4 className="main-title-lg">System Users</h4>
                  <UserList />
                </>
              } */}
              {selectedTab === "users-tab" &&
                <>
                  <h4 className="main-title-lg">System Users</h4>
                  <Users />
                </>
              }
              {selectedTab === "products-tab" &&
                <>
                  <h4 className="main-title-lg">IJG Money Market Solutions</h4>
                  <Products />
                </>
              }
              {selectedTab === "issuers-tab" &&
                <>
                  <h4 className="main-title-lg">Issuers</h4>
                  <IssuerList />
                </>
              }
              {selectedTab === "counter-parties-tab" &&
                <>
                  <h4 className="main-title-lg">Counter Party List</h4>
                  <CouterPartyList />
                </>
              }

            </div>
          </ErrorBoundary>
        </div >
      </div >
    </ErrorBoundary >
  );
});

export default AdminSettings;

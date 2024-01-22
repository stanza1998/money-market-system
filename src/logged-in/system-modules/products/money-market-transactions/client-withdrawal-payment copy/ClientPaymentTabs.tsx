import { ChangeEvent } from "react";
import "./ClientPaymentTabs.scss";

interface TabProps {
  index: number;
  id: string;
  name: string;
  selectedTab: string;
  handleTabChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Tab: React.FC<TabProps> = ({
  id,
  index,
  name,
  selectedTab,
  handleTabChange,
}) => {
  return (
    <>
      <label className="tab" htmlFor={id}>
        {name}
      </label>
      <input
        type="radio"
        id={id}
        name="tabs"
        checked={selectedTab === id}
        onChange={handleTabChange}
      />
    </>
  );
};

interface IProps {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}

const ClientWithdrawalPaymentTabs = (props: IProps) => {
  const { selectedTab, setSelectedTab } = props;

  const handleTabChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSelectedTab(event.target.id);
  };

  return (
    <div className="tab-container-deduction-companies">
      <div className="tabs">
        {/* <Tab
          id="pending-tab"
          name="Pending Payments"
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          index={1}
        />
        <Tab
          id="verified-tab"
          name="Verified Payments"
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          index={1}
        /> */}
        <Tab
          id="authorised-tab"
          name="Authorised Payments"
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          index={1}
        />
        <Tab
          id="batch-tab"
          name="Batch Files"
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          index={2}
        />
        <Tab
          id="processed-tab"
          name="Processed Payments"
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          index={3}
        />
        <span className="glider"></span>
      </div>
    </div>
  );
};

export default ClientWithdrawalPaymentTabs;

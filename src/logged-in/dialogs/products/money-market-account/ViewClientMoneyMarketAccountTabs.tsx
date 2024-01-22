import { ChangeEvent } from "react";
import "./ViewClientMoneyMarketAccountTabs.scss";

interface TabProps {
    id: string;
    name: string;
    selectedTab: string;
    handleTabChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Tab: React.FC<TabProps> = ({
    id,
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

const ViewClientMoneyMarketAccountTabs = (props: IProps) => {

    const { selectedTab, setSelectedTab } = props;

    const handleTabChange = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        setSelectedTab(event.target.id);
    };

    return (
        <div className="client-tabs">
            <div className="tabs">
                <Tab
                    id="transactions-tab"
                    name="Transactions"
                    selectedTab={selectedTab}
                    handleTabChange={handleTabChange}/>
                <Tab
                    id="interest-tab"
                    name="Daily Interest Log"
                    selectedTab={selectedTab}
                    handleTabChange={handleTabChange}/>
                <span className="glider"></span>
            </div>
        </div>
    );
};

export default ViewClientMoneyMarketAccountTabs;

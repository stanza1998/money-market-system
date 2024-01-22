import { ChangeEvent } from "react";
import "./TransactionProcessingTabs.scss";

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

const ClientAllocationTabs = (props: IProps) => {

    const { selectedTab, setSelectedTab } = props;

    const handleTabChange = (
        event: ChangeEvent<HTMLInputElement>
    ): void => {
        setSelectedTab(event.target.id);
    };

    return (
        <div className="tab-container-deduction-companies">
            <div className="tabs">
                <Tab
                    id="treasury-bills-tab"
                    name="Treasury Bills"
                    selectedTab={selectedTab}
                    handleTabChange={handleTabChange} index={1}
                />
                {/* <Tab
                    id="bonds-tab"
                    name="Bonds"
                    selectedTab={selectedTab}
                    handleTabChange={handleTabChange} index={2}
                /> */}
                <span className="glider"></span>
            </div>
        </div>
    );
};

export default ClientAllocationTabs;

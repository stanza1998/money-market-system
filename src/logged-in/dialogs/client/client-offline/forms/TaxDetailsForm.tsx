import { observer } from "mobx-react-lite";
import { FormEvent, useState } from "react";
import ErrorBoundary from "../../../../../shared/components/error-boundary/ErrorBoundary";
import { INaturalPerson } from "../../../../../shared/models/clients/NaturalPersonModel";
import Toolbar from "../../../../shared/toolbar/Toolbar";

interface ITaxDetailProps {
    client: INaturalPerson;
    setClient: React.Dispatch<React.SetStateAction<INaturalPerson>>;
    onSubmitTaxDetail: (e: FormEvent<HTMLFormElement>) => void;
    onBackToAccountDetail: () => void;
}

export const TaxDetailsForm = observer((props: ITaxDetailProps) => {
    const { client, setClient, onSubmitTaxDetail, onBackToAccountDetail } = props;
    const [noTin, setNoTin] = useState(false);

    const onChange = (name: | "tin" | "tinCountryOfIssue" | "vatNumber" | "reasonForNoTIN", value: string) => {
        const taxDetail = { ...client.taxDetail };
        if (name === "tin") {
            taxDetail.tin = value;
        }
        if (name === "tinCountryOfIssue") {
            taxDetail.tinCountryOfIssue = value;
        }
        if (name === "vatNumber") {
            taxDetail.vatNumber = value;
        }
        if (name === "reasonForNoTIN") {
            taxDetail.reasonForNoTIN = value;
        }
        setClient({ ...client, taxDetail: taxDetail });
    };

    return (
        <ErrorBoundary>
            <form className="uk-form-stacked uk-grid-small" data-uk-grid
                onSubmit={onSubmitTaxDetail}>
                <div className="uk-width-1-1 uk-margin-top-small">
                    <hr className="uk-width-1-1" />
                    <Toolbar title={"Tax Details"}
                    />
                    <hr className="uk-width-1-1" />
                </div>
                <div className="uk-width-1-1">
                    <label className="uk-form-label" htmlFor="restricted">This client has no Tax Identification No.</label>
                    <div className="uk-form-controls">
                        <input
                            className="uk-checkbox"
                            id="restricted"
                            type="checkbox"
                            checked={noTin}
                            onChange={(e) => setNoTin(e.target.checked)}
                        />
                    </div>
                    {
                        noTin &&
                        <>
                            <label className="uk-form-label required" htmlFor="reasonForNoTIN">Reason For No TIN</label>
                            <div className="uk-form-controls">
                                <input
                                    id="reasonForNoTIN"
                                    className="uk-input uk-form-small"
                                    type="text"
                                    value={client.taxDetail.reasonForNoTIN}
                                    name={"reasonForNoTIN"}
                                    onChange={(e) => onChange("reasonForNoTIN", e.target.value)}
                                />
                            </div>
                        </>
                    }
                </div>
                {
                    !noTin &&
                    <>
                        <div className="uk-width-1-2">
                            <label className="uk-form-label required" htmlFor="tin">TIN</label>
                            <div className="uk-form-controls">
                                <input
                                    id="tin"
                                    className="uk-input uk-form-small"
                                    type="text"
                                    value={client.taxDetail.tin}
                                    name={"tin"}
                                    onChange={(e) => onChange("tin", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="uk-width-1-2">
                            <label className="uk-form-label required" htmlFor="tinCountryOfIssue">TIN Country Of Issue</label>
                            <div className="uk-form-controls">
                                <input
                                    id="tinCountryOfIssue"
                                    className="uk-input uk-form-small"
                                    type="text"
                                    value={client.taxDetail.tinCountryOfIssue}
                                    name={"tinCountryOfIssue"}
                                    onChange={(e) => onChange("tinCountryOfIssue", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    </>
                }
                <div className="uk-width-1-1 uk-text-right">
                    <button
                        className="btn-text uk-margin-right"
                        type="button"
                        onClick={onBackToAccountDetail}
                    >
                        Back
                    </button>
                    <button
                        className="btn btn-primary"
                        type="submit"
                    >
                        Next
                    </button>
                </div>
            </form>
        </ErrorBoundary>
    );
});
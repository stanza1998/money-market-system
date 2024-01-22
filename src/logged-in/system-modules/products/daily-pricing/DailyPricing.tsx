import { observer } from "mobx-react-lite";
import ProductDailyPricingDataTable from "../../../data-tables/products/product-daily-pricing/ProductDailyPricingDataTable";
import Toolbar from "../../../shared/toolbar/Toolbar";
import showModalFromId from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../dialogs/ModalName";
import { useAppContext } from "../../../../shared/functions/Context";

const DailyPricing = observer(() => {
  const { store } = useAppContext();
  const user = store.auth.meJson;;
  const onUploadDailyPricing = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.UPLOAD_DAILY_PRICING_MODAL);
  };
  const hasPricingPermission = user?.feature.some(
    (feature) => feature.featureName === "Pricing" && feature.create === true
  );

  return (
    <div className="page uk-section uk-section-small">
      <div className="uk-container uk-container-expand">
        <div className="sticky-top">
          <Toolbar
            title="Daily Pricing"
            rightControls={
              <>
                {hasPricingPermission && (
                  <>
                    {" "}
                    <button
                      className="btn btn-primary"
                      onClick={onUploadDailyPricing}
                    >
                      Upload Daily Pricing
                    </button>
                  </>
                )}
              </>
            }
          />
          <hr />
        </div>

        <div className="uk-card page-main-card">
          <div
            className="uk-grid uk-grid-small uk-child-width-1-1"
            data-uk-grid
          >
            <ProductDailyPricingDataTable />
          </div>
        </div>
      </div>
    </div>
  );
});

export default DailyPricing;

import { useAppContext } from "../../../shared/functions/Context";

import Toolbar from "../../shared/toolbar/Toolbar";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import ProductModal from "../../dialogs/crud/products/ProductModal";
import Modal from "../../../shared/components/Modal";

import { observer } from "mobx-react-lite";
import MoneyMarketAccountModal from "../../dialogs/crud/products/money-market-account/MoneyMarketAccountModal";
import ProductsDataTable from "../../data-tables/products/all-products/ProductsDataTable";

const Products = observer(() => {
  const { store } = useAppContext();
  const user = store.auth.meJson;
  const hasCreatePermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Product Management" && feature.create === true
  );

  const onAddNewProduct = () => {
    store.product.clearSelected();
    showModalFromId(MODAL_NAMES.ADMIN.PRODUCT_MODAL);
  };

  const onUploadDailyPricing = () => {
    showModalFromId(MODAL_NAMES.BACK_OFFICE.UPLOAD_DAILY_PRICING_MODAL);
  };

  return (
    <div className="page uk-section uk-section-small">
      <div className="uk-container uk-container-expand">
        <div className="sticky-top">
          <Toolbar
            title="Products"
            rightControls={
              <>
                {hasCreatePermission && (
                  <>
                    {" "}
                    <button
                      className="btn btn-primary"
                      onClick={onAddNewProduct}
                    >
                      Add New Product
                    </button>
                    <button
                      className="btn btn-text"
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

        <div className="page-main-card uk-card uk-card-default uk-card-body">
          <ProductsDataTable />
        </div>
      </div>
      <Modal modalId={MODAL_NAMES.ADMIN.PRODUCT_MODAL}>
        <ProductModal />
      </Modal>
      <Modal modalId={MODAL_NAMES.ADMIN.MONEY_MARKET_ACCOUNT_MODAL}>
        <MoneyMarketAccountModal />
      </Modal>
    </div>
  );
});

export default Products;

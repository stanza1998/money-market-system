import { IconButton, Box } from "@mui/material";
import { GridColDef, DataGrid } from "@mui/x-data-grid";
import { observer } from "mobx-react-lite";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import MoneyMarketAccount, { IMoneyMarketAccount } from "../../../../shared/models/MoneyMarketAccount";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import AppStore from "../../../../shared/stores/AppStore";
import MODAL_NAMES from "../../../dialogs/ModalName";
import { IProduct } from "../../../../shared/models/ProductModel";
import { useState } from "react";
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CalendarViewDayIcon from '@mui/icons-material/CalendarViewDay';
import AllProductMoneyMarketAccountsModal from "../../../dialogs/products/product-money-market-accounts/AllProductMoneyMarketAccountsModal";
import UpdateProductBaseRateModal from "../../../dialogs/products/daily-pricing/UpdateProductBaseRateModal";
import App from "../../../../App";
import Modal from "../../../../shared/components/Modal";
import { IProductDailyPricing } from "../../../../shared/models/ProductDailyPricingModel";

interface IProps {
  data: IProductDailyPricing[];
}

export const DailyPricingGrid = observer(({ data }: IProps) => {
  const { api ,store } = useAppContext();
  const onNavigate = useNavigate();
  const user = store.auth.meJson;
  const [productAccounts, setProductAccounts] = useState<MoneyMarketAccount[]>();
  

  const onViewInstruments = async (productId: string,store:AppStore) => {
    await api.mma.getAll();

    setProductAccounts(store.mma.allProductAccounts(productId));
    showModalFromId(MODAL_NAMES.BACK_OFFICE.ALL_PRODUCT_ACCOUNTS_MODAL);
  }

  const onUpdateRate = async (productId: string,store:AppStore) => {
    await api.mma.getAll();

    setProductAccounts(store.mma.allProductAccounts(productId));
    const selectedProduct = store.product.getItemById(productId);

    if (selectedProduct) {
      store.product.select(selectedProduct.asJson);
      showModalFromId(MODAL_NAMES.BACK_OFFICE.UPDATE_PRODUCT_BASE_RATE_MODAL);
    }
  }

  const onEdit = (product: string,store:AppStore) => {
    const selectedProduct = store.product.getItemById(product);

    if (selectedProduct) {
      store.product.select(selectedProduct.asJson);
      showModalFromId(MODAL_NAMES.ADMIN.PRODUCT_MODAL);
    }
  }

  const onDelete = async (product: string) => {
    const selectedProduct = store.product.getItemById(product);

    if (selectedProduct) {
      await api.product.delete(selectedProduct.asJson)
    }
  }

  // const onViewAccount = (accountId: string) => {
  //   const selectedAccount = store.mma.getItemById(accountId);

  //   if (selectedAccount) {
  //     store.mma.select(selectedAccount.asJson);
  //     showModalFromId(MODAL_NAMES.ADMIN.VIEW_MONEY_MARKET_ACCOUNT_MODAL);
  //   }
  // }

  const hasMoneyMarketAccountManagementPermission = user?.feature.some(
    (feature) =>
      feature.featureName === "Money Market Account Management" &&
      feature.update === true
  );

  const columns: GridColDef[] = [
    {
      field: "updateDate",
      headerName: "Date",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "productName",
      headerName: "Product Name",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "productCode",
      headerName: "Product Code",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
    {
      field: "oldRate",
      headerName: "Old Rate",
      flex: 1,
      headerClassName: "grid",
    },
    {
      field: "newRate",
      headerName: "New Rate",
      flex: 1,
      headerClassName: "grid",
      // Apply the same class for consistency
    },
  ];

  return (
    <>
     <div className="grid">
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.key} // Use the appropriate identifier property
          rowHeight={50}
        />
      </Box>
    </div>
    <div>
    <Modal modalId={MODAL_NAMES.BACK_OFFICE.ALL_PRODUCT_ACCOUNTS_MODAL}>
        {
          productAccounts &&
          <AllProductMoneyMarketAccountsModal accounts={productAccounts} />
        }
      </Modal>

      <Modal modalId={MODAL_NAMES.BACK_OFFICE.UPDATE_PRODUCT_BASE_RATE_MODAL}>
        {
          <UpdateProductBaseRateModal accounts={productAccounts?productAccounts:[]} />
        }
      </Modal>
    </div>
    </>
   
  );
});

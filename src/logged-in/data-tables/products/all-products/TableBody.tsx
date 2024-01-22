import { Row } from "../../../../shared/components/react-ts-datatable/DataTableTypes";

import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import showModalFromId from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../../dialogs/ModalName";
import { useState } from "react";
import MoneyMarketAccount from "../../../../shared/models/MoneyMarketAccount";
import ErrorBoundary from "../../../../shared/components/error-boundary/ErrorBoundary";
import Modal from "../../../../shared/components/Modal";
import AllProductMoneyMarketAccountsModal from "../../../dialogs/products/product-money-market-accounts/AllProductMoneyMarketAccountsModal";
import UpdateProductBaseRateModal from "../../../dialogs/products/daily-pricing/UpdateProductBaseRateModal";


interface TableBodyProps {
  rows: Row[];
  length: number;
  isFiltered: boolean;
}

export const TableBody = observer(({ rows, length, isFiltered }: TableBodyProps) => {
  const hasNoData = rows.length === 0 && !isFiltered;
  const hasNoFilteredData = rows.length === 0 && isFiltered;

  const { api, store } = useAppContext();
  const [productAccounts, setProductAccounts] = useState<MoneyMarketAccount[]>();

  const onViewInstruments = async (productId: string) => {
    await api.mma.getAll();

    setProductAccounts(store.mma.allProductAccounts(productId));
    showModalFromId(MODAL_NAMES.BACK_OFFICE.ALL_PRODUCT_ACCOUNTS_MODAL);
  }

  const onUpdateRate = async (productId: string) => {
    await api.mma.getAll();

    setProductAccounts(store.mma.allProductAccounts(productId));
    const selectedProduct = store.product.getItemById(productId);

    if (selectedProduct) {
      store.product.select(selectedProduct.asJson);
      showModalFromId(MODAL_NAMES.BACK_OFFICE.UPDATE_PRODUCT_BASE_RATE_MODAL);
    }
  }

  const onEdit = (product: string) => {
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

  return (
    <ErrorBoundary>
      <tbody>
        {hasNoData && (
          <tr>
            <td colSpan={length} className="empty">
              No data available in table
            </td>
          </tr>
        )}
        {hasNoFilteredData && (
          <tr>
            <td colSpan={length} className="empty">
              No matching records found
            </td>
          </tr>
        )}
        {rows.map(({ data, key }) => (
          <tr className="custom-table-row" key={key}>
            {data.map(({ cellValue, key, isSorted }) => (
              <td key={key} className={isSorted ? 'sorted' : ''}>
                {cellValue as string}
              </td>
            ))}
            <td className="uk-text-right">
              <button className="btn btn-primary uk-margin-small-left" onClick={() => onViewInstruments(key)}>
                Accounts
              </button>
              <button className="btn btn-primary uk-margin-small-left" onClick={() => onViewInstruments(key)}>
                Daily Flows
              </button>
              <button className="btn btn-text uk-margin-small-left" onClick={() => onEdit(key)}>
                Edit
              </button>
              <button className="btn btn-text uk-margin-small-left" onClick={() => onUpdateRate(key)}>
                Update Rate
              </button>
            </td>
          </tr>
        ))}
      </tbody>
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

    </ErrorBoundary>
  );
});
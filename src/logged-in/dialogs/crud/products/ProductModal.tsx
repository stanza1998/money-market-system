import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import { IProduct, defaultProduct } from "../../../../shared/models/ProductModel";
import NumberInput from "../../../shared/number-input/NumberInput";
import MODAL_NAMES from "../../ModalName";
import swal from 'sweetalert';

const ProductModal = observer(() => {

  const { api, store } = useAppContext();
  const [product, setProduct] = useState<IProduct>({ ...defaultProduct });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const selected = store.product.selected;

    if (selected) await update(product);
    else await create(product);

    setLoading(false);
    onCancel();
  };

  const update = async (product: IProduct) => {
    try {
      await api.product.update(product);
      swal({
        icon: "success",
        text: "Product Information updated!"
      });
    } catch (error) {
    }
  };

  const create = async (product: IProduct) => {
    try {
      await api.product.create(product);
      swal({
        icon: "success",
        text: "Product created!"
      });
    } catch (error) { }
  };

  const onCancel = () => {
    store.product.clearSelected();
    setProduct({ ...defaultProduct });
    hideModalFromId(MODAL_NAMES.ADMIN.PRODUCT_MODAL);
  };

  useEffect(() => {
    if (store.product.selected) {
      setProduct(store.product.selected);
    }
  }, [store.product.selected]);

  return (
    <div className="custom-modal-style uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title text-to-break">Product</h3>
      <div className="dialog-content uk-position-relative">
        <form className="uk-form-stacked uk-grid-small" data-uk-grid
          onSubmit={handleSubmit}>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="product-code">
              Product Code
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input uk-form-small"
                id="product-code"
                type="text"
                placeholder="Product Code"
                value={product.productCode}
                onChange={(e) =>
                  setProduct({ ...product, productCode: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="product-name">
              Product Name
            </label>
            <div className="uk-form-controls">
              <input
                className="uk-input uk-form-small"
                id="product-name"
                type="text"
                placeholder="Product Name"
                value={product.productName}
                onChange={(e) =>
                  setProduct({ ...product, productName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="product-description">
              Product Description
            </label>
            <div className="uk-form-controls">
              <textarea
                className="uk-textarea uk-form-small"
                rows={5}
                id="product-description"
                placeholder="Product Description"
                value={product.productDescription}
                onChange={(e) =>
                  setProduct({ ...product, productDescription: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="uk-width-1-1">
            <label className="uk-form-label" htmlFor="product-base-rate">
              Base Rate (%)
            </label>
            <div className="uk-form-controls">
              <NumberInput
                className="uk-input uk-form-small"
                id="product-base-rate"
                value={product.baseRate}
                onChange={
                  (value) =>
                    setProduct({ ...product, baseRate: Number(value) })
                } disabled={store.product.selected ? true : false} />
            </div>
          </div>
          <div className="uk-width-1-1 uk-text-right">
            <button className="btn btn-danger" type="button" onClick={onCancel} >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit" disabled={loading} >
              Save {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default ProductModal;

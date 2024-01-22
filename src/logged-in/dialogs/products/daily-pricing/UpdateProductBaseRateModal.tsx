import { observer } from "mobx-react-lite";
import { FormEvent, useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../ModalName";
import MoneyMarketAccountModel, { IMoneyMarketAccount } from "../../../../shared/models/MoneyMarketAccount";
import NumberInput from "../../../shared/number-input/NumberInput";
import { IProduct, defaultProduct } from "../../../../shared/models/ProductModel";

interface IProps {
    accounts: MoneyMarketAccountModel[];
}

const UpdateProductBaseRateModal = observer((props: IProps) => {

    const { api, store } = useAppContext();
    const { accounts } = props;

    const [loading, setLoading] = useState(false);

    const [product, setProduct] = useState<IProduct>({ ...defaultProduct });
    const [newBaseRate, setNewBaseRate] = useState<number>(0);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const _product: IProduct = {
                ...product,
                baseRate: newBaseRate
            }
            await api.product.update(_product);
            if (accounts) {
                accounts.forEach(async account => {
                    const _productAccount: IMoneyMarketAccount = {
                        ...account.asJson,
                        baseRate: newBaseRate
                    }
                    await api.mma.updateBaseRate(_productAccount);
                });
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        onCancel();
    }

    const onCancel = () => {
        store.mma.clearSelected();
        setNewBaseRate(0);
        hideModalFromId(MODAL_NAMES.BACK_OFFICE.UPDATE_PRODUCT_BASE_RATE_MODAL);
    };

    useEffect(() => {
        if (store.product.selected) {
            setProduct(store.product.selected);
        }
    }, [store.product.selected]);

    useEffect(() => {
        const loadData = async () => {
            try {
                await api.product.getAll();
            } catch (error) { }
        };
        loadData();
    }, [
        api.product,
    ]);

    return (
        <div className="view-modal custom-modal-style uk-width-1-2 uk-modal-dialog uk-modal-body uk-margin-small-auto-vertical">
            <button
                className="uk-modal-close-default"
                type="button"
                data-uk-close
                onClick={onCancel}
            ></button>
            <h3 className="uk-modal-title text-to-break">
                {product.productName}
            </h3>
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
                                disabled
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
                                disabled
                            />

                        </div>
                    </div>
                    <div className="uk-width-1-1">
                        <label className="uk-form-label" htmlFor="product-base-rate">
                            Current Base Rate
                        </label>
                        <div className="uk-form-controls">
                            <NumberInput
                                className="uk-input uk-form-small"
                                id="product-base-rate"
                                value={product.baseRate}
                                onChange={
                                    (value) =>
                                        setNewBaseRate(Number(value))
                                }
                                disabled
                            />
                        </div>
                    </div>
                    <div className="uk-width-1-1">
                        <label className="uk-form-label" htmlFor="product-base-rate">
                            New Base Rate
                        </label>
                        <div className="uk-form-controls">
                            <NumberInput
                                className="uk-input uk-form-small"
                                id="product-base-rate"
                                value={newBaseRate}
                                onChange={
                                    (value) =>
                                        setNewBaseRate(Number(value))
                                } />
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

export default UpdateProductBaseRateModal;
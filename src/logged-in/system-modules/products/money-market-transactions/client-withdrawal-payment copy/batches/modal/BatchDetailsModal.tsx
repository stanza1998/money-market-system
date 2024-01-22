import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../../../shared/functions/Context";
import {
  IBatches,
  defaultBatches,
} from "../../../../../../../shared/models/batches/BatchesModel";
import { BatchTransactions } from "./BatchTransactionsGrid";
import { LoadingEllipsis } from "../../../../../../../shared/components/loading/Loading";

export const BatchDetailsModal = observer(() => {
  const { store, api } = useAppContext();
  const [batch, setBatch] = useState<IBatches>({
    ...defaultBatches,
  });
  const [loading, setLoading] = useState(false);
  const foundBatch = store.batches.all.find((b) => b.asJson.id === batch.id);
  const foundBatchAsInterface = store.batches.all.find((b) => b.asJson.id === batch.id)?.asJson as IBatches;

  const transactions =
    foundBatch?.asJson.batchWithdrawalTransactions
      .sort(
        (a, b) =>
          new Date(b.valueDate || 0).getTime() -
          new Date(a.valueDate || 0).getTime()
      )
      .map((t) => {
        return t;
      }) || [];

 

  useEffect(() => {
    if (store.batches.selected) {
      setBatch(store.batches.selected);
      console.log("store:", store.batches.selected);
    } else {
    }
  }, [store.batches.selected]);

  useEffect(() => {
    const getBatches = async () => {
      setLoading(true);
      try {
        await api.batches.getAll();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getBatches();
  }, [api.batches]);

  return (
    <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-1-1 ">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      {loading ? (
        <LoadingEllipsis />
      ) : (
        <>
          <div>
            <h3 className="main-title-small text-to-break">
              Batch: ({batch.batchNumber})
            </h3>
          </div>
          <div>
            <div className="uk-margin">
              <BatchTransactions data={transactions} batch={foundBatchAsInterface} />
            </div>
          </div>
        </>
      )}
    </div>
  );
});

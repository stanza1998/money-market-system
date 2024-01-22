import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import {
  IClientWithdrawalPayment,
  defaultClientWithdrawalPayment,
} from "../../../../shared/models/client-withdrawal-payment/ClientWithdrawalPaymentModel";
import { Grid, Paper, Typography } from "@mui/material";
import { currencyFormat } from "../../../../shared/functions/Directives";
import {
  dateFormat_DD_MM_YY,
  dateFormat_YY_MM_DD_NEW,
} from "../../../../shared/utils/utils";

export const ViewVerifiedTransactionModal = observer(() => {
  const { store, api } = useAppContext();
  const [withdrawalPayment, setWithdrawalPayment] =
    useState<IClientWithdrawalPayment>({ ...defaultClientWithdrawalPayment });
  const [clientName, setClientName] = useState("");

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

  const selectedClient = clients.find(
    (client) => client.asJson.entityId === clientName
  );

  const bankAccounts = selectedClient?.asJson.bankingDetail.map((acc) => ({
    label: `${acc.bankName}  ${acc.accountNumber}  ${acc.accountHolder}`,
    value: acc.accountNumber,
  }));

  //   useEffect(() => {
  //     if (store.clientWithdrawalPayment.selected) {
  //       setWithdrawalPayment(store.clientWithdrawalPayment.selected);
  //     }
  //   }, [store.clientWithdrawalPayment.selected]);

  useEffect(() => {
    if (store.clientWithdrawalPayment.selected) {
      setWithdrawalPayment(store.clientWithdrawalPayment.selected);
      setClientName(withdrawalPayment.entity);
      //   if (withdrawalPayment.recurringDay) {
      //     handleDayChange(withdrawalPayment.recurringDay.toString());
      //   }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    withdrawalPayment.entity,
    withdrawalPayment.recurringDay,
    store.clientWithdrawalPayment.selected,
  ]);

  useEffect(() => {
    const loadData = async () => {
      //   setLoading(true);
      await api.client.legalEntity.getAll();
      await api.client.naturalPerson.getAll();
      await api.mma.getAll();
      await api.user.getAll();
      //   setLoading(false);
    };
    loadData();
  }, [api.client.naturalPerson, api.client.legalEntity, api.mma, api.user]);

  return (
    <div className="view-modal custom-modal-style uk-modal-dialog uk-modal-body uk-width-2-3">
      <button
        className="uk-modal-close-default"
        // onClick={onCancel}
        type="button"
        data-uk-close
      ></button>
      <div>
        <h3 className="uk-modal-title text-to-break">
          Verified Withdrawal Transaction Payments
        </h3>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: "8px" }}>
              <Typography variant="h6" gutterBottom>
                Value Date
              </Typography>
              <Typography variant="body1" style={{ color: "black" }}>
                {dateFormat_YY_MM_DD_NEW(withdrawalPayment.valueDate)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: "8px" }}>
              <Typography variant="h6" gutterBottom>
                Client Bank Account
              </Typography>
              <Typography variant="body1" style={{ color: "black" }}>
                {bankAccounts && bankAccounts.at(0)?.label}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: "8px" }}>
              <Typography variant="h6" gutterBottom>
                Client Money Market Account
              </Typography>
              <Typography variant="body1" style={{ color: "black" }}>
                {withdrawalPayment.allocation}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3} style={{ padding: "8px" }}>
              <Typography variant="h6" gutterBottom>
                Amount
              </Typography>
              <Typography variant="body1" style={{ color: "black" }}>
                {currencyFormat(withdrawalPayment.amount)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper elevation={3} style={{ padding: "8px" }}>
              <Typography variant="h6" gutterBottom>
                Reference
              </Typography>
              <Typography variant="body1" style={{ color: "black" }}>
                {withdrawalPayment.reference}
              </Typography>
            </Paper>
          </Grid>
          {/* Add more details as needed */}
        </Grid>
      </div>
    </div>
  );
});

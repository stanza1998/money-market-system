import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { USER_ROLES } from "../../../../shared/functions/CONSTANTS";
import { useAppContext } from "../../../../shared/functions/Context";
import { IUser, UserRoles } from "../../../../shared/models/User";
import SingleSelect from "../../../../shared/components/single-select/SingleSelect";

interface IProps {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}
const ClientUserForm = observer((props: IProps) => {
  const { store } = useAppContext();
  const { user, setUser } = props;

  const clients = [
    ...store.client.naturalPerson.all,
    ...store.client.legalEntity.all,
  ];

  const clientOptions = clients.map((cli) => ({
    label: cli.asJson.entityDisplayName,
    value: cli.asJson.entityId,
  }));

  const entities = store.client.naturalPerson.all.map((n) => {
    return n.asJson;
  });
  const selectedClientFirstName =
    entities.find((e) => e.entityId === user.linkedEntityAccount)?.clientName ||
    "";
  const selectedClientId =
    entities.find((e) => e.entityId === user.linkedEntityAccount)?.id || "";

  const selectedClientEmail =
    entities.find((e) => e.entityId === user.linkedEntityAccount)?.contactDetail
      .emailAddress || "";
  const selectedClientLastName =
    entities.find((e) => e.entityId === user.linkedEntityAccount)
      ?.clientSurname || "";

  user.email = selectedClientEmail;
  // user.uid = user.lastName = selectedClientId;
  user.lastName = user.lastName = selectedClientLastName;
  user.firstName = selectedClientFirstName;
  user.role = "Client";

  return (
    <>
      <h4 className="main-title-small">User Details</h4>
      <div className="uk-form-controls uk-width-1-2">
        <label className="uk-form-label" htmlFor="">
          Client Name
        </label>
        <SingleSelect
          options={clientOptions}
          name="clientName"
          value={user.linkedEntityAccount}
          onChange={(value) => setUser({ ...user, linkedEntityAccount: value })}
          placeholder="e.g Client Name"
          required
        />
      </div>
      <small></small>
      <div className="uk-width-1-1">
        <label className="uk-form-label required" htmlFor="user-first-name">
          First name
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="user-first-name"
            type="text"
            placeholder="First name"
            value={selectedClientFirstName || ""}
            required
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label required" htmlFor="user-last-name">
          Last name
        </label>
        <div className="uk-form-controls">
          <input
            className="uk-input uk-form-small"
            id="user-last-name"
            type="text"
            placeholder="Last name"
            value={selectedClientLastName}
            required
          />
        </div>
      </div>
      <div className="uk-width-1-1">
        <label className="uk-form-label required" htmlFor="user-email">
          Email
        </label>
        <div className="uk-form-controls">
          <input
            disabled={store.user.selected ? true : false}
            className="uk-input uk-form-small"
            id="user-email"
            type="email"
            placeholder="Email"
            value={selectedClientEmail}
            required
          />
        </div>
      </div>
    </>
  );
});

export default ClientUserForm;

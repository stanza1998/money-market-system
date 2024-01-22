import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import { IUser } from "../../../shared/models/User";
import MODAL_NAMES from "../../dialogs/ModalName";

interface IProps {
  user: IUser;
}

const UserItem = (props: IProps) => {
  const { api, store } = useAppContext();

  const { user } = props;
  const cssClass = user.userVerified ? "user" : "user user__not-verified";

  const handleEdit = () => {
    store.user.select(user); // set selected user
    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL); // show modal
  };

  const handleVerify = async () => {
    if (!window.confirm("Verify user?")) return; // TODO: confirmation dialog
    try {
      await api.user.update({ ...user, userVerified: true });
    } catch (error) {
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Remove user?")) return;
   // api.user.delete(user);
  };

  return (
    <div className={`${cssClass} user-item uk-card uk-card-body uk-card-small`}>
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-flex uk-flex-middle uk-width-1-1 uk-width-expand@m">
          <h6 className="name">
            <span className="span-label">name</span>
            {user.displayName}
          </h6>
        </div>
        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="role">
            <span className="span-label">User rights</span>
            {user.role || "-"}
          </p>
        </div>
        <div className="uk-flex uk-flex-middle uk-width-1-2 uk-width-1-6@m">
          <p className="role">
            <span className="span-label">Position</span>
            {user.jobTitle || "-"}
          </p>
        </div>
        <div className="uk-flex">
          <div className="controls">
            {!user.userVerified && (
              <button className="btn-icon btn-primary uk-margin-small-right"
                onClick={handleVerify}
              ><span data-uk-icon="check"></span> Verify
              </button>
            )}
            <button className="btn-icon btn-primary" onClick={handleEdit}>
              <span data-uk-icon="pencil"></span>
            </button>
            <button className="btn-icon btn-danger" onClick={handleDelete}>
              <span data-uk-icon="trash"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;

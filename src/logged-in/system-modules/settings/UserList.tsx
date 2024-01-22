import { observer } from "mobx-react-lite";
import { useState, useMemo, useEffect } from "react";
import ErrorBoundary from "../../../shared/components/error-boundary/ErrorBoundary";
import { LoadingEllipsis } from "../../../shared/components/loading/Loading";
import SingleSelect, { IOption } from "../../../shared/components/single-select/SingleSelect";
import { useAppContext } from "../../../shared/functions/Context";
import showModalFromId from "../../../shared/functions/ModalShow";
import MODAL_NAMES from "../../dialogs/ModalName";
import UserModal from "../../dialogs/crud/user/UserModal";
import Toolbar from "../../shared/toolbar/Toolbar";
import EmptyError from "./EmptyError";
import UserItem from "./UserItem";
import Modal from "../../../shared/components/Modal";
import User from "../../../shared/models/User";

const UserList = observer(() => {

  const { api, store } = useAppContext();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewUser = () => {
    showModalFromId(MODAL_NAMES.ADMIN.USER_MODAL);
  };

  const onSearch = (value: string) => setSearch(value);

  const sortByName = (a: User, b: User) => {
    if ((a.asJson.displayName || "") < (b.asJson.displayName || "")) return -1;
    if ((a.asJson.displayName || "") > (b.asJson.displayName || "")) return 1;
    return 0;
  };

  const users = useMemo(() => {
    const _users = (store.user.all.filter(($users) => {
      return $users;
    })) || [];
    return search !== "" ? _users.filter((u) => u.asJson.uid === search) : _users;
  }, [search, store.user.all]);


  const options: IOption[] = useMemo(() => users.map((user) => {
    return { label: user.asJson.displayName || "", value: user.asJson.uid };
  }), [users]);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        await api.user.getAll();
        setLoading(false);
      } catch (error) { }
      setLoading(false);
    };
    loadAll();
  }, [api.user]);

  return (
    <div className="settings uk-section uk-section-small">
      <div className="uk-container uk-container-xlarge">
        <div className="settings-main-card uk-card uk-card-default uk-card-body">
          <Toolbar
            rightControls={
              <ErrorBoundary>
                <div className="uk-flex">
                  <div className="uk-margin-right">
                    <SingleSelect
                      name="search-team"
                      options={options}
                      width="250px"
                      onChange={onSearch}
                    />
                  </div>
                  <div>
                    <button className="btn btn-primary" onClick={handleNewUser} >
                      <span data-uk-icon="icon: plus-circle; ratio:.8"></span>{" "}
                      New User
                    </button>
                  </div>
                </div>
              </ErrorBoundary>
            }
          />
          <div className="settings-list">
            <ErrorBoundary>
              {users.sort(sortByName).map((user) => (
                <div key={user.asJson.uid}>
                  <UserItem user={user.asJson} />
                </div>
              ))}
              <ErrorBoundary>{loading && <LoadingEllipsis />}</ErrorBoundary>
            </ErrorBoundary>
            <ErrorBoundary>
              {!users.length && <EmptyError errorMessage="No users found" />}
            </ErrorBoundary>
          </div>
        </div>
      </div>
      <ErrorBoundary>
        <Modal modalId={MODAL_NAMES.ADMIN.USER_MODAL}>
          <UserModal />
        </Modal>
      </ErrorBoundary>
    </div>
  );
});

export default UserList;

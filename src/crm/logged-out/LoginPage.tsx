import { observer } from "mobx-react-lite";
import { useState, FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingEllipsis } from "../../shared/components/loading/Loading";
import { useAppContext } from "../../shared/functions/Context";
import showModalFromId from "../../shared/functions/ModalShow";
import { PASSWORD } from "../../logged-out/dialog/Dialogs";
import ErrorBoundary from "../../shared/components/error-boundary/ErrorBoundary";
import icons from "../../shared/utils/icons";
import { ErrorAlert } from "../../shared/components/alert/Alert";
import Modal from "../../shared/components/Modal";
import ForgotPasswordDialog from "../../logged-out/dialog/ForgotPasswordDialog";
import Grid from "@mui/material/Grid";

const style = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const Loader = () => {
  return (
    <div style={style}>
      <LoadingEllipsis />
    </div>
  );
};

type ILocationState = {
  from: string;
};

const LoginPage = observer(() => {
  const { api, store } = useAppContext();

  const location = useLocation();
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });

  const [loggingloading, setLogginLoading] = useState(false);
  const [userNotFoundError, setUserNotFoundError] = useState(false);

  const forgotPassword = () => {
    showModalFromId(PASSWORD.FORGOT_PASSWORD_DIALOG);
  };

  const onSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLogginLoading(true);
    const { email, password = "" } = signInForm;
    const $user = await api.auth.signIn(email, password);

    if (!$user) {
      setUserNotFoundError(true);
      setLogginLoading(false);
      return;
    }
  };

  if (store.auth.loading) return <Loader />;

  if (!store.auth.loading && store.auth.me) {
    const state = location.state as ILocationState;

    if (state) return <Navigate to={state.from} />;
    return <Navigate to="/c/dashboard" />;
  }

  return (
    <ErrorBoundary>
      <div className="">
        <div>
          {userNotFoundError && (
            <ErrorAlert
              msg="User account doesn't exist. Contact administrator"
              onClose={() => setUserNotFoundError(false)}
            />
          )}
          <Grid spacing={5}>
            <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
              <img src={icons.IJG} alt="" className="logo" />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6} xl={6}>
              <form
                className="uk-form-stacked uk-child-width-3-4"
                onSubmit={onSignIn}
              >
                <div className="uk-margin">
                  <label className="uk-form-label" htmlFor="user-login-email">
                    Email
                  </label>
                  <div className="uk-form-controls">
                    <input
                      className="uk-input"
                      id="user-login-email"
                      type="email"
                      placeholder="Email"
                      value={signInForm.email}
                      onChange={(e) =>
                        setSignInForm({
                          ...signInForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="uk-margin uk-inline">
                  <label
                    className="uk-form-label"
                    htmlFor="user-login-password"
                  >
                    Password
                  </label>
                  <div className="uk-form-controls">
                    <input
                      className="uk-input"
                      id="user-login-password"
                      type="password"
                      placeholder="Password"
                      value={signInForm.password}
                      onChange={(e) =>
                        setSignInForm({
                          ...signInForm,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="uk-margin">
                  <div className="controls">
                    <div className="uk-flex uk-margin">
                      <div>
                        <button className="btn btn-primary" type="submit">
                          Login
                          {loggingloading && (
                            <div
                              className="uk-margin-small-left"
                              data-uk-spinner="ratio: 0.5"
                            />
                          )}
                        </button>
                      </div>
                      <div>
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={forgotPassword}
                        >
                          Forgot password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </Grid>
          </Grid>
        </div>
      </div>
      <Modal modalId={PASSWORD.FORGOT_PASSWORD_DIALOG}>
        <ForgotPasswordDialog />
      </Modal>
    </ErrorBoundary>
  );
});

export default LoginPage;

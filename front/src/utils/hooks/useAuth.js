import { useSelector, useDispatch } from "react-redux";
import { setUser, initialState } from "store/auth/userSlice";
import {
  apiSignIn,
  apiSignOut,
  apiSignUp,
  apigoogleLogin,
} from "services/AuthService";
import { onSignInSuccess, onSignOutSuccess } from "store/auth/sessionSlice";
import appConfig from "configs/app.config";
import {
  AUTH_TOKEN,
  AUTH_USER_DATA,
  REDIRECT_URL_KEY,
} from "constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "./useQuery";
import { USER } from "constants/roles.constant";

function useAuth() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const query = useQuery();

  const { token, signedIn } = useSelector(state => state.auth.session);

  const googleLogin = async () => {
    try {
      const resp = await apigoogleLogin();

      if (resp) {
        const { token } = resp;
        localStorage.setItem(AUTH_TOKEN, token);
        localStorage.setItem(AUTH_USER_DATA, JSON.stringify(resp.user));
        dispatch(onSignInSuccess(token));
        console.log(`user`, resp.user);
        if (resp.user) {
          dispatch(
            setUser(
              resp.user || {
                avatar: "",
                userName: "Anonymous",
                authority: [USER],
                email: "",
              }
            )
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const signIn = async values => {
    try {
      // s.solod@megabite.com.ua
      const resp = await apiSignIn(values);

      if (resp) {
        const { token } = resp;
        localStorage.setItem(AUTH_TOKEN, token);
        localStorage.setItem(AUTH_USER_DATA, JSON.stringify(resp.user));
        dispatch(onSignInSuccess(token));
        if (resp.user) {
          dispatch(
            setUser(
              resp.user || {
                avatar: "",
                userName: "Anonymous",
                authority: ["USER"],
                email: "",
              }
            )
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const signUp = async values => {
    try {
      const resp = await apiSignUp(values);
      if (resp.data) {
        const { token } = resp.data;
        dispatch(onSignInSuccess(token));
        if (resp.data.user) {
          dispatch(
            setUser(
              resp.data.user || {
                avatar: "",
                userName: "Anonymous",
                authority: ["USER"],
                email: "",
              }
            )
          );
        }
        const redirectUrl = query.get(REDIRECT_URL_KEY);
        navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
        return {
          status: "success",
          message: "",
        };
      }
    } catch (errors) {
      return {
        status: "failed",
        message: errors?.response?.data?.message || errors.toString(),
      };
    }
  };

  const handleSignOut = () => {
    dispatch(onSignOutSuccess());
    dispatch(setUser(initialState));
    navigate(appConfig.unAuthenticatedEntryPath);
  };

  const signOut = async () => {
    await apiSignOut();
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(AUTH_USER_DATA);
    handleSignOut();
  };

  return {
    authenticated: token && signedIn,
    googleLogin,
    signIn,
    signUp,
    signOut,
  };
}

export default useAuth;

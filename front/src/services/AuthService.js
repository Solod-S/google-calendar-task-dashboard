import ApiService from "./ApiService";
import FirebaseAouthService from "./FirebaseAouthService";

export async function apiSignIn(data) {
  return await FirebaseAouthService.signInEmailRequest(data);
}

export async function apigoogleLogin() {
  return await FirebaseAouthService.signInGoogleRequest();
}
export async function apiSignUp(data) {
  return await FirebaseAouthService.signUpEmailRequest(data);
}

export async function apiSignOut(data) {
  return await FirebaseAouthService.signOutRequest(data);
}

export async function apiForgotPassword(data) {
  return ApiService.fetchData({
    url: "/forgot-password",
    method: "post",
    data,
  });
}

export async function apiResetPassword(data) {
  return ApiService.fetchData({
    url: "/reset-password",
    method: "post",
    data,
  });
}

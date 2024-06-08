import ApiService from "./ApiService";
import FirebaseAouthService from "./FirebaseAouthService";

export async function apiSignIn(data) {
  return await FirebaseAouthService.signInEmailRequest(data);

  //   return ApiService.fetchData({
  //     url: "/sign-in",
  //     method: "post",
  //     data,
  //   });
}

export async function apigoogleLogin() {
  return await FirebaseAouthService.signInGoogleRequest();

  //   return ApiService.fetchData({
  //     url: "/sign-in",
  //     method: "post",
  //     data,
  //   });
}
export async function apiSignUp(data) {
  return await FirebaseAouthService.signUpEmailRequest(data);

  // return ApiService.fetchData({
  //     url: '/sign-up',
  //     method: 'post',
  //     data
  // })
}

export async function apiSignOut(data) {
  return await FirebaseAouthService.signOutRequest(data);
  return ApiService.fetchData({
    url: "/sign-out",
    method: "post",
    data,
  });
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

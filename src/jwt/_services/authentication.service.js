import { BehaviorSubject } from "rxjs";
import axios from "axios";
import { setCookie, removeCookie, getCookie } from "../_helpers/cookie";
import { handleResponse, handleSocialAuthResponse, parseJwt } from "../_helpers";
const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

let token = getCookie("token");
let refresh = getCookie("refresh");
let rememberBe = getCookie("rememberBe");
let JWT_decode = token ? parseJwt(token) : null;
let currentUserSubject = new BehaviorSubject(null);

const getNewToken = (oldToken) => {
  return axios({
    method: "POST",
    mode: 'cors',
    url: `${API_URL}refresh-token/`,
    data: {"refresh": oldToken},
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    }
  }).then(res => {
    const newToken = res.data.access;
    setCookie("token", newToken);
    localStorage.setItem("currentUser", JSON.stringify(newToken));
    currentUserSubject = new BehaviorSubject(newToken)
  }).catch(e => {
    logoutNoRefresh();
    currentUserSubject = new BehaviorSubject(null);
  })
}

// if ((JWT_decode && Date.now() >= JWT_decode.exp * 1000) || !JWT_decode) {
//   logoutNoRefresh();
//   currentUserSubject = new BehaviorSubject(null);
// } else if (rememberBe === "1") {
//   setCookie("token", token);
//   localStorage.setItem("currentUser", JSON.stringify(token));
//   currentUserSubject = new BehaviorSubject(token);
//   getNewToken(refresh);
// } else if (rememberBe === "1") {
//   logoutNoRefresh();
//   currentUserSubject = new BehaviorSubject(null);
// }


export const authenticationService = {
  login,
  logout,
  logoutNoRefresh,
  socialAuth,
  currentUserSubject,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject;
  }
};

function login(username, password) {
  const requestOptions = {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify({ username, password })
  };

  return fetch(
    `${API_URL}obtain-token/`,
    requestOptions
  )
    .then(handleResponse)
    .then(user => {
      localStorage.setItem("currentUser", JSON.stringify(user.access));
      setCookie("token", user.access);
      setCookie("refresh", user.refresh);
      currentUserSubject.next(user.access);
      return user;
    });
}

function socialAuth(provider, authCode, redirectUri, authType) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    },
    body: JSON.stringify({ 
      provider: provider, 
      code: authCode,
      redirect_uri: redirectUri,
      auth_type: authType,
    })
  };

  return fetch(
    `${API_URL}social-auth/`,
    requestOptions
  )
    .then(handleSocialAuthResponse)
    .then(user => {
      localStorage.setItem("currentUser", JSON.stringify(user.token));
      setCookie("token", user.token);
      setCookie("refresh", user.refresh);
      currentUserSubject.next(user.token);
      return user;
    });
}

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("currentUser");
  currentUserSubject = new BehaviorSubject(null);
  removeCookie("token");
  removeCookie("refresh");
  window.location.reload();
}

function logoutNoRefresh() {
  localStorage.removeItem("currentUser");
  currentUserSubject = new BehaviorSubject(null);
  removeCookie("token");
  removeCookie("refresh");
}
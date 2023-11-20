import { createContext } from "react";

export const StateContext = createContext({
  currentUser: {},
  setCurrentUser: value => {},
  token: null,
  setToken: value => {}
});

export default StateContext;
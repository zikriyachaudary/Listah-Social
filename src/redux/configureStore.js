import reduxThunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";

import rootReducer from "./rootReducer";

const getMiddleware = () => {
  const middleware = [reduxThunk];

  return applyMiddleware(...middleware);
};

const appReducer = (state, action) => {
  let newState = state;

  if (action.type === "LOGOUT_SUCCESS") {
    newState = undefined;
  }

  return rootReducer(newState, action);
};

export default () => {
  let store = createStore(appReducer, getMiddleware());
  return store;
};

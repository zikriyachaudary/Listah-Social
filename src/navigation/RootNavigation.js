// RootNavigation.js

import { CommonActions } from "@react-navigation/native";
import * as React from "react";

export const navigationRef = React.createRef();

export function navigate(name, params = {}) {
  navigationRef.current?.navigate(name, params);
}
export function reset(name, params = {}) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: name, params }],
    })
  );
}

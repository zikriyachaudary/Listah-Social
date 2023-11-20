import React from "react";
import { Provider } from "react-redux";
import { ToastProvider } from "react-native-toast-notifications";
import AppNavigation from "./navigation/AppNavigation";
import configureStore from "./redux/configureStore";

const store = configureStore();

/* =============================================================================
<App />
============================================================================= */
const App = () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AppNavigation />
      </ToastProvider>
    </Provider>
  );
};

/* Export
============================================================================= */
export default App;

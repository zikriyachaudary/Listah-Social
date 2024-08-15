import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { ToastProvider } from "react-native-toast-notifications";
import AppNavigation from "./navigation/AppNavigation";
import configureStore from "./redux/configureStore";
import { checkNotifications, requestNotifications } from "react-native-permissions";
import { Platform } from "react-native";

const store = configureStore();

/* =============================================================================
<App />
============================================================================= */
const App = () => {

  useEffect(()=>{
    registerDevice();
    console.log("useEffect ------");
    
  },[])

  ////////Push notification-------->
  const registerDevice = async () => {
    if (Platform.OS == 'ios') {
      await getPermissionsForNotification();
    } else {
      console.log("Androi d-------");
      
      requestNotificationPermission();
    }
  };

  const requestNotificationPermission = async () => {
    console.log("checking status --");
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      
      const {status} = await checkNotifications();
      if (status !== 'granted') {
        console.log("Status " , status);
        
        const {status: newStatus} = await requestNotifications([
          'alert',
          'sound',
        ]);
        if (!newStatus === 'granted') {
          Alert.alert(
            'Notification Permission',
            'Notification permissions are required to receive notifications. Please enable them in settings.',
          );
        }
      }
    } 
  };
  const getPermissionsForNotification = async () => {
    const isPermission = await hasPermission();
    if (isPermission == false) {
      await requestPermission();
    }
  };
  const requestPermission = async () => {
    try {
      const permission = await notifications.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false; // or handle the error appropriately
    }
  };
  const hasPermission = async () => {
    return await notifications.hasPermission();
  };


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

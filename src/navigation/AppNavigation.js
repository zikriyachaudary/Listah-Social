import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Platform, SafeAreaView, StatusBar } from "react-native";
import FirebaseAuth from "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { notifications } from "react-native-firebase-push-notifications";
import { View, Text } from "../common";
import HomeTab from "./HomeTab/index";
import AuthStack from "../auth/screens/AuthStack";
import SuggestionStack from "../suggestion/screens/SuggestionStack";
import * as Colors from "../config/colors";
import SplashScreen from "react-native-splash-screen";
import { getUser } from "../auth/redux/selectors";
import { getProfile as getProfileAction } from "../profile/redux/actions";
import { changeAuthState as changeAuthStateAction } from "../auth/redux/actions";
import FullImageModal from "../common/PostCard/PostItem/FullImageModal";
import { showFullImage } from "../home/redux/appLogics";
import { getUserDraftPost } from "../util/helperFun";
import {
  setAllUserFCMToken,
  setDraftPost,
  setIsAlertShow,
  setPushNotifi,
} from "../redux/action/AppLogics";
import AlertModal from "../common/AlertModal";
import LocalNotification from "../common/LocalNotification";
import useNotificationManger from "../hooks/useNotificationManger";
import { Notification_Types } from "../util/Strings";
import { navigate, navigationRef } from "./RootNavigation";
const Stack = createNativeStackNavigator();

/* =============================================================================
<AppNavigation />
============================================================================= */
const AppNavigation = ({ changeAuthState, getProfile, authenticated }) => {
  const { checkNUpdateFCMToken, userSubscribed } = useNotificationManger();
  const [initializing, setInitializing] = useState(true);
  const userCompleteObj = useRef(null);
  const selector = useSelector((AppState) => AppState);

  const dispatch = useDispatch();
  // firebase user state check
  useEffect(() => {
    FirebaseAuth().onAuthStateChanged(async (user) => {
      if (user) {
        userCompleteObj.current = user;
        onAppStart();
        changeAuthState(user.toJSON());
        registerDevice();
        onNotificationListener();
        onNotificationOpenedListener();
        getInitialNotification();
      }
      setInitializing(false);
      setTimeout(() => {
        SplashScreen.hide();
      }, 2000);
    });
  }, []);

  // Get Profile
  useEffect(() => {
    if (authenticated) {
      onAppStart();
      getProfile();
    }
  }, []);

  const registerDevice = async () => {
    if (Platform.OS == "ios") {
      await getPermissionsForNotification();
    } else {
      getToken();
    }
  };

  const getToken = async () => {
    const token = await notifications.getToken();
    if (token && userCompleteObj.current?.uid) {
      await checkNUpdateFCMToken({
        fcmToken: token,
        userId: userCompleteObj.current?.uid,
      });
    }
    await userSubscribed(userCompleteObj.current?.uid, (res) => {
      if (res?.length > 0) {
        let filterUser = res.filter(
          (mitem) => mitem.userId !== userCompleteObj.current?.uid
        );
        dispatch(setAllUserFCMToken(filterUser));
      }
    });
  };
  const getPermissionsForNotification = async () => {
    const isPermission = await hasPermission();
    if (isPermission == false) {
      await requestPermission();
    } else {
      getToken();
    }
  };

  const requestPermission = async () => {
    return await notifications.requestPermission();
  };

  const hasPermission = async () => {
    return await notifications.hasPermission();
  };

  const setBadge = async (number) => {
    //only works on iOS and some Android Devices
    return await notifications.setBadge(number);
  };

  const getBadge = async () => {
    //only works on iOS and some Android Devices
    return await notifications.getBadge();
  };

  const getInitialNotification = async () => {
    const notification = await notifications
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage?.notification) {
          dispatch(setPushNotifi(notification));
          setTimeout(() => {
            openDetail();
          }, 3000);
        }
      });
    return notification;
  };

  const postRefresh = () => {
    console.log("click");
  };

  const openDetail = () => {
    let obj = selector?.sliceReducer?.push_Noti?._data;
    if (
      obj?.actionType == Notification_Types.announced ||
      obj?.actionType == Notification_Types.challenge ||
      obj?.actionType == Notification_Types.comment ||
      obj?.actionType == Notification_Types.follow ||
      obj?.actionType == Notification_Types.like ||
      obj?.actionType == Notification_Types.suggestion
    ) {
      navigate("MyPosts", {
        userId: obj?.senderId,
        username: obj?.senderName,
        refreshCall: postRefresh,
      });
    }
  };
  const onNotificationOpenedListener = () => {
    //this gets triggered when the application is in the background
    notifications.onNotificationOpened((notification) => {
      if (notification?._body) {
        dispatch(setPushNotifi(notification));
        setTimeout(() => {
          openDetail();
        }, 3000);
      }
    });
  };
  const onNotificationListener = async () => {
    //remember to remove the listener on un mount
    //this gets triggered when the application is in the forground/runnning
    //for android make sure you manifest is setup - else this wont work
    //Android will not have any info set on the notification properties (title, subtitle, etc..), but _data will still contain information

    notifications.onNotification(async (notification) => {
      if (notification?._body) {
        dispatch(setPushNotifi(notification));
      }
    });
  };

  ////--------------------------------->

  const onAppStart = async () => {
    let draftPost = await getUserDraftPost();
    if (draftPost?.length > 0) {
      dispatch(setDraftPost(draftPost));
    }
  };

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer theme={THEME} ref={navigationRef}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {authenticated ? (
          // <Stack.Screen name="EMPTY_SCREEN" component={EMPTY_SCREEN} />
          <>
            <Stack.Screen name="HomeTab" component={HomeTab} />
            <Stack.Screen name="SuggestionStack" component={SuggestionStack} />
          </>
        ) : (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        )}
      </Stack.Navigator>
      {selector?.DraftPost?.isAlertShow?.value ? (
        <AlertModal
          visible={selector?.DraftPost?.isAlertShow?.value}
          onPress={() => {
            dispatch(setIsAlertShow({ value: false, message: "" }));
          }}
          message={selector?.DraftPost?.isAlertShow?.message}
        />
      ) : null}
      {selector?.sliceReducer?.push_Noti ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            elevation: 5,
          }}
        >
          <SafeAreaView />
          <LocalNotification
            openView={() => {
              openDetail();
              dispatch(setPushNotifi(null));
            }}
            closeView={() => {
              dispatch(setPushNotifi(null));
            }}
          />
        </View>
      ) : null}
      {selector.Home.showFullImage && selector.Home.fullImagePath !== "" && (
        <FullImageModal
          visible={selector.Home.showFullImage}
          onClose={() => {
            dispatch(showFullImage(false));
          }}
          userImage={selector.Home.fullImagePath}
        />
      )}
    </NavigationContainer>
  );
};

const EMPTY_SCREEN = () => (
  <View center flex>
    <Text>You Are Logged In</Text>
  </View>
);

const THEME = {
  dark: false,
  colors: {
    primary: Colors.primary,
    background: Colors.white,
    text: Colors.black,
    border: Colors.outline,
    notification: Colors.accent,
  },
};
const mapStateToProps = (state) => ({
  authenticated: !!getUser(state),
});

const mapDispatchToProps = {
  changeAuthState: changeAuthStateAction,
  getProfile: getProfileAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation);

import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Platform, SafeAreaView, ActivityIndicator } from "react-native";
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
import { getUserDraftPost, setUpChat } from "../util/helperFun";
import ChatListingScreen from "../Chat/Screens/ChatListingScreen";
import ChatScreen from "../Chat/Screens/ChatScreen";

import {
  setAllUserFCMToken,
  setDraftPost,
  setIsAlertShow,
  setPushNotifi,
  setCategoriesInRed,
} from "../redux/action/AppLogics";
import AlertModal from "../common/AlertModal";
import LocalNotification from "../common/LocalNotification";
import useNotificationManger from "../hooks/useNotificationManger";
import { Notification_Types } from "../util/Strings";
import { navigate, navigationRef } from "./RootNavigation";
import { fetchCategoriesList } from "../network/Services/ProfileServices";
import RNSplashScreen from "../auth/screens/SplashScreen";
import ThreadManager from "../ChatModule/ThreadManger";
import { Routes } from "../util/Route";
import PostDetailScreen from "../Post/Screens/PostDetailScreen";
import ReportPost from "../home/screens/ReportPost";
const Stack = createNativeStackNavigator();

/* =============================================================================
<AppNavigation />
============================================================================= */
const AppNavigation = ({ changeAuthState, getProfile, authenticated }) => {
  const { checkNUpdateFCMToken, userSubscribed, fetchIsUnReadValue } =
    useNotificationManger();
  const [initializing, setInitializing] = useState(true);
  const userCompleteObj = useRef(null);
  const [showSplash, setShowSplash] = useState(true);
  const selector = useSelector((AppState) => AppState);

  const dispatch = useDispatch();
  // firebase user state check
  useEffect(() => {
    let removeOnNotificationOpened;
    let removeOnNotification;
    FirebaseAuth().onAuthStateChanged(async (user) => {
      if (user) {
        userCompleteObj.current = user;
        onAppStart();
        fetchIsUnReadValue(user?.uid);
        changeAuthState(user.toJSON());
        registerDevice();
        /////////Notification----->
        getInitialNotification();
        removeOnNotificationOpened = notifications.onNotificationOpened(
          (notification) => {
            if (notification?._data) {
              console.log("onNotificationOpened------->");
              // dispatch(setPushNotifi(notification));
              setTimeout(() => {
                openDetail(notification);
              }, 2000);
              let userId = userCompleteObj.current?.uid
                ? userCompleteObj.current?.uid
                : selector?.Profile?.profile?.userId
                ? selector?.Profile?.profile?.userId
                : null;
              if (userId) {
                fetchIsUnReadValue(userId);
              }
            }
          }
        );
        removeOnNotification = notifications.onNotification((notification) => {
          if (notification?._data) {
            console.log("onNotification0------>");
            dispatch(setPushNotifi(notification));
            let userId = userCompleteObj.current?.uid
              ? userCompleteObj.current?.uid
              : selector?.Profile?.profile?.userId
              ? selector?.Profile?.profile?.userId
              : null;
            if (userId) {
              fetchIsUnReadValue(userId);
            }
          }
        });
        ////////////
      }
      setInitializing(false);
      SplashScreen.hide();
      setTimeout(() => {
        setShowSplash(false);
      }, 3000);
      // ThreadManager.instance.setupRedux(selector?.sliceReducer, dispatch);
      user?.uid ? setChat(user?.uid) : null;
      return () => {
        ThreadManager.instance.removeThreadObserver();
      };
    });

    return () => {
      removeOnNotificationOpened && removeOnNotificationOpened?.remove
        ? removeOnNotificationOpened?.remove()
        : null;
      removeOnNotification && removeOnNotification?.remove
        ? removeOnNotification?.remove()
        : null;
    };
  }, []);
  const setChat = async (userId) => {
    setTimeout(async () => {
      if (userId) {
        await setUpChat(userId, async (result) => {
          setTimeout(async () => {
            ThreadManager.instance.setAppLoaded();
          }, 3000);
        });
      }
    }, 1000);
  };

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
  const getInitialNotification = async () => {
    const notification = await notifications.getInitialNotification();
    if (notification?.notification?._data) {
      console.log("getInitialNotification----->");
      // dispatch(setPushNotifi(notification?.notification));
      setTimeout(() => {
        openDetail(notification?.notification);
      }, 6000);
    }
  };

  const postRefresh = () => {
    console.log("click");
  };

  const openDetail = (notification) => {
    let obj = selector?.sliceReducer?.push_Noti?._data || notification?._data;
    console.log("obj------>", obj);

    if (
      (obj?.actionType == Notification_Types.announced ||
        obj?.actionType == Notification_Types.challenge ||
        obj?.actionType == Notification_Types.comment ||
        obj?.actionType == Notification_Types.like ||
        obj?.actionType == Notification_Types.suggestion) &&
      (obj?.extraData?.postId || obj?.postId)
    ) {
      navigate(Routes.Post.postDetail, {
        postId: obj?.extraData?.postId || obj?.postId,
      });
    } else if (obj?.actionType == Notification_Types.follow) {
      navigate("MyPosts", {
        userId: obj?.senderId,
        username: obj?.senderName,
        refreshCall: postRefresh,
      });
    } else if (obj?.actionType == Notification_Types.chat_messages) {
      navigate(Routes.Chat.chatScreen, {
        thread: obj?.thread,
        from: "Home",
      });
    }
    setTimeout(() => {
      dispatch(setPushNotifi(null));
    }, 1000);
  };

  ////--------------------------------->

  const onAppStart = async () => {
    await fetchCategoriesList((res) => {
      dispatch(
        setCategoriesInRed(res?.categoriesList ? res?.categoriesList : [])
      );
    });
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
      {/* <StatusBar
        // translucent
        backgroundColor={AppColors.blue.navy}
        // barStyle="dark-content"
      /> */}

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {showSplash ? (
          <Stack.Screen name="RNSplashScreen" component={RNSplashScreen} />
        ) : (
          <>
            {authenticated ? (
              <>
                <Stack.Screen name="HomeTab" component={HomeTab} />
                <Stack.Screen
                  name="SuggestionStack"
                  component={SuggestionStack}
                />
                <Stack.Screen
                  name={Routes.Chat.chatList}
                  component={ChatListingScreen}
                />
                <Stack.Screen
                  name={Routes.Post.postDetail}
                  component={PostDetailScreen}
                />
                <Stack.Screen
                  name={Routes.Chat.chatScreen}
                  component={ChatScreen}
                />
                <Stack.Screen name="ReportPost" component={ReportPost} />
              </>
            ) : (
              <Stack.Screen name="AuthStack" component={AuthStack} />
            )}
          </>
        )}
      </Stack.Navigator>

      {selector?.sliceReducer?.isLoaderStart ? (
        <View
          style={{
            backgroundColor: "rgba(0,0,0, 0.2)",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            elevation: 3,
            zIndex: 100,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: 80,
              height: 80,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
            }}
          >
            <ActivityIndicator size="large" color={"#544be3"} />
          </View>
        </View>
      ) : null}
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
              openDetail(selector?.sliceReducer?.push_Noti);
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

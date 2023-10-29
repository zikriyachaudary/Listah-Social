import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { StatusBar } from "react-native";
import RNSplashScreen from "react-native-splash-screen";
import FirebaseAuth from "@react-native-firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { View, Text } from "../common";
import HomeTab from "./HomeTab/index";
import AuthStack from "../auth/screens/AuthStack";
import SuggestionStack from "../suggestion/screens/SuggestionStack";
import * as Colors from "../config/colors";

import { getUser } from "../auth/redux/selectors";
import { getProfile as getProfileAction } from "../profile/redux/actions";
import { changeAuthState as changeAuthStateAction } from "../auth/redux/actions";
import FullImageModal from "../common/PostCard/PostItem/FullImageModal";
import { showFullImage } from "../home/redux/appLogics";
import { getUserDraftPost } from "../util/helperFun";
import { setDraftPost } from "../redux/action/AppLogics";

const Stack = createNativeStackNavigator();

/* =============================================================================
<AppNavigation />
============================================================================= */
const AppNavigation = ({ changeAuthState, getProfile, authenticated }) => {
  const [initializing, setInitializing] = useState(true);
  const selector = useSelector((AppState) => AppState);
  const dispatch = useDispatch();

  // firebase user state check
  useEffect(() => {
    FirebaseAuth().onAuthStateChanged(async (user) => {
      if (user) {
        onAppStart();
        changeAuthState(user.toJSON());
      }
      setInitializing(false);
      RNSplashScreen.hide();
    });
  }, []);

  // Get Profile
  useEffect(() => {
    if (authenticated) {
      onAppStart();
      getProfile();
    }
  }, []);

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
    <NavigationContainer theme={THEME}>
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

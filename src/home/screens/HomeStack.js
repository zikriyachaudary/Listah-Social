import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";

import HomeScreen from "./HomeScreen";
import MyPostsScreen from "./MyPostsScreen";
import PostCreateScreen from "./PostCreateScreen";
import PostEditScreen from "./PostEditScreen";
import ReportPost from "./ReportPost";
import { getLoginUserNotificationCount } from "../../notification/redux/actions";
import AddChallengeListingScreen from "../../suggestion/screens/AddChallengeListingScreen";
import AcceptRejectChallenge from "./AcceptRejectChallenge";
import ProfileScreen from "../../profile/screens/ProfileScreen";
import EditProfileScreen from "../../profile/screens/EditProfileScreen";
import DraftPostListScreen from "../../profile/screens/DraftPostListScreen";
import { Routes } from "../../util/Route";
import UserRequestListScreen from "../../profile/screens/UserRequestList";
import AppUserListScreen from "../../profile/screens/AppUsersListScreen";
import RequestForVerifyAccountScreen from "../../profile/screens/RequestForVerifyAccountScreen";
const Stack = createNativeStackNavigator();

/* =============================================================================
<HomeStack />
============================================================================= */
const HomeStack = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    checkNotificationCount();
  }, []);

  const checkNotificationCount = () => {
    console.log("trigger -- > ");
    getLoginUserNotificationCount(dispatch);
  };
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MyPosts" component={MyPostsScreen} />
      <Stack.Screen
        name="AcceptRejectChallenge"
        component={AcceptRejectChallenge}
      />
      <Stack.Screen name="PostCreate" component={PostCreateScreen} />
      <Stack.Screen
        name="AddChalleenge"
        component={AddChallengeListingScreen}
      />
      <Stack.Screen name="PostEdit" component={PostEditScreen} />

      {/* <Tab.Screen name="ProfileStack" component={ProfileStack} /> */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="DraftPostListing" component={DraftPostListScreen} />
      <Stack.Screen
        name={Routes.Profile.userRequestList}
        component={UserRequestListScreen}
      />
      <Stack.Screen
        name={Routes.Profile.appUserList}
        component={AppUserListScreen}
      />
      <Stack.Screen
        name={Routes.Profile.requestForVerify}
        component={RequestForVerifyAccountScreen}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

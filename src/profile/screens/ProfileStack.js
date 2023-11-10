import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "./ProfileScreen";
import EditProfileScreen from "./EditProfileScreen";
import DraftPostListScreen from "./DraftPostListScreen";
import { Routes } from "../../util/Route";
import UserRequestListScreen from "./UserRequestList";
import AppUserListScreen from "./AppUsersListScreen";
import RequestForVerifyAccountScreen from "./RequestForVerifyAccountScreen";

const Stack = createNativeStackNavigator();

/* =============================================================================
<ProfileStack />
============================================================================= */
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
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

export default ProfileStack;

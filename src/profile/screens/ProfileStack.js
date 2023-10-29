import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "./ProfileScreen";
import EditProfileScreen from "./EditProfileScreen";
import DraftPostListScreen from "./DraftPostListScreen";

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
    </Stack.Navigator>
  );
};

export default ProfileStack;

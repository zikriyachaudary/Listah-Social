import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Text, View } from "../../common";
import HomeTabBar from "./HomeTabBar";
import HomeStack from "../../home/screens/HomeStack";
import FollowingScreen from "../../following/screens/FollowingScreen";
import NotificationScreen from "../../notification/screens/NotificationScreen";
import PostCreateScreen from "../../home/screens/PostCreateScreen";
import SearchStack from "../../home/screens/SearchStack";

const Tab = createBottomTabNavigator();

/* =============================================================================
<HomeTab />
============================================================================= */
const HomeTab = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="FollowingStack" component={FollowingScreen} />
      <Tab.Screen name="DiscoverStack" component={PostCreateScreen} />
      <Tab.Screen name="NotificationStack" component={NotificationScreen} />
      {/* <Tab.Screen name="ProfileStack" component={ProfileStack} /> */}
      <Tab.Screen name="SearchStack" component={SearchStack} />
    </Tab.Navigator>
  );
};

const EMPTY = () => (
  <View flex center>
    <Text h3>Coming Soon</Text>
  </View>
);

const renderTabBar = (props) => <HomeTabBar {...props} />;

/* Export
============================================================================= */
export default HomeTab;

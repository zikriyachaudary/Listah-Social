import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Routes } from "../../util/Route";
import SearchScreen from "./SearchScreen";

const Stack = createNativeStackNavigator();

/* =============================================================================
<SearchStack />
============================================================================= */
const SearchStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen
        name={Routes.Search.searchScreen}
        component={SearchScreen}
      />
    </Stack.Navigator>
  );
};

export default SearchStack;

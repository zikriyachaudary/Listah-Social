import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Touchable, Text } from "../../common";
import * as Colors from "../../config/colors";
import { useSelector } from "react-redux";
import { Theme_Mode } from "../../util/Strings";
import {
  AppColors,
  darkModeColors,
  lightModeColors,
} from "../../util/AppConstant";

/* =============================================================================
<FollowingTab />
============================================================================= */
const FollowingTab = ({ navigationState, jumpTo }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
      }}
    >
      {navigationState.routes.map((route, index) => (
        <Touchable
          key={index}
          flex={1}
          disabled={index === navigationState.index}
          alignItems="center"
          onPress={() => jumpTo(route.key)}
        >
          <View
            style={[
              styles.item,
              index === navigationState.index && {
                ...styles.itemActive,
                borderBottomColor:
                  themeType == Theme_Mode.isDark
                    ? AppColors.white.white
                    : Colors.primary,
              },
            ]}
          >
            <Text
              lg
              defaultMessage={route.title}
              style={{
                color:
                  themeType == Theme_Mode.isDark
                    ? index === navigationState.index
                      ? AppColors.white.white
                      : AppColors.grey.dark
                    : index === navigationState.index
                    ? Colors.primary
                    : AppColors.grey.dark,
              }}
            >
              {route.title}
            </Text>
          </View>
        </Touchable>
      ))}
    </View>
  );
};

const getStyles = (insets) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      paddingTop: insets.top + 25,
      alignItems: "center",
      backgroundColor: Colors.white,
    },
    item: {
      justifyContent: "center",
    },
    itemActive: {
      borderBottomWidth: 2,
      borderBottomColor: Colors.primary,
    },
    textActive: {
      color: Colors.primary,
    },
  });

export default FollowingTab;

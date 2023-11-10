import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Touchable, Text } from "../../common";
import * as Colors from "../../config/colors";

/* =============================================================================
<FollowingTab />
============================================================================= */
const FollowingTab = ({ navigationState, jumpTo }) => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);

  return (
    <View style={styles.container}>
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
              index === navigationState.index && styles.itemActive,
            ]}
          >
            <Text
              lg
              defaultMessage={route.title}
              style={[index === navigationState.index && styles.textActive]}
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

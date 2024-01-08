import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View, Touchable, Text } from "../../common";
import HomeIcon from "../../assets/icons/nav-home-icon.svg";
import NotificationIcon from "../../assets/icons/nav-notification-icon.svg";
import FollowingIcon from "../../assets/icons/nav-following-icon.svg";
// import DiscoverIcon from '../../assets/icons/nav-search-bottom.svg';
import AddIcon from "../../assets/icons/plus-btn.svg";

import NavSearch from "../../assets/images/Common/Search.svg";
import * as Colors from "../../config/colors";
import { useSelector } from "react-redux";

/* =============================================================================
<HomeTabBar />
============================================================================= */
const HomeTabBar = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();
  const selector = useSelector((AppState) => AppState);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Touchable
            key={route.name}
            style={styles.item}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {selector.sliceReducer.isUnReaded &&
              route.name.slice(0, route.name.indexOf("Stack")) ==
                "Notification" && <View style={styles.badgeView} />}

            {isFocused ? ICONS[index][1] : ICONS[index][0]}
            {/* <Text xs style={isFocused ? styles.activeTxt : styles.txt}>
              {route.name.slice(0, route.name.indexOf("Stack")) == "Discover"
                ? "Add Post"
                : route.name.slice(0, route.name.indexOf("Stack"))}
            </Text> */}
          </Touchable>
        );
      })}
    </View>
  );
};

const ICONS = {
  0: [<HomeIcon stroke="#999" />, <HomeIcon stroke={Colors.primary} />],
  1: [
    <FollowingIcon stroke="#999" />,
    <FollowingIcon stroke={Colors.primary} />,
  ],
  2: [
    <AddIcon stroke="#999" />,
    <AddIcon stroke={Colors.primary} />,
    // <DiscoverIcon stroke="#999" />,
    // <DiscoverIcon stroke={Colors.primary} />,
  ],
  3: [
    <NotificationIcon stroke="#999" />,
    <NotificationIcon stroke={Colors.primary} />,
  ],
  4: [
    // <ProfileIcon stroke="#999" />, <ProfileIcon stroke={Colors.primary} />
    <NavSearch stroke="#999" />,
    <NavSearch stroke={Colors.primary} />,
  ],
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    display: "flex",
    elevation: 10,
  },
  badgeView: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    position: "absolute",
    zIndex: 1,
    top: 5,
    right: "36%",
  },
  item: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  txt: {
    marginTop: 5,
    color: Colors.grey2,
  },
  activeTxt: {
    marginTop: 5,
    color: Colors.primary,
  },
});

/* Export
============================================================================= */
export default HomeTabBar;

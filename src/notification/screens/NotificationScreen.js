import { connect, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Container } from "../../common";
import NotificationListItem from "../components/NotificationListItem";
import NotificationsListEmpty from "../components/NotificationsListEmpty";

import { getNotifications as selectNotifications } from "../redux/selectors";
import { getNotifications as getNotificationsAction } from "../redux/actions";
import useNotificationManger from "../../hooks/useNotificationManger";
import {
  AppColors,
  darkModeColors,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import CustomHeader from "../../common/CommonHeader";
import { Theme_Mode } from "../../util/Strings";

/* =============================================================================
<NotificationScreen />
============================================================================= */
const NotificationScreen = ({ notifications, getNotifications }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);
  const [notificationList, setNotificationList] = useState([]);
  const [loader, setIsLoader] = useState(false);
  const { fetchNotificationList, setMessageIsRead } = useNotificationManger();

  // GET_NOTIFICATIONS
  useEffect(() => {
    if (isFocused) {
      // getNotifications(selector.Home.notificationUnread);
      setIsLoader(true);
      setMessageIsRead();
      fetchNotificationList((response) => {
        console.log("response---->", response);
        if (response?.length > 0) {
          setNotificationList(response);
        } else {
          setNotificationList([]);
        }
        setTimeout(() => {
          setIsLoader(false);
        }, 500);
      });
    }
  }, [isFocused]);

  return (
    <Container
      style={{
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
      }}
    >
      <CustomHeader
        isStatusBar={true}
        title={"Notifications"}
        mainStyle={{
          backgroundColor: AppColors.blue.royalBlue,
        }}
      />

      {loader ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={AppColors.blue.navy} />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notificationList?.reverse()}
          renderItem={renderItem}
          keyExtractor={renderKeyExtractor}
          contentContainerStyle={styles.content}
          ListEmptyComponent={NotificationsListEmpty}
        />
      )}
    </Container>
  );
};

const renderItem = ({ item, index }) => (
  <NotificationListItem id={index} notification={item} />
);
const renderKeyExtractor = (item) => `${item.id}`;

const getStyles = (insets) =>
  StyleSheet.create({
    content: {
      flexGrow: 1,
      paddingHorizontal: 18,
    },
  });

const mapStateToProps = (state) => ({
  notifications: selectNotifications(state),
});

const mapDispatchToProps = {
  getNotifications: getNotificationsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);

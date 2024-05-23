import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
} from "react-native";

import { Touchable, View } from "../../common";
import LoadingImage from "../../common/LoadingImage";
import { Notification_Types, Theme_Mode } from "../../util/Strings";
import {
  AppColors,
  darkModeColors,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import { Routes } from "../../util/Route";
import PostDetailScreen from "../../Post/Screens/PostDetailScreen";
import { useSelector } from "react-redux";

/* =============================================================================
<NotificationListItem />
============================================================================= */
const NotificationListItem = ({ notification }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  const navigation = useNavigation();
  const type = notification?.type;

  const _handleSuggestionPress = () => {
    if (notification.payload) {
      navigation.navigate("SuggestionStack", {
        screen: "SuggestionApprove",
        params: { suggestion: notification.payload },
      });
    }
  };

  if (type === "suggestion") {
    return (
      <Touchable
        horizontal
        style={styles.container}
        onPress={_handleSuggestionPress}
      >
        <TouchableOpacity
          onPress={() => {
            console.log("yes pres --- ", notification);
          }}
        >
          <LoadingImage
            source={{ uri: `${notification?.sender?.image}` }}
            style={{
              width: 50,
              height: 50,
              borderWidth: 2,
              borderRadius: 50 / 2,
              borderColor:
                themeType === Theme_Mode.isDark
                  ? AppColors.white.white
                  : AppColors.blue.royalBlue,
            }}
          />
        </TouchableOpacity>
        <Text sm>{notification?.message}</Text>
      </Touchable>
    );
  }
  const postRefresh = () => {
    console.log("click");
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (notification?.extraData?.postId) {
          navigation.push(Routes.Post.postDetail, {
            postId: notification?.extraData?.postId,
          });
        } else if (
          notification?.actionType == Notification_Types.announced ||
          notification?.actionType == Notification_Types.challenge ||
          notification?.actionType == Notification_Types.comment ||
          notification?.actionType == Notification_Types.follow ||
          notification?.actionType == Notification_Types.like
        ) {
          navigation.navigate("MyPosts", {
            userId: notification.sender.id,
            username: notification.sender.name,
            refreshCall: postRefresh,
          });
        } else if (
          notification?.actionType == Notification_Types.chat_messages
        ) {
          navigation.navigate(Routes.Chat.chatScreen, {
            thread: notification?.thread,
            from: "NotificationStack",
          });
        } else if (notification?.actionType == Notification_Types.suggestion) {
          _handleSuggestionPress();
        }
      }}
      style={{
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
      }}
    >
      <View horizontal style={{ ...styles.container }}>
        <LoadingImage
          source={{ uri: `${notification?.sender?.image}` }}
          style={{
            width: 50,
            height: 50,
            borderWidth: 2,
            borderRadius: 50 / 2,
            borderColor:
              themeType === Theme_Mode.isDark
                ? AppColors.white.white
                : AppColors.blue.royalBlue,
          }}
        />
        <View>
          {notification?.actionType == Notification_Types.chat_messages &&
            notification?.sender?.userName && (
              <Text
                style={{
                  flex: 1,
                  flexWrap: "wrap",
                  marginStart: 8,
                  color:
                    themeType == Theme_Mode.isDark
                      ? darkModeColors.text
                      : lightModeColors.text,
                  fontSize: normalized(14),
                }}
              >
                {notification?.actionType == Notification_Types.chat_messages &&
                notification?.sender?.userName
                  ? `${notification?.sender?.userName} send message`
                  : ""}
              </Text>
            )}

          <Text
            style={{
              width: normalized(290),
              marginStart: 8,
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
            numberOfLines={1}
          >
            {notification?.message}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
  },
  profileImg: {
    marginRight: 15,
  },
});

export default NotificationListItem;

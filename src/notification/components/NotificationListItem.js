import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { Text, Touchable, View } from "../../common";
import LoadingImage from "../../common/LoadingImage";
import * as Colors from "../../config/colors";
import { Notification_Types } from "../../util/Strings";

/* =============================================================================
<NotificationListItem />
============================================================================= */
const NotificationListItem = ({ notification }) => {
  const navigation = useNavigation();
  const type = notification?.type;

  const _handleSuggestionPress = () => {
    navigation.navigate("SuggestionStack", {
      screen: "SuggestionApprove",
      params: { suggestion: notification },
    });
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
            // navigation.navigate('MyPosts', { userId: post.author.userId, username: username, refreshCall: postRefresh });
          }}
        >
          {/* <Avatar
            style={styles.profileImg}
            url={{ uri: `${senderProfilePic}` }}
          /> */}
          <LoadingImage
            source={{ uri: `${notification?.sender?.image}` }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 2,
              borderWidth: 1.4,
              borderRadius: 50 / 2,
              backgroundColor: Colors.outline,
              borderColor: "yellow",
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
        if (
          notification?.actionType == Notification_Types.announced ||
          notification?.actionType == Notification_Types.challenge ||
          notification?.actionType == Notification_Types.comment ||
          notification?.actionType == Notification_Types.follow ||
          notification?.actionType == Notification_Types.like ||
          notification?.actionType == Notification_Types.suggestion
        ) {
          navigation.navigate("MyPosts", {
            userId: notification.sender.id,
            username: notification.sender.name,
            refreshCall: postRefresh,
          });
        }
      }}
    >
      <View horizontal style={styles.container}>
        <LoadingImage
          source={{ uri: `${notification?.sender?.image}` }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 2,
            borderWidth: 1.4,
            borderRadius: 50 / 2,
            backgroundColor: Colors.outline,
            marginEnd: 5,
            borderColor: "yellow",
          }}
        />

        <Text
          style={{
            flex: 1,
            flexWrap: "wrap",
          }}
          sm
        >
          {notification?.message}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  profileImg: {
    marginRight: 15,
  },
});

export default NotificationListItem;

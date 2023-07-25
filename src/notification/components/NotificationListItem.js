import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Avatar, Text, Touchable, View } from "../../common";
import LoadingImage from "../../common/LoadingImage";
import * as Colors from "../../config/colors";

/* =============================================================================
<NotificationListItem />
============================================================================= */
const NotificationListItem = ({ notification }) => {
  const navigation = useNavigation();
  const type = notification?.type;
  const senderProfileUsername = notification?.sender?.username;
  const senderProfilePic = notification?.sender?.profileImage;

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
          source={{ uri: `${senderProfilePic}` }}
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
        <Text sm>{`${senderProfileUsername} has a suggestion for you`}</Text>
      </Touchable>
    );
  }
  const postRefresh = () => {
    console.log("click")
  }

  return (
    <View horizontal style={styles.container}>
         <TouchableOpacity
          onPress={() => {
            navigation.navigate('MyPosts', { userId: notification.sender.userId, username: notification.sender.username, refreshCall: postRefresh });
          }}
        >
      {/* <Avatar style={styles.profileImg} url={{ uri: `${senderProfilePic}` }} /> */}
      <LoadingImage
          source={{ uri: `${senderProfilePic}` }}
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
      </TouchableOpacity>
      <Text
        style={{
          flex: 1,
          flexWrap: "wrap",
        }}
        sm
      >{`${senderProfileUsername} is now Following you`}</Text>
    </View>
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

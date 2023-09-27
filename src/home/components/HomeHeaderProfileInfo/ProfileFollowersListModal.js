import React from "react";
import Modal from "react-native-modal";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";

import { Card, Text } from "../../../common";
import ProfileFollowersListItem from "./ProfileFollowersListItem";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

/* =============================================================================
 ProfileFollowersListModal />
============================================================================= */
const ProfileFollowersListModal = ({ visible, followers, onClose }) => {
  const navigation = useNavigation();

  const onItemPress = (user) => {
    onClose();
    navigation.pop();
    setTimeout(() => {
      navigation.navigate("MyPosts", {
        userId: user.userId,
        username: user.username,
      });
    }, 150);
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <SafeAreaView />

      <View
        style={{
          maxHeight: Dimensions.get("window").height - 350,
          backgroundColor: "white",
          paddingVertical: 20,
          borderRadius: 20,
        }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {followers?.length > 0 ? (
            followers?.map((id) => (
              <ProfileFollowersListItem
                key={id}
                id={id}
                onItemPress={onItemPress}
              />
            ))
          ) : (
            <Text>You don't have any followers</Text>
          )}
        </ScrollView>
      </View>

      <SafeAreaView />
    </Modal>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginVertical: 20,
  },
});

/* Export
============================================================================= */
export default ProfileFollowersListModal;

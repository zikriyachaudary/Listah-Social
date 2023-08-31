import React from "react";
import Modal from "react-native-modal";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";

import { Card, Text } from "../../../common";
import ProfileFollowersListItem from "./ProfileFollowersListItem";
import { ScrollView } from "react-native-gesture-handler";

/* =============================================================================
 ProfileFollowersListModal />
============================================================================= */
const ProfileFollowersListModal = ({ visible, followers, onClose }) => {
  return (
    <Modal
      isVisible={visible}
      
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <SafeAreaView />

        <View style={{ maxHeight: Dimensions.get("window").height - 350, backgroundColor : "white" , paddingVertical : 20, borderRadius : 20}}>

          <ScrollView showsVerticalScrollIndicator = {false}>
           
              {followers?.length > 0 ? (
                [...followers, ...followers, ...followers]?.map((id) => (
                  <ProfileFollowersListItem key={id} id={id} />
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

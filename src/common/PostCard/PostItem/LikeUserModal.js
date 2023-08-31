import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import {
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Card from "../../Card";
import ChevronLeftIcon from "../../../assets/icons/edit-chevron-left.svg";
import Touchable from "../../Touchable";
import Avatar from "../../Avatar";
import Text from "../../Text";
import * as Colors from "../../../config/colors";
import { getUserProfilesById } from "../../../home/redux/actions";
import View from "../../View";

const LikeUserModal = ({ visible, onClose, likedUsers }) => {
  const [likedUsersList, setLikedUsersList] = useState([]);
  const [isLoader, setLoader] = useState(true);

  useEffect(() => {
    getAllLikeProfileUsers();
  }, []);

  const getAllLikeProfileUsers = async () => {
    setLoader(true);
    const mUsers = await getUserProfilesById(likedUsers);
    console.log("printMyUsers - > ", mUsers);
    if (mUsers && mUsers.length > 0) {
      setLikedUsersList(mUsers);
    } else {
      setLikedUsersList([]);
    }
    setLoader(false);
  };

  const renderListEmptyComponent = () => (
    <View center style={styles.emptyListContainer}>
      {isLoader ? (
        <ActivityIndicator color={Colors.primary} size={"large"} />
      ) : (
        <Text>No Like User</Text>
      )}
    </View>
  );

  const renderItem = (item) => {
    return (
      <View horizontal style={styles.container}>
        <View horizontal>
          <Avatar url={{ uri: item.item.profileImage }} />
          <Text style={styles.userNameText}>{item.item.username}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <Modal
        isVisible={visible}
        style={styles.modal}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
      >
        <SafeAreaView />
        <View style={styles.header}>
          <Touchable style={styles.headerBackBtn} onPress={onClose}>
            <ChevronLeftIcon />
          </Touchable>
        </View>
      
          <FlatList
            refreshing={false}
            data={likedUsersList}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              return item.id;
            }}
            ListEmptyComponent={renderListEmptyComponent}
            contentContainerStyle={styles.contentContainer}
          />
        <SafeAreaView />
      </Modal>
    </SafeAreaView>
  );
};
const renderKeyExtractor = (item) => `${item.id}`;

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
    paddingHorizontal : 20
  },

  container: {
    marginTop: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  userNameText: {
    marginLeft: 10,
  },
  emptyListContainer: {
    height: "100%",
    alignSelf: "center",
    justifyContent: "center",
  },
  modal: {
    margin: 0,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#999",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    width: "100%",
  },

  headerBackBtn: {
    width: 50,
    height: 50,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LikeUserModal;

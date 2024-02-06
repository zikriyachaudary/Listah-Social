import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import { StyleSheet, SafeAreaView } from "react-native";
import Card from "../../Card";
import ChevronLeftIcon from "../../../assets/icons/edit-chevron-left.svg";
import Touchable from "../../Touchable";
import View from "../../View";
import LoadingImage from "../../LoadingImage";

const FullImageModal = ({ visible, onClose, userImage }) => {
  const [usersImage] = useState(userImage);

  useEffect(() => {}, []);
  return (
    <SafeAreaView>
      <Modal
        isVisible={visible}
        style={styles.modal}
        // swipeDirection={"up"}
        animationIn={"fadeIn"}
        animationOut={"slideOutRight"}
        useNativeDriver={true}
        onBackButtonPress={onClose}
        onBackdropPress={onClose}
      >
        <Card style={styles.card}>
          <SafeAreaView />
          <View style={styles.header}>
            <Touchable style={styles.headerBackBtn} onPress={onClose}>
              <ChevronLeftIcon />
            </Touchable>
          </View>
          <LoadingImage source={usersImage} style={styles.contentContainer} />
          <SafeAreaView />
        </Card>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    height: "80%",
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
    zIndex: 5,
    height: "100%",
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

export default FullImageModal;

import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";
import { AppColors, AppImages, normalized } from "../../util/AppConstant";
const ChatImageView = ({ showImageView, url, onClose }) => {
  return (
    <Modal
      visible={showImageView}
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        style={{
          ...style.mainView,
        }}
      >
        <TouchableOpacity
          onPress={() => onClose()}
          style={{
            marginTop: normalized(50),
            position: "absolute",
            width: "100%",
            zIndex: 200,
            justifyContent: "center",
          }}
        >
          <Image style={style.backButton} source={AppImages.Auth.backIcon} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
          }}
        >
          <ImageViewer
            imageUrls={[{ url: url }]}
            loadingRender={() => {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator
                    size={"large"}
                    color={AppColors.white.white}
                  />
                </View>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};
export default ChatImageView;
const style = StyleSheet.create({
  mainView: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    backgroundColor: "black",
  },
  backButton: {
    marginLeft: 20,
    height: 20,
    width: 20,
    marginBottom: 10,
    resizeMode: "contain",
    tintColor: "white",
    alignItems: "center",
  },
});

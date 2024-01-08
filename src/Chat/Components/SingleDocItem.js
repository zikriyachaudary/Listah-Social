import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { AppColors, AppImages, normalized } from "../../util/AppConstant";

const SingleDocItem = ({ item, onOpen }) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onOpen();
      }}
    >
      <View
        style={{
          ...style.mainView,
        }}
      >
        <Image
          style={{
            height: normalized(50),
            width: normalized(50),
            alignSelf: "center",
            tintColor: AppColors.blue.navy,
          }}
          source={AppImages.Chat.Document}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
const style = StyleSheet.create({
  mainView: {
    height: 200,
    width: 200,
    backgroundColor: AppColors.white.skyBlue,
    borderRadius: 10,
    alignSelf: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  innerView: {
    flex: 1,
    resizeMode: "cover",
  },
  loaderView: {
    position: "absolute",
    zIndex: 1,
    elevation: 3,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default SingleDocItem;

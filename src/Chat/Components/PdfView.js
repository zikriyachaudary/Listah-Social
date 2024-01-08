import React from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";
import Pdf from "react-native-pdf";
import { AppImages } from "../../util/AppConstant";
const PdfView = (props) => {
  const source = { uri: props?.url, cache: true };
  return (
    <View
      style={{
        ...style.mainView,
      }}
    >
      <SafeAreaView />
      <View
        style={{
          height: 20,
        }}
      />
      <TouchableWithoutFeedback onPress={() => props?.onClose()}>
        <Image style={style.backButton} source={AppImages.Auth.backIcon} />
      </TouchableWithoutFeedback>
      <View
        style={{
          flex: 1,
        }}
      >
        <Pdf
          trustAllCerts={false}
          source={source}
          onLoadComplete={(numberOfPages, filePath) => {}}
          onPageChanged={(page, numberOfPages) => {}}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {}}
          style={{
            flex: 1,
          }}
        />
      </View>
    </View>
  );
};
export default PdfView;
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
    marginBottom: 20,
    resizeMode: "contain",
    tintColor: "white",
  },
});

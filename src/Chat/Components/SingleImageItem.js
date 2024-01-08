import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
const SingleImageItem = ({ item, onPress }) => {
  const [loading, setLoading] = useState(true);
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          ...style.mainView,
        }}
      >
        <Image
          style={{
            ...style.innerView,
          }}
          source={{ uri: item.url }}
          onLoadEnd={() => {
            setLoading(false);
          }}
        />
        {loading && (
          <View
            style={{
              ...style.loaderView,
            }}
          >
            <ActivityIndicator size={"small"} color={"white"} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};
const style = StyleSheet.create({
  mainView: {
    height: 200,
    width: 200,
    backgroundColor: "black",
    borderRadius: 10,
    alignSelf: "center",
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
export default SingleImageItem;

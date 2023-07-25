import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import FastImage from "react-native-fast-image";
import * as Colors from "../config/colors";

const LoadingImage = (props) => {
  // console.log(props.source);
  const [loading, setLoading] = useState(false);
  const [src, setSource] = useState(props.source);

  useEffect(() => {
    setSource(props.source);
  }, [props.source]);
  return (
    <View
      style={{
        ...props.style,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Image
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          if (props.placeHolder) {
            setSource(props.placeHolder);
          }
        }}
        source={src}
        style={{
          ...props.style,
          borderWidth: 0,
          borderRadius: 0,
        }}
      /> */}

      <TouchableWithoutFeedback
        onPress={() => {
          console.log("clicked -- > ");
        }}
      >
        <FastImage
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            if (props.placeHolder) {
              setSource(props.placeHolder);
            }
          }}
          source={src}
          // <UploadIcon />
          style={{
            ...props.style,
          }}
        />
      </TouchableWithoutFeedback>
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"small"} color={Colors.primary} />
        </View>
      )}
    </View>
  );
};
export default LoadingImage;

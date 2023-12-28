import React from "react";
import { View, ActivityIndicator } from "react-native";
import { AppColors } from "../util/AppConstant";
const AppLoader = (props) => {
  console.log("props.visisble------>", props);
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        elevation: 3,
        zIndex: 100,
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          width: 80,
          height: 80,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
      >
        {props.visible ? (
          <ActivityIndicator size="large" color={AppColors.blue.lightNavy} />
        ) : null}
      </View>
    </View>
  );
};

export default AppLoader;

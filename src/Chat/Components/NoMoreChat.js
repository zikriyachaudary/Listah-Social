import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AppColors, normalized } from "../../util/AppConstant";

const NoMoreChat = (props) => {
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.message}>{props?.message}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: AppColors.grey.dark,
    height: normalized(30),
    alignItems: "center",
  },
  message: {
    color: AppColors.grey.dark,
    justifyContent: "center",
  },
});
export default NoMoreChat;

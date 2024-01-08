import React from "react";
import { View, StyleSheet, Image, TextInput } from "react-native";
import { AppColors, AppImages, normalized } from "../../util/AppConstant";

const SearchInput = (props) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <TextInput
        style={styles.input}
        onChangeText={props.onChangeTxt}
        value={props.value}
        placeholder={props.placeHolder}
        placeholderTextColor={props.placeHolderColor}
      />

      <Image
        source={AppImages.Auth.searchImg}
        style={styles.imageStyle}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    justifyContent: "center",
    borderColor: AppColors.grey.dark,
    height: normalized(50),
    borderRadius: 4,
  },
  imageStyle: {
    tintColor: AppColors.grey.dark,
  },
  input: {
    width: "87%",
    height: normalized(48),
    fontSize: 14,
  },
});

export default SearchInput;

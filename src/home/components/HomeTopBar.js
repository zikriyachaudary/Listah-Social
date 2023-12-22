import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  normalized,
} from "../../util/AppConstant";
import { useSelector } from "react-redux";
const HomeTopBar = (props) => {
  const selector = useSelector((AppState) => AppState?.Profile);
  const followers = selector?.profile?.followers;
  const followings = selector?.profile?.followings;
  return (
    <View style={styles.mainCont}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={props?.atMenuPress}
        style={styles.item}
      >
        <Image source={AppImages.Common.menuIcon} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        style={{ ...styles.item, justifyContent: "center" }}
        onPress={() => {
          props?.openFollowerModal(!props?.openModal);
        }}
      >
        <Image source={AppImages.Common.memberIcon} />
        <Text
          style={{
            ...styles.textStyle,
            marginStart: 4,
            bottom: -10,
          }}
        >{` ${
          followers?.length > 0
            ? followers?.length < 10
              ? `0${followers?.length}`
              : followers?.length > 99
              ? "+99"
              : followers?.length
            : 0
        }`}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        style={{ ...styles.item, justifyContent: "flex-end" }}
        onPress={() => {
          props?.atFollowingBtn();
        }}
      >
        <Image source={AppImages.Common.global} />
        <Text
          style={{
            ...styles.textStyle,
            bottom: -10,
          }}
        >
          {` ${
            followings?.length > 0
              ? followings?.length < 10
                ? `0${followings?.length}`
                : followings?.length > 99
                ? "+99"
                : followings?.length
              : 0
          }`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  mainCont: {
    flexDirection: "row",
    alignItems: "center",
    height: normalized(80),
    paddingHorizontal: AppHorizontalMargin,
    backgroundColor: AppColors.white.lightSky,
  },
  item: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  textStyle: {
    color: AppColors.blue.royalBlue,
    fontSize: normalized(16),
    fontWeight: "400",
  },
  imageStyle: {},
});
export default HomeTopBar;

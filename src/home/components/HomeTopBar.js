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
        style={styles.item}
        onPress={() => {
          props?.openFollowerModal(!props?.openModal);
        }}
      >
        <Image source={AppImages.Common.memberIcon} />
        <Text
          style={{
            ...styles.textStyle,
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
        style={styles.item}
        onPress={() => {
          props?.atFollowingBtn();
        }}
      >
        <Image source={AppImages.Common.global} />
        <Text
          style={{
            ...styles.textStyle,
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: AppHorizontalMargin,
    backgroundColor: AppColors.white.lightSky,
    paddingVertical: normalized(10),
  },
  item: {
    height: normalized(40),
    width: normalized(65),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  textStyle: {
    color: AppColors.blue.royalBlue,
    fontSize: normalized(16),
    fontWeight: "400",
  },
});
export default HomeTopBar;

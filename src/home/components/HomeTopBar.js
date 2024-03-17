import React, { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  darkModeColors,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import { useSelector } from "react-redux";
import { Theme_Mode } from "../../util/Strings";
const HomeTopBar = (props) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const selector = useSelector((AppState) => AppState?.Profile);
  const followers = selector?.profile?.followers;
  const followings = selector?.profile?.followings;
  return (
    <View
      style={{
        ...styles.mainCont,
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : AppColors.white.lightSky,
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={props?.atMenuPress}
        style={styles.item}
      >
        <Image
          source={AppImages.Common.menuIcon}
          style={{
            tintColor:
              themeType == Theme_Mode.isDark
                ? AppColors.white.white
                : AppColors.grey.dark,
          }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={1}
        style={{ ...styles.item, justifyContent: "center" }}
        onPress={() => {
          props?.openFollowerModal(!props?.openModal);
        }}
      >
        <Image
          source={AppImages.Common.memberIcon}
          style={{
            tintColor:
              themeType == Theme_Mode.isDark
                ? AppColors.white.white
                : AppColors.grey.dark,
          }}
        />
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
        <Image
          source={AppImages.Common.global}
          style={{
            tintColor:
              themeType == Theme_Mode.isDark
                ? AppColors.white.white
                : AppColors.grey.dark,
          }}
        />
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

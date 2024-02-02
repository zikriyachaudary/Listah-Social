import React from "react";
import {
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../util/AppConstant";
const CustomHeader = (props) => {
  return (
    <>
      {props?.isStatusBar ? (
        <StatusBar
          animated={true}
          backgroundColor={AppColors.blue.lightNavy}
          barStyle={"light-content"}
          showHideTransition={"fade"}
        />
      ) : null}

      <View
        style={[
          {
            ...styles.maincontainer,
            height: normalized(props?.title ? 50 : props?.logo ? 65 : 55),
          },
          props?.mainStyle,
        ]}
      >
        <>
          {props?.atBackPress ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                props?.atBackPress();
              }}
              style={{
                width: normalized(30),
                height: hv(40),
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-start",
                marginTop: hv(10),
              }}
            >
              {props?.leftIcon ? (
                <Image
                  source={props?.leftIcon}
                  style={[styles.leftBtn, props?.leftIconStyle]}
                />
              ) : (
                <Image
                  source={AppImages.Auth.backIcon}
                  style={[styles.leftBtn, props?.leftIconStyle]}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View style={{ marginHorizontal: normalized(20) }} />
          )}

          {props?.title ? (
            <Text style={styles.title} numberOfLines={2}>
              {props?.title}
            </Text>
          ) : props?.logo ? (
            <Image source={props?.logo} style={styles.logoImage} />
          ) : null}

          {props?.atRightBtn && props?.isRightAction ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-start",
                marginTop: hv(10),
              }}
            >
              {props?.atRightFirstBtn ? (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    props?.atRightFirstBtn();
                  }}
                  style={
                    props?.rightIcon
                      ? {
                          width: normalized(30),
                          height: hv(40),
                          justifyContent: "center",
                          alignItems: "center",
                          marginHorizontal: normalized(5),
                        }
                      : {
                          backgroundColor: AppColors.blue.light,
                          height: normalized(40),
                          width: normalized(80),
                          borderRadius: normalized(8),
                          justifyContent: "center",
                          alignItems: "center",
                          marginHorizontal: normalized(5),
                        }
                  }
                >
                  {props?.righFirstTxt ? (
                    <Text style={styles.rightTxt}>{props?.righFirstTxt}</Text>
                  ) : null}
                  {props?.rightFirstIcon ? (
                    <Image
                      source={props?.rightFirstIcon}
                      style={styles.leftBtn}
                    />
                  ) : null}
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  props?.atRightBtn();
                }}
                style={
                  props?.rightIcon
                    ? {
                        width: normalized(30),
                        height: hv(40),
                        justifyContent: "center",
                        alignItems: "center",
                      }
                    : {
                        backgroundColor: AppColors.blue.royalBlue,
                        height: normalized(40),
                        width: normalized(80),
                        borderRadius: normalized(8),
                        justifyContent: "center",
                        alignItems: "center",
                      }
                }
              >
                {props?.rightTxt ? (
                  <Text style={styles.rightTxt}>{props?.rightTxt}</Text>
                ) : null}
                {props?.rightIcon ? (
                  <Image source={props?.rightIcon} style={styles.leftBtn} />
                ) : null}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginHorizontal: hv(25) }} />
          )}
        </>
      </View>
      {props?.showBorder ? <View style={styles.line} /> : null}
    </>
  );
};
const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: AppColors.blue.lightNavy,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: AppHorizontalMargin,
    alignItems: "flex-end",
    height: normalized(65),
  },
  title: {
    marginTop: normalized(20),
    marginStart: normalized(10),
    color: AppColors.white.white,
    fontSize: normalized(18),
    fontWeight: "500",
    maxWidth: "70%",
    height: normalized(45),
  },
  line: {
    height: 0.5,
    backgroundColor: AppColors.white.white,
    marginTop: hv(5),
  },
  rightTxt: {
    fontSize: normalized(14),
    fontWeight: "400",
    color: AppColors.white.white,
  },
  leftBtn: {
    tintColor: AppColors.white.white,
    resizeMode: "contain",
    height: normalized(25),
    width: normalized(25),
  },
  logoImage: {
    marginTop: 10,
    height: normalized(75),
    width: normalized(80),
  },
});
export default CustomHeader;

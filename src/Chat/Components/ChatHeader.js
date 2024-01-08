import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../../util/AppConstant";
import LoadingImage from "../../common/LoadingImage";
const ChatHeader = (props) => {
  const getOfflineTime = () => {
    let findedDate = moment(
      moment(
        props?.otherUserStatus?.OfflineAt,
        ThreadManager.instance.dateFormater.fullDate
      )
    );
    let timeDate = findedDate.format(ThreadManager.instance.dateFormater.time);
    return moment(timeDate, "HH:mm:ss").format("ddd hh:mm A");
  };
  return (
    <>
      <View style={[styles.maincontainer, props?.mainStyle]}>
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (props?.atBackPress) {
                  props?.atBackPress();
                }
              }}
              style={{
                paddingVertical: normalized(7),
              }}
            >
              <Image
                source={AppImages.Auth.backIcon}
                style={{ tintColor: AppColors.black.black }}
              />
            </TouchableOpacity>
            {props?.profile?.length > 0 ? (
              <LoadingImage
                source={{ uri: `${props?.profile}` }}
                style={{ ...styles.img, ...props.imgStyle }}
              />
            ) : (
              <Image
                source={AppImages.Common.profile}
                style={{ ...styles.img, ...props.imgStyle }}
              />
            )}
            <View>
              <Text style={styles.title}>{props?.title}</Text>
              {props?.otherUserStatus?.value ? (
                <Text style={styles.des}>
                  {props?.otherUserStatus?.value == "Online"
                    ? "online"
                    : `Last seen at ${getOfflineTime()}`}
                </Text>
              ) : null}
            </View>
          </View>

          {props?.atRightBtn ? (
            <TouchableOpacity
              activeOpacity={1}
              style={{
                paddingHorizontal: normalized(8),
              }}
              onPress={() => {
                props?.atRightBtn();
              }}
            >
              {props?.rightTxt ? (
                <Text style={styles.rightTxt}>{props?.rightTxt}</Text>
              ) : (
                <Image
                  source={AppImages.Common.menuIcon}
                  style={{
                    tintColor: AppColors.black.black,
                  }}
                />
              )}
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </>
      </View>
      {props.showBorder ? <View style={styles.line} /> : null}
    </>
  );
};
const styles = StyleSheet.create({
  maincontainer: {
    backgroundColor: AppColors.white.white,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: AppHorizontalMargin,
    alignItems: "center",
    paddingVertical: hv(10),
  },
  title: {
    color: "#1E1E1F",
    fontSize: normalized(18),
  },
  des: {
    color: AppColors.grey.simple,
    fontSize: normalized(14),
    fontWeight: "400",
  },
  line: {
    height: 0.8,
    backgroundColor: "#E8E6EA",
    marginTop: hv(5),
  },
  rightTxt: {
    fontSize: normalized(14),
    color: AppColors.black.black,
  },
  img: {
    height: normalized(40),
    width: normalized(40),
    borderRadius: normalized(40 / 2),
    marginHorizontal: normalized(10),
  },
});
export default ChatHeader;

import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoadingImage from "../../common/LoadingImage";
import {
  AppColors,
  AppImages,
  hv,
  AppHorizontalMargin,
  normalized,
} from "../../util/AppConstant";
import { removeEmptyLines } from "../../util/helperFun";
import ThreadManager from "../../ChatModule/ThreadManger";
const SingleChatComponent = (props) => {
  const [time, setTime] = useState("");
  const [count, setUnreadCount] = useState(
    props?.obj[`${[props.obj.participants[props?.findedIndex].user]}$$`]
      ? `${props?.obj[props?.obj.participants[props?.findedIndex].user]}`
      : 0
  );

  useEffect(() => {
    checkUnreadCount();
  }, [props?.obj]);

  const checkUnreadCount = () => {
    if (props?.obj?.createdAt) {
      let findedDate = moment(
        moment(
          props?.obj?.createdAt,
          ThreadManager.instance.dateFormater.fullDate
        )
      );
      setTime(moment(findedDate).fromNow());
    }
    if (props?.obj[`${[props?.obj.participants[props?.findedIndex].user]}$$`]) {
      setUnreadCount(
        props?.obj[`${[props?.obj.participants[props?.findedIndex].user]}$$`]
      );
    } else {
      setUnreadCount(0);
    }
  };

  const renderImage = () =>
    useMemo(() => {
      return (
        <LoadingImage
          source={{ uri: props?.profileImage }}
          placeHolder={AppImages.Common.profile}
          style={styles.profilePic}
        />
      );
    }, [props?.profileImage]);
  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={() => props?.atPress()}>
        <View style={styles.mainContainer}>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              onPress={() => {
                if (props?.goToProfile) {
                  props?.goToProfile();
                }
              }}
            >
              {renderImage()}
            </TouchableOpacity>

            <View style={styles.userContainer}>
              <Text numberOfLines={1} style={styles.userName}>
                {props?.name}
              </Text>
              {props?.msg == "Audio" ? (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={AppImages.Chat.Microphone}
                    style={{
                      tintColor: AppColors.grey.dark,
                      height: 15,
                      width: 15,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: AppColors.grey.dark,
                      fontSize: 14,
                      marginLeft: 5,
                    }}
                  >
                    Voice message
                  </Text>
                </View>
              ) : (
                <Text numberOfLines={2} style={styles.msg}>
                  {removeEmptyLines(props.msg)}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeTxt}>{time}</Text>
            {count > 0 ? (
              <View style={styles.counterContainer}>
                {count?.length > 99 ? (
                  <Text style={styles.counterTxt}>+99</Text>
                ) : (
                  <Text style={styles.counterTxt}>{count}</Text>
                )}
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.bottomLine} />
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: AppHorizontalMargin,
  },
  innerContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    flex: 1,
  },
  profilePic: {
    height: normalized(50),
    width: normalized(50),
    borderRadius: normalized(25),
  },
  userContainer: {
    flex: 1,
    marginStart: normalized(10),
  },
  userName: {
    fontSize: normalized(14),
    fontWeight: "500",
    color: AppColors.black.dark,
  },
  msg: {
    fontSize: normalized(12),
    fontWeight: "400",
    color: AppColors.grey.dark,
    maxWidth: "85%",
  },
  timeContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingLeft: 5,
  },
  timeTxt: {
    fontSize: normalized(12),
    fontWeight: "400",
    color: AppColors.grey.dark,
  },
  counterContainer: {
    backgroundColor: AppColors.blue.lightNavy,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: normalized(10),
    height: normalized(15),
    width: normalized(15),
  },
  counterTxt: {
    fontSize: 10,
    color: AppColors.white.white,
  },
  bottomLine: {
    height: hv(1),
    backgroundColor: AppColors.grey.light,
  },
});
export default SingleChatComponent;

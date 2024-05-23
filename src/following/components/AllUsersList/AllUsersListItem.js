import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";

import { Avatar, Button, Text, View } from "../../../common";

import { getUserFollowings } from "../../redux/selectors";
import {
  followUser as followUserAction,
  unFollowUser as unFollowUserAction,
} from "../../redux/actions";
import { updateHomeData } from "../../../home/redux/appLogics";
import * as Colors from "../../../config/colors";
import LoadingImage from "../../../common/LoadingImage";
import { useNavigation } from "@react-navigation/native";
import useNotificationManger from "../../../hooks/useNotificationManger";
import { Notification_Types, Theme_Mode } from "../../../util/Strings";
import {
  AppColors,
  AppImages,
  darkModeColors,
  lightModeColors,
  normalized,
} from "../../../util/AppConstant";
import FastImage from "react-native-fast-image";

/* =============================================================================
<AllUsersListItem />
============================================================================= */
const AllUsersListItem = ({
  user,
  userFollowings,
  unFollowUser,
  followUser,
}) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const { followNUnFollowUser } = useNotificationManger();
  const [loading, setLoading] = useState(false);
  const userId = user?.userId;
  const userName = user?.username;
  const userProfileImage = user?.profileImage;
  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState);
  const [isFollowed, setIsFollowed] = useState(false);
  useEffect(() => {
    setIsFollowed(userFollowings?.find((user) => user?.userId === userId));
  }, [userFollowings]);
  const navigation = useNavigation();
  const _handleFollowPress = async () => {
    setLoading(true);
    await followNUnFollowUser({
      actionType: Notification_Types.follow,
      reciverId: userId,
    });
    await followUser(userId, (res) => {
      if (res?.status) {
        setIsFollowed(true);
      }
    });
    dispatch(updateHomeData(!selector.Home.updateHomeData));
    setLoading(false);
  };
  const postRefresh = () => {
    console.log("click");
  };
  const _handleUnFollowPress = async () => {
    // if (isFollowed) {
    setLoading(true);
    await followNUnFollowUser({
      actionType: Notification_Types.unFollow,
      reciverId: userId,
    });
    await unFollowUser(userId, (res) => {
      if (res?.status) {
        setIsFollowed(false);
      }
    });
    dispatch(updateHomeData(!selector.Home.updateHomeData));
    setLoading(false);
    // }
  };

  if (!user) {
    return null;
  }
  return (
    <>
      <View horizontal style={styles.container}>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.navigate("MyPosts", {
              userId: userId,
              username: userName,
              refreshCall: postRefresh,
            });
          }}
        >
          <View horizontal>
            <View style={{ marginBottom: normalized(10) }}>
              <LoadingImage
                source={{ uri: `${userProfileImage}` }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 2,
                  marginVertical: 10,
                  borderWidth: 1.4,
                  borderRadius: 68 / 2,
                  backgroundColor: Colors.outline,
                  borderColor:
                    themeType === Theme_Mode.isDark
                      ? AppColors.white.white
                      : AppColors.blue.royalBlue,
                }}
              />
              {user?.verified ? (
                <FastImage
                  style={{
                    position: "absolute",
                    width: normalized(35),
                    height: normalized(35),
                    borderRadius: normalized(35 / 2),
                    bottom: normalized(-8),
                    right: normalized(-8),
                    alignSelf: "flex-end",
                  }}
                  source={AppImages.Common.aPlusIcon}
                />
              ) : null}
            </View>

            <View style={{ width: "55%", marginStart: normalized(10) }}>
              <Text
                style={{
                  ...styles.userNameText,
                  color:
                    themeType == Theme_Mode.isDark
                      ? darkModeColors.text
                      : lightModeColors.text,
                }}
                numberOfLines={2}
              >
                {userName}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        {isFollowed ? (
          <Button
            title="Unfollow"
            style={styles.btn}
            loading={loading}
            btnTxtStyles={styles.btnTxtStyles}
            onPress={_handleUnFollowPress}
          />
        ) : (
          <Button
            title="Follow"
            style={styles.btn}
            loading={loading}
            btnTxtStyles={styles.btnTxtStyles}
            onPress={_handleFollowPress}
          />
        )}
      </View>
      <View
        style={{ backgroundColor: AppColors.grey.simpleGrey, height: 0.5 }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    justifyContent: "space-between",
  },
  userNameText: {
    flexWrap: "wrap",
  },
  btn: {
    width: normalized(85),
    height: normalized(30),
    paddingHorizontal: 0,
  },
  btnTxtStyles: {
    fontSize: 12,
  },
});

const mapStateToProps = (state) => ({
  userFollowings: getUserFollowings(state),
});

const mapDispatchToProps = {
  followUser: followUserAction,
  unFollowUser: unFollowUserAction,
};

/* Export
============================================================================= */
export default connect(mapStateToProps, mapDispatchToProps)(AllUsersListItem);

import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";

import { Avatar, Button, Text, View } from "../../../common";

import { unFollowUser as unFollowUserAction } from "../../redux/actions";
import * as Colors from "../../../config/colors";
import LoadingImage from "../../../common/LoadingImage";
import { useNavigation } from "@react-navigation/native";
import {
  AppColors,
  AppImages,
  darkModeColors,
  lightModeColors,
  normalized,
} from "../../../util/AppConstant";
import FastImage from "react-native-fast-image";
import { Theme_Mode } from "../../../util/Strings";

/* =============================================================================
<FollowingUsersListItem />
============================================================================= */
const FollowingUsersListItem = ({ user, unFollowUser }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const [loading, setLoading] = useState(false);
  const userId = user?.userId;
  const userName = user?.username;
  const userProfileImage = user?.profileImage;
  const navigation = useNavigation();

  const _handleUnFollowPress = async () => {
    setLoading(true);

    await unFollowUser(userId, (res) => {
      if (res?.status) {
      }
    });
    setLoading(false);
  };

  if (!user) {
    return null;
  }

  const postRefresh = () => {
    console.log("click");
  };

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
                  source={
                    themeType === Theme_Mode.isDark
                      ? AppImages.Common.aPlusIconDark
                      : AppImages.Common.aPlusIcon
                  }
                />
              ) : null}
            </View>

            <View style={{ width: "55%", marginStart: normalized(10) }}>
              <Text
                style={{
                  ...styles.userNameTxt,
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
        <Button
          title="Unfollow"
          loading={loading}
          style={styles.btn}
          btnTxtStyles={styles.btnTxtStyles}
          onPress={_handleUnFollowPress}
        />
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
  userNameTxt: {
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

const mapDispatchToProps = {
  unFollowUser: unFollowUserAction,
};

/* Export
============================================================================= */
export default connect(null, mapDispatchToProps)(FollowingUsersListItem);

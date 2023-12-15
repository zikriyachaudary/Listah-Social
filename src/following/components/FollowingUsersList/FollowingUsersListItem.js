import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";

import { Avatar, Button, Text, View } from "../../../common";

import { unFollowUser as unFollowUserAction } from "../../redux/actions";
import * as Colors from "../../../config/colors";
import LoadingImage from "../../../common/LoadingImage";
import { useNavigation } from "@react-navigation/native";
import { AppColors, normalized } from "../../../util/AppConstant";

/* =============================================================================
<FollowingUsersListItem />
============================================================================= */
const FollowingUsersListItem = ({ user, unFollowUser }) => {
  const [loading, setLoading] = useState(false);
  const userId = user?.userId;
  const userName = user?.username;
  const userProfileImage = user?.profileImage;
  const navigation = useNavigation();

  const _handleUnFollowPress = async () => {
    setLoading(true);
    await unFollowUser(userId);
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
            {/* <Avatar url={{ uri: `${userProfileImage}` }} /> */}
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
                borderColor: AppColors.blue.royalBlue,
              }}
            />
            <Text style={styles.userNameTxt}>
              {userName}
              {user?.verified ? (
                <Text
                  style={{
                    color: Colors.primary,
                  }}
                >{`\n(A+)`}</Text>
              ) : null}
            </Text>
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
    marginLeft: 10,
    width: "45%",
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

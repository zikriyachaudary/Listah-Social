import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Text, Touchable, View } from "../../../common";
import ProfileFollowersListModal from "./ProfileFollowersListModal";

import { getProfile } from "../../../profile/redux/selectors";
import { AppColors, AppImages, normalized } from "../../../util/AppConstant";

/* =============================================================================
<HomeHeaderProfileInfo />
============================================================================= */
const HomeHeaderProfileInfo = ({ profile }) => {
  const navigation = useNavigation();
  const [followersModal, setFollowersModal] = useState(false);
  const followers = profile?.followers;
  const followings = profile?.followings;

  // useEffect(()=>{
  //   console.log("followersList - > " , JSON.stringify(followers))
  // }, [])
  const _toggleFollowersModal = () => setFollowersModal((prev) => !prev);

  const _handleFollowingPress = () => {
    navigation.navigate("FollowingStack");
  };

  const _handleMyPostedPress = () => {
    console.log("printProfile = > ", profile?.userId);
    if (profile?.userId) {
      navigation.navigate("MyPosts", {
        userId: profile.userId,
        username: profile.username,
      });
    }
  };

  return (
    <View horizontal style={styles.container}>
      <Touchable center style={styles.item} onPress={_handleMyPostedPress}>
        <Image source={AppImages.Common.menuIcon} />
      </Touchable>
      <Touchable center style={styles.item} onPress={_toggleFollowersModal}>
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
      </Touchable>
      <Touchable center style={styles.item} onPress={_handleFollowingPress}>
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
      </Touchable>
      <ProfileFollowersListModal
        followers={followers}
        visible={followersModal}
        onClose={_toggleFollowersModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  item: {
    height: normalized(45),
    width: normalized(70),
    alignItems: "flex-start",
  },
  textStyle: {
    color: AppColors.blue.royalBlue,
    position: "absolute",
    right: 10,
    bottom: 0,
    fontSize: normalized(16),
    fontWeight: "400",
  },
});

const mapStateToProps = (state) => ({
  profile: getProfile(state),
});

export default connect(mapStateToProps)(HomeHeaderProfileInfo);

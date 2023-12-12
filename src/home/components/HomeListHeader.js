import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { StackHeader } from "../../common";
import AddIcon from "../../assets/icons/edit-plus-square.svg";
import NavSearch from "../../assets/icons/nav-search.svg";

import HomeHeaderProfileInfo from "./HomeHeaderProfileInfo";
import { Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { AppColors, AppImages } from "../../util/AppConstant";

import ProfileIcon from "../../assets/icons/nav-profile-icon.svg";

/* =============================================================================
<HomeListHeader />
============================================================================= */
const HomeListHeader = ({ postRefresh, searchClicked, listSize }) => {
  const navigation = useNavigation();
  const selector = useSelector((AppState) => AppState);

  const _handleCreatePostPress = () =>
    navigation.navigate("PostCreate", {
      postRefresh: postRefresh,
      isAnnouncement: true,
    });

  return (
    <View>
      {/* <StackHeader
        // left={<AddIcon />}
        title={" "}
        left={
          <Image
            source={require("../../assets/images/announcement-ic.png")}
            style={{
              width: 35,
              height: 35,
            }}
          />
        }
        // right={listSize > 0 ? <NavSearch /> : null}
        right={
          listSize > 0 ? <ProfileIcon stroke={AppColors.blue.navy} /> : null
        }
        rightContainerStyle={{
          justifyContent: "center",
        }}
        onLeftPress={_handleCreatePostPress}
        onRightPress={searchClicked}
        isHome={
          selector.Profile &&
          selector.Profile.profile &&
          selector.Profile.profile.isAdmin
            ? false
            : true
        }
      /> */}
      <HomeHeaderProfileInfo />
    </View>
  );
};

export default HomeListHeader;

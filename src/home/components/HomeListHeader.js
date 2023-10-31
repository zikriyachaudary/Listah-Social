import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { StackHeader } from "../../common";
import AddIcon from "../../assets/icons/edit-plus-square.svg";
import NavSearch from "../../assets/icons/nav-search.svg";

import HomeHeaderProfileInfo from "./HomeHeaderProfileInfo";
import { Image, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

/* =============================================================================
<HomeListHeader />
============================================================================= */
const HomeListHeader = ({
  postRefresh,
  filterClick,
  searchClicked,
  listSize,
}) => {
  const navigation = useNavigation();
  const selector = useSelector((AppState) => AppState);

  const _handleCreatePostPress = () =>
    navigation.navigate("PostCreate", {
      postRefresh: postRefresh,
      isAnnouncement: true,
    });

  return (
    <View>
      <StackHeader
        // left={<AddIcon />}
        left={
          <Image
            source={require("../../assets/images/announcement-ic.png")}
            style={{
              width: 35,
              height: 35,
            }}
          />
        }
        right={listSize > 0 ? <NavSearch /> : null}
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
      />
      <HomeHeaderProfileInfo />
      {/* <View style={{
        flex: 1,
        height: 30,
        alignItems: "flex-end",
        marginHorizontal: 10
      }}>
        <TouchableOpacity
          onPress={filterClick}
        >
          <Image
            style={{
              width: 30,
              height: 30,
            }}
            source={require("../../assets/icons/filter-ic.png")}
          />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

export default HomeListHeader;

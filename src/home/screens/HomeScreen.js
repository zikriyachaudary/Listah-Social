import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  TextInput,
} from "react-native";
// import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import ChevronLeftIcon from "../../assets/icons/edit-chevron-left.svg";

import { PostItem, Text } from "../../common";
import ListFooter from "../components/ListFooter";

import { getPosts as selectPosts } from "../redux/selectors";
import { getProfile as getProfileAction } from "../../profile/redux/actions";
import {
  blockUsers,
  getAnnouncementPosts,
  getHomePosts as getHomePostsAction,
  getMyHomePosts,
  refreshHomePosts as refreshHomePostsAction,
} from "../redux/actions";
import { useState } from "react";
import * as Colors from "../../config/colors";
import Modal, { ReactNativeModal } from "react-native-modal";
import { UPDATE_CHALLENGE_FEATURE } from "../../suggestion/redux/constants";
import FastImage from "react-native-fast-image";
import {
  AppColors,
  AppImages,
  darkModeColors,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import CustomHeader from "../../common/CommonHeader";
import TopicsComp from "../components/TopicsComp";
import HomeTopBar from "../components/HomeTopBar";
import ProfileFollowersListModal from "../components/HomeHeaderProfileInfo/ProfileFollowersListModal";
import { filterPostReq } from "../../network/Services/ProfileServices";
import { setIsAppLoader } from "../../redux/action/AppLogics";
import { Routes } from "../../util/Route";
import VideoPlayerModal from "../../common/VideoPlayerModal";
import { Theme_Mode } from "../../util/Strings";

/* =============================================================================
<HomeScreen />
============================================================================= */

const HomeScreen = ({ posts, getProfile }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const selector = useSelector((AppState) => AppState);
  const dispatch = useDispatch();
  const [openVideoModal, setOpenVideoModal] = useState("");
  const [followerModal, setFollowerModal] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const profileData = selector?.Profile?.profile;
  const [searchPostVisible, setSearchPostVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [filterByCatList, setFilterByCat] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  // const [radioButtons, setRadioButtons] = useState([
  //   {
  //     id: "1", // acts as primary key, should be unique and non-empty string
  //     label: "Ascending List",
  //     value: "ascendinglist",
  //     borderColor: "#6d14c4",
  //     selected: true,
  //   },
  //   {
  //     id: "2",
  //     label: "Descending List",
  //     value: "descendinglist",
  //     borderColor: "#6d14c4",
  //   },
  // ]);
  const [reportPostModal, setReportPostModal] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  // GET POSTS
  const [isFilterPopup, setIsFilterPopup] = useState(false);
  const [homePosts, setHomePosts] = useState([]);
  const [filtersPost, setFiltersPost] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");

  const [isUpdate, setUpdate] = useState(false);

  useEffect(() => {
    setLoaderVisible(true);
    getProfile();
    getMyUserHomePosts();
  }, [selector.Home.updateHomeData]);

  useEffect(() => {
    setLoaderVisible(true);
    getMyUserHomePosts();
  }, [selector.Home.isPostRefresh]);
  useEffect(() => {}, [filterByCatList, homePosts]);
  const getMyUserHomePosts = async () => {
    const mAnnouncementPosts = await getAnnouncementPosts();
    const mHomePosts = await getMyHomePosts();
    if (UPDATE_CHALLENGE_FEATURE.isUpdate) {
      setHomePosts([]);
      UPDATE_CHALLENGE_FEATURE.isUpdate = false;
    }

    let announcementList = mAnnouncementPosts.map((item) => {
      let itemsTitleAndDescription = "";
      item.items.forEach((element) => {
        itemsTitleAndDescription += element.name + element.description;
      });
      const mSearchTxts =
        item.title + item.description + itemsTitleAndDescription;
      const obj = { ...item, searchTxt: mSearchTxts };
      return obj;
    });

    const compList = mHomePosts.map((item) => {
      let itemsTitleAndDescription = "";
      item.items.forEach((element) => {
        itemsTitleAndDescription += element.name + element.description;
      });
      const mSearchTxts =
        item.title + item.description + itemsTitleAndDescription;
      const obj = { ...item, searchTxt: mSearchTxts };
      return obj;
    });

    if (announcementList.length > 0) {
      announcementList = [announcementList[0]];
    }
    const mFinalList = [...announcementList, ...compList];
    setTimeout(() => {
      setHomePosts(mFinalList);
      setUpdate(!isUpdate);
      setRefreshing(false);
      setLoaderVisible(false);
    }, 20);
  };
  const _handlePostsGet = () => {
    if (posts) {
      // refreshHomePosts(posts[posts.length - 1]);
    }
  };
  const _handleRefresh = async () => {
    if (selectedCat?.name) {
      setRefreshing(true);
      await filterPostReq(selectedCat?.name, (res) => {
        setFilterByCat(res);
      });
    } else {
      setRefreshing(true);
      getMyUserHomePosts();
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <PostItem
        id={item?.id}
        post={item}
        postIndex={index}
        showIndex={toggleCheckBox}
        postRefresh={() => {
          setLoaderVisible(true);
          getMyUserHomePosts();
        }}
        postDel={() => {
          getMyUserHomePosts();
        }}
        openVideoModal={(uri) => {
          setOpenVideoModal(uri);
        }}
        postReport={async (isReportCount) => {
          console.log("called");
          if (isReportCount == 2) {
            await blockUsers(item.author.userId);
            getMyUserHomePosts();
          } else {
            reportPostItem = item;
            setReportPostModal(true);
            navigation.navigate("ReportPost", {
              post: item,
              isReportCount: isReportCount,
            });
          }
        }}
      />
    );
  };

  useIsFocused();
  const emptyComponent = () => {
    let noPostFound = selectedCat?.name
      ? filterByCatList?.length == 0
      : homePosts?.length == 0;
    return (
      <View style={styles.container}>
        {
          loaderVisible && !selectedCat?.name ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            noPostFound &&
            !selector?.sliceReducer?.isLoaderStart && (
              <Text sm center>
                Nothing to show yet
              </Text>
            )
          )

          // homePosts.length == 0 && <Text sm center>You don't have any followers. follow people to see there posts</Text>
        }
      </View>
    );
  };
  const WrapperComponent = () => {
    return (
      <ReactNativeModal
        isVisible={isFilterPopup}
        onBackdropPress={() => {
          setIsFilterPopup(!isFilterPopup);
        }}
      >
        <FastImage
          source={require("../../assets/images/edit-app-logo.jpeg")}
          style={{
            flex: 0.9,
          }}
        />

        <Image
          style={{
            width: 35,
            height: 35,
            margin: 20,
            marginTop: 40,
            fontSize: 30,
            color: "black",
            position: "absolute",
            top: 20,
          }}
          source={require("../../assets/images/cross_ic.png")}
        />
      </ReactNativeModal>
    );
  };
  const _handleMyPostedPress = () => {
    if (selector?.Profile?.profile?.userId) {
      navigation.navigate("MyPosts", {
        userId: selector?.Profile?.profile.userId,
        username: selector?.Profile?.profile.username,
      });
    }
  };
  return (
    <View
      style={{
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : AppColors.white.simpleLight,
        flex: 1,
      }}
    >
      {searchPostVisible ? (
        <View style={styles.searchTopStyle}>
          <TouchableOpacity
            onPress={() => {
              setFiltersPost([]);
              setSearchTxt("");
              setSearchPostVisible(!searchPostVisible);
            }}
          >
            <View
              style={{
                paddingHorizontal: 5,
                backgroundColor: "white",
              }}
            >
              <ChevronLeftIcon />
            </View>
          </TouchableOpacity>

          <TextInput
            style={{
              flex: 1,
              height: 40,
              fontSize: 16,
              color: "black",
            }}
            placeholder="Search in post..."
            placeholderTextColor={"gray"}
            value={searchTxt}
            onChange={(txt) => {
              let usersFiltersPost = [];
              homePosts.forEach((obj) => {
                if (
                  obj.searchTxt
                    .toLowerCase()
                    .includes(String(txt.nativeEvent.text).toLowerCase())
                ) {
                  usersFiltersPost.push(obj);
                }
              });
              console.log("filter -- > ", usersFiltersPost);
              setFiltersPost(
                txt.nativeEvent.text == "" ? [] : usersFiltersPost
              );
              setSearchTxt(txt);
            }}
          />
        </View>
      ) : null}
      {!selector?.DraftPost?.isAdmin ? (
        <CustomHeader
          isStatusBar={true}
          logo={AppImages.Common.appLogo}
          mainStyle={{ backgroundColor: AppColors.blue.royalBlue }}
          atRightBtn={() => {
            navigation.navigate("Profile");
          }}
          isRightAction={true}
          rightIcon={AppImages.Common.profile}
          rightFirstIcon={AppImages.Chat.chat}
          atRightFirstBtn={() => {
            navigation.navigate(Routes.Chat.chatList);
          }}
        />
      ) : (
        <CustomHeader
          atBackPress={() => {
            navigation.navigate("PostCreate", {
              postRefresh: getMyUserHomePosts(),
              isAnnouncement: true,
            });
          }}
          leftIcon={AppImages.Common.announcement}
          isStatusBar={true}
          logo={AppImages.Common.appLogo}
          mainStyle={{ backgroundColor: AppColors.blue.royalBlue }}
          atRightBtn={() => {
            navigation.navigate("Profile");
          }}
          isRightAction={true}
          rightIcon={AppImages.Common.profile}
          rightFirstIcon={AppImages.Chat.chat}
          atRightFirstBtn={() => {
            navigation.navigate(Routes.Chat.chatList);
          }}
        />
      )}

      <TopicsComp
        topicsList={selector?.sliceReducer?.categoriesList}
        selectedCat={selectedCat}
        setSelectedCat={async (val) => {
          setSelectedCat(val);
          dispatch(setIsAppLoader(true));
          if (val?.name) {
            setHomePosts([]);
            setFilterByCat([]);
            await filterPostReq(val?.name, (res) => {
              setFilterByCat(res);
            });
          } else {
            await getMyUserHomePosts();
          }
          setTimeout(() => {
            dispatch(setIsAppLoader(false));
          }, 2000);
        }}
      />
      <HomeTopBar
        profile={profileData}
        atMenuPress={() => {
          _handleMyPostedPress();
        }}
        openModal={followerModal}
        openFollowerModal={(val) => {
          setFollowerModal(val);
        }}
        atFollowingBtn={() => {
          navigation.navigate("FollowingStack");
        }}
      />
      <FlatList
        style={{
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : AppColors.white.lightSky,
          paddingHorizontal: 18,
          paddingVertical: normalized(10),
          zIndex: 0,
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        data={selectedCat?.name ? filterByCatList : homePosts}
        refreshing={refreshing}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={ListFooter}
        onEndReached={_handlePostsGet}
        onRefresh={_handleRefresh}
        extraData={isUpdate}
      />

      <WrapperComponent />
      <ProfileFollowersListModal
        followers={profileData?.followers}
        visible={followerModal}
        onClose={(val) => {
          setFollowerModal(!followerModal);
        }}
      />
      {openVideoModal ? (
        <VideoPlayerModal
          item={{ url: openVideoModal }}
          onClose={() => {
            setOpenVideoModal("");
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    marginTop: 200,
    marginHorizontal: 30,
  },
  modalStyle: {
    backgroundColor: "white",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    backgroundColor: AppColors.white.lightSky,
    paddingVertical: 10,
    zIndex: 0,
    marginBottom: normalized(160),
  },
  searchTopStyle: {
    flexDirection: "row",
    height: 60,
    marginHorizontal: 18,
    marginTop: Platform.OS == "android" ? 60 : 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    alignItems: "center",
    paddingHorizontal: 12,
  },
});

const mapStateToProps = (state) => ({
  posts: selectPosts(state),
});

const mapDispatchToProps = {
  getProfile: getProfileAction,
  refreshHomePosts: refreshHomePostsAction,
  getHomePosts: getHomePostsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

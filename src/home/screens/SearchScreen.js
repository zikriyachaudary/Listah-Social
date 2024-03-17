import React, { useEffect, useLayoutEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ReactNativeModal } from "react-native-modal";
import FastImage from "react-native-fast-image";
import { UPDATE_CHALLENGE_FEATURE } from "../../suggestion/redux/constants";
import { getPosts as selectPosts } from "../redux/selectors";
import { getProfile as getProfileAction } from "../../profile/redux/actions";
import {
  blockUsers,
  getAnnouncementPosts,
  getHomePosts as getHomePostsAction,
  getMyHomePosts,
  refreshHomePosts as refreshHomePostsAction,
} from "../redux/actions";
import { PostItem } from "../../common";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  ScreenSize,
  darkModeColors,
  hv,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import CustomHeader from "../../common/CommonHeader";
import LoadingImage from "../../common/LoadingImage";
import { setIsAppLoader } from "../../redux/action/AppLogics";
import { filterPostReq } from "../../network/Services/ProfileServices";
import VideoPlayerModal from "../../common/VideoPlayerModal";
import { Theme_Mode } from "../../util/Strings";

let allHomePosts = [];
/* =============================================================================
<search screen/>
============================================================================= */
const SearchScreen = ({ posts, getProfile }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  const [openVideoModal, setOpenVideoModal] = useState("");
  const selector = useSelector((AppState) => AppState);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [filterdPostByCat, setFilteredPostByCat] = useState([]);
  const [searchPostVisible, setSearchPostVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const [reportPostModal, setReportPostModal] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  // GET POSTS
  const [isFilterPopup, setIsFilterPopup] = useState(false);
  const [homePosts, setHomePosts] = useState([]);
  const [filtersPost, setFiltersPost] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [isUpdate, setUpdate] = useState(false);
  // const [reportText, setReportTxt] = useState("");
  useLayoutEffect(() => {
    if (isFocused) {
      setSearchPostVisible(true);
    }
  }, [isFocused]);

  useEffect(() => {
    setLoaderVisible(true);
    getMyUserHomePosts();
  }, [selector.Home.isPostRefresh]);

  const getMyUserHomePosts = async () => {
    const mAnnouncementPosts = await getAnnouncementPosts();
    const mHomePosts = await getMyHomePosts();
    allHomePosts = mHomePosts;
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
    if (selectedCat?.length > 0) {
      console.log("filterPostReq refresh----> -- > ");
      setRefreshing(true);
      await filterPostReq(selectedCat, (res) => {
        setFilteredPostByCat(res);
      });
    } else {
      setRefreshing(true);
      getMyUserHomePosts();
    }
  };

  const renderItem = ({ item, index }) => (
    <PostItem
      id={item.id}
      post={item}
      postIndex={index}
      showIndex={toggleCheckBox}
      postRefresh={() => {
        setLoaderVisible(true);
        getMyUserHomePosts();
      }}
      openVideoModal={(uri) => {
        setOpenVideoModal(uri);
      }}
      postDel={() => {
        getMyUserHomePosts();
      }}
      postReport={async (isReportCount) => {
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

  useIsFocused();

  const emptyComponent = () => {
    let noPostFound =
      selectedCat?.length > 0
        ? filterdPostByCat?.length == 0
        : filtersPost?.length == 0;
    return (
      <View style={styles.container}>
        {loaderVisible && selectedCat?.length == 0 ? (
          <ActivityIndicator size="large" color={AppColors.blue.navy} />
        ) : (
          noPostFound &&
          !selector?.sliceReducer?.isLoaderStart && (
            <Text sm center style={{ alignSelf: "center" }}>
              Nothing to show yet
            </Text>
          )
        )}
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
  return (
    <View
      style={{
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
      }}
    >
      <CustomHeader
        isStatusBar={true}
        logo={AppImages.Common.appLogo}
        mainStyle={{ backgroundColor: AppColors.blue.royalBlue }}
      />
      <View
        style={{
          ...styles.searchTopStyle,
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : lightModeColors.background,
        }}
      >
        {selectedCat ? (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              ...styles.selectedCatCont,
              backgroundColor:
                themeType == Theme_Mode.isDark
                  ? AppColors.black.shadow
                  : AppColors.white.simpleLight,
            }}
            onPress={() => {
              setSelectedCat("");
              setFilteredPostByCat([]);
            }}
          >
            <Text
              style={{
                ...styles.catName,
                color:
                  themeType == Theme_Mode.isDark
                    ? darkModeColors.text
                    : lightModeColors.text,
              }}
            >
              {selectedCat}
            </Text>
            <Image
              source={AppImages.Common.cross}
              style={{
                marginHorizontal: normalized(10),
                tintColor:
                  themeType == Theme_Mode.isDark
                    ? darkModeColors.text
                    : lightModeColors.text,
              }}
            />
          </TouchableOpacity>
        ) : (
          <TextInput
            style={{
              flex: 1,
              height: 40,
              fontSize: 16,
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
            placeholder="Search in post..."
            placeholderTextColor={"gray"}
            value={searchTxt}
            onChangeText={(txt) => {
              let usersFiltersPost = [];
              homePosts.forEach((obj) => {
                if (
                  obj.searchTxt
                    .toLowerCase()
                    .includes(String(txt).toLowerCase())
                ) {
                  usersFiltersPost.push(obj);
                }
              });
              setFiltersPost(txt == "" ? [] : usersFiltersPost);
              setSearchTxt(txt);
            }}
          />
        )}
      </View>
      {!searchTxt && !selectedCat ? (
        <>
          <Text style={{ ...styles.topTrendTxt }}>Trending Topics</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={selector?.sliceReducer?.categoriesList}
            style={{
              ...styles.list,
              backgroundColor:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.background
                  : lightModeColors.background,
              height: ScreenSize.height - normalized(300),
            }}
            keyExtractor={(index) => `${index}`}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  style={{
                    ...styles.singleCatBtn,
                    backgroundColor:
                      themeType == Theme_Mode.isDark
                        ? darkModeColors.background
                        : lightModeColors.background,
                  }}
                  onPress={async () => {
                    setSelectedCat(item?.name);
                    if (item?.name) {
                      dispatch(setIsAppLoader(true));
                      await filterPostReq(item?.name, (res) => {
                        setFilteredPostByCat(res);
                        setTimeout(() => {
                          dispatch(setIsAppLoader(false));
                        }, 2000);
                      });
                    }
                  }}
                >
                  <LoadingImage
                    source={{ uri: `${item?.icon}` }}
                    style={styles.catIcon}
                    isDisable={true}
                  />
                  <Text
                    style={{
                      ...styles.catName,
                      color:
                        themeType == Theme_Mode.isDark
                          ? darkModeColors.text
                          : lightModeColors.text,
                    }}
                  >
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </>
      ) : (
        <FlatList
          style={{
            ...styles.list,
            height: "75%",
            backgroundColor:
              themeType == Theme_Mode.isDark
                ? darkModeColors.background
                : AppColors.white.lightSky,
          }}
          showsVerticalScrollIndicator={false}
          data={selectedCat?.length > 0 ? filterdPostByCat : filtersPost}
          refreshing={refreshing}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          // contentContainerStyle={styles.content}
          ListEmptyComponent={emptyComponent}
          onEndReached={_handlePostsGet}
          onRefresh={_handleRefresh}
          extraData={isUpdate}
        />
      )}

      <WrapperComponent />
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
  },
  searchTopStyle: {
    flexDirection: "row",
    height: 60,
    marginHorizontal: 18,
    marginTop: Platform.OS == "android" ? 20 : 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  list: {
    backgroundColor: AppColors.white.lightSky,
    marginBottom: normalized(100),
    paddingHorizontal: 18,
    zIndex: 0,
  },
  singleCatBtn: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 12,
    height: normalized(40),
    width: normalized(200),
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(8),
    marginVertical: normalized(10),
    alignSelf: "center",
  },
  topTrendTxt: {
    fontSize: normalized(16),
    fontWeight: "500",
    color: AppColors.grey.dark,
    margin: AppHorizontalMargin,
  },
  catIcon: {
    width: normalized(50),
    height: normalized(40),
    borderTopLeftRadius: normalized(8),
    borderBottomLeftRadius: normalized(8),
  },
  catName: {
    marginStart: normalized(10),
    textAlign: "center",
    color: AppColors.black.black,
    fontSize: normalized(14),
    fontWeight: "400",
  },
  selectedCatCont: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.white.simpleLight,
    height: normalized(40),
    paddingHorizontal: normalized(5),
    borderRadius: normalized(5),
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);

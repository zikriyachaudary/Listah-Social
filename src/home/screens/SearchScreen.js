import React, { useEffect, useLayoutEffect } from "react";
import { connect, useSelector } from "react-redux";
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
  normalized,
} from "../../util/AppConstant";
import CustomHeader from "../../common/CommonHeader";
import { fetchCategoriesList } from "../../network/Services/ProfileServices";
import LoadingImage from "../../common/LoadingImage";

let allHomePosts = [];
/* =============================================================================
<search screen/>
============================================================================= */
const SearchScreen = ({ posts, getProfile }) => {
  const isFocused = useIsFocused();
  const [categories, setCategories] = useState([]);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [searchPostVisible, setSearchPostVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const [reportPostModal, setReportPostModal] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const selector = useSelector((AppState) => AppState);
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
      getCatList();
    }
  }, [isFocused]);

  useEffect(() => {
    setLoaderVisible(true);
    getMyUserHomePosts();
  }, [selector.Home.isPostRefresh]);
  const getCatList = () => {
    fetchCategoriesList((res) => {
      setCategories(res?.categoriesList ? res?.categoriesList : []);
    });
  };
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
    console.log("getMyUserHomePosts----- > ", mFinalList?.length);
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

  const _handleRefresh = () => {
    console.log("callinf -- > ");
    setRefreshing(true);
    getMyUserHomePosts();
    // getHomePosts();
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
    return (
      <View style={styles.container}>
        {loaderVisible ? (
          <ActivityIndicator size="large" color={AppColors.blue.navy} />
        ) : (
          homePosts.length == 0 && (
            <Text sm center>
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
    <View>
      <CustomHeader
        isStatusBar={true}
        logo={AppImages.Common.appLogo}
        mainStyle={{ backgroundColor: AppColors.blue.royalBlue }}
      />
      <View style={styles.searchTopStyle}>
        {/* {selectedCat ? (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.selectedCatCont}
            onPress={() => {
              setSelectedCat("");
            }}
          >
            <Text style={styles.catName}>{selectedCat}</Text>
            <Image
              source={AppImages.Common.cross}
              style={{ marginHorizontal: normalized(10) }}
            />
          </TouchableOpacity>
        ) : ( */}
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
          onChangeText={(txt) => {
            let usersFiltersPost = [];
            homePosts.forEach((obj) => {
              if (
                obj.searchTxt.toLowerCase().includes(String(txt).toLowerCase())
              ) {
                usersFiltersPost.push(obj);
              }
            });
            setFiltersPost(txt == "" ? [] : usersFiltersPost);
            setSearchTxt(txt);
          }}
        />
        {/* )} */}
      </View>
      {/* {!searchTxt && !selectedCat ? (
        <>
          <Text style={styles.topTrendTxt}>Trending Topics</Text>
          <FlatList
            data={categories}
            style={{ ...styles.list, backgroundColor: AppColors.white.white }}
            keyExtractor={(index) => `${index}`}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.singleCatBtn}
                  onPress={() => {
                    setSelectedCat(item?.name);
                  }}
                >
                  <LoadingImage
                    source={{ uri: `${item?.icon}` }}
                    style={styles.catIcon}
                  />
                  <Text style={styles.catName}>{item?.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </>
      ) : ( */}
      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={!searchPostVisible ? homePosts : filtersPost}
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
      {/* )} */}

      <WrapperComponent />
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
    marginBottom: normalized(170),
    paddingHorizontal: 18,
    paddingVertical: 10,
    zIndex: 0,
    height: "75%",
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

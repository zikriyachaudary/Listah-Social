import React, { useEffect, useLayoutEffect } from "react";
import { connect, useSelector } from "react-redux";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  Image,
  FlatList,
  SafeAreaView,
  TextInput,
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
import { AppColors, AppImages, normalized } from "../../util/AppConstant";
import CustomHeader from "../../common/CommonHeader";

let allHomePosts = [];
/* =============================================================================
<search screen/>
============================================================================= */
const SearchScreen = ({ posts, getProfile }) => {
  const isFocused = useIsFocused();
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

  const [isUpdate, setUpdate] = useState(false);
  const [reportText, setReportTxt] = useState("");
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
    // console.log("ggggg - > ", JSON.stringify(mFinalList));
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
            console.log("filter -- > ", usersFiltersPost?.length);
            setFiltersPost(txt.nativeEvent.text == "" ? [] : usersFiltersPost);
            setSearchTxt(txt);
          }}
        />
      </View>

      <FlatList
        style={{
          backgroundColor: AppColors.white.lightSky,
          marginBottom: normalized(170),
          paddingHorizontal: 18,
          paddingVertical: 10,
          zIndex: 0,
          height: "74%",
        }}
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);

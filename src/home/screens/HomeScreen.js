import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  AppState,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  SafeAreaView,
  TextInput,
} from "react-native";
// import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import ChevronLeftIcon from "../../assets/icons/edit-chevron-left.svg";

import { PostItem, Container, Text, Button } from "../../common";
import HomeListHeader from "../components/HomeListHeader";
import HomeListEmpty from "../components/HomeListEmpty";
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
import { RadioGroup } from "react-native-radio-buttons-group";
import CheckBox from "@react-native-community/checkbox";
import { getLoginUserNotificationCount } from "../../notification/redux/actions";
import { UPDATE_CHALLENGE_FEATURE } from "../../suggestion/redux/constants";
import FastImage from "react-native-fast-image";
import {
  AppColors,
  AppImages,
  normalized,
  topicsDummyData,
} from "../../util/AppConstant";
import CustomHeader from "../../common/CommonHeader";
import TopicsComp from "../components/TopicsComp";

let reportPostItem = null;
/* =============================================================================
<HomeScreen />
============================================================================= */
let allHomePosts = [];
let lastSelectedId = "1";
const HomeScreen = ({ posts, getHomePosts, refreshHomePosts, getProfile }) => {
  const isFocused = useIsFocused();
  const [loaderVisible, setLoaderVisible] = useState(true);

  const [searchPostVisible, setSearchPostVisible] = useState(false);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const [radioButtons, setRadioButtons] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Ascending List",
      value: "ascendinglist",
      borderColor: "#6d14c4",
      selected: true,
    },
    {
      id: "2",
      label: "Descending List",
      value: "descendinglist",
      borderColor: "#6d14c4",
    },
  ]);
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

  useEffect(() => {
    // setIsFilterPopup(true);
    setLoaderVisible(true);
    getMyUserHomePosts();
    // getHomePosts();
    getProfile();
  }, [selector.Home.updateHomeData]);

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

    // applyFilterOnList(allHomePosts)
    // setTimeout(() => {
    //   setLoaderVisible(false)
    // }, 500)
  };

  // const applyFilterOnList = (mHomePosts) => {
  //   const filterArray = radioButtons.filter((item) => item.selected)
  //   setHomePosts([])
  //   setTimeout(() => {
  //     if (filterArray.length > 0) {
  //       // console.log("filterId - > ", filterArray[0].id, allHomePosts[0])
  //       if (filterArray[0].id == "1") {
  //         setHomePosts(mHomePosts.reverse())
  //       } else {
  //         setHomePosts(mHomePosts.reverse())
  //       }
  //     } else {
  //       setHomePosts(mHomePosts)
  //     }
  //     setLoaderVisible(false)
  //     setRefreshing(false)

  //   },400)

  // }

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

  const ReportPostModal = () => {
    return (
      <Modal
        isVisible={reportPostModal}
        deviceWidth={Dimensions.get("window").width}
        deviceHeight={Dimensions.get("window").height}
        onRequestClose={() => {
          console.log("called11");
          setReportTxt("");
          setReportPostModal(false);
        }}
        // onBackdropPress={() =>{
        //   setReportTxt("")
        //   setReportPostModal(false)
        // }}
        backdropOpacity={0.2}
      >
        <View style={styles.modalStyle}>
          <View
            style={{
              margin: 30,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "black",
              }}
            >
              Reason for reporting this post?
            </Text>

            <View
              style={{
                borderColor: "gray",
                borderWidth: 1,
                width: "100%",
                marginVertical: 20,
                borderRadius: 5,
              }}
            >
              <TextInput
                style={{
                  padding: 20,
                  fontSize: 16,
                }}
                placeholder={"Please add reason..."}
                onChangeText={(text) => {
                  setReportTxt(text);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  useIsFocused();

  const emptyComponent = () => {
    return (
      <View style={styles.container}>
        {loaderVisible ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          homePosts.length == 0 && (
            <Text sm center>
              Nothing to show yet
            </Text>
          )

          // homePosts.length == 0 && <Text sm center>You don't have any followers. follow people to see there posts</Text>
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
          // onLoadStart={() => setLoading(true)}
          // onLoadEnd={() => setLoading(false)}
          // onError={() => {
          //   setLoading(false);
          //   if (props.placeHolder) {
          //     setSource(props.placeHolder);
          //   }
          // }}
          source={require("../../assets/images/edit-app-logo.jpeg")}
          // <UploadIcon />
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
        />
      )}

      <TopicsComp topicsList={topicsDummyData} />
      <FlatList
        style={{
          backgroundColor: AppColors.white.lightSky,
          marginBottom: normalized(150),
          paddingHorizontal: 18,
          paddingVertical: normalized(10),
          zIndex: 0,
          // height: "90%",
        }}
        showsVerticalScrollIndicator={false}
        data={!searchPostVisible ? homePosts : filtersPost}
        refreshing={refreshing}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        // contentContainerStyle={styles.content}
        ListHeaderComponent={() => {
          return !searchPostVisible ? (
            <HomeListHeader
              postRefresh={() => {
                getMyUserHomePosts();
              }}
              filterClick={() => {
                const filterArray = radioButtons.filter(
                  (item) => item.selected
                );
                if (filterArray.length > 0) lastSelectedId = filterArray[0].id;
                setIsFilterPopup(!isFilterPopup);
              }}
              listSize={homePosts.length}
              searchClicked={() => {
                navigation.navigate("Profile");
              }}
            />
          ) : null;
        }}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={ListFooter}
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

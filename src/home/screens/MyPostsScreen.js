import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { PostItem, Container, StackHeader, Button } from "../../common";
import { getMyPosts } from "../redux/selectors";
import { blockUsers, getPostsByID, getProfileDataByID } from "../redux/actions";
import { getProfile } from "../../profile/redux/selectors";
import * as Colors from "../../config/colors";
import Text from "../../common/Text";
import LoadingImage from "../../common/LoadingImage";
import { getUserFollowings as selectUserFollowings } from "../../following/redux/selectors";
import ProfileFollowersListModal from "../components/HomeHeaderProfileInfo/ProfileFollowersListModal";
import { updateHomeData } from "../redux/appLogics";
import {
  unFollowUser as unFollowUserAction,
  followUser as followUserAction,
} from "../../following/redux/actions";
import { AppStrings, Notification_Types, Theme_Mode } from "../../util/Strings";
import useNotificationManger from "../../hooks/useNotificationManger";
import {
  AppColors,
  AppImages,
  darkModeColors,
  normalized,
} from "../../util/AppConstant";
import FastImage from "react-native-fast-image";
import { Routes } from "../../util/Route";
import ThreadManager from "../../ChatModule/ThreadManger";
import { makeObjForInitialChat } from "../../util/helperFun";
import { setIsAlertShow, setIsAppLoader } from "../../redux/action/AppLogics";
import VideoPlayerModal from "../../common/VideoPlayerModal";

// import View from '../../common/View';
// import Avatar from '../../common/Avatar';
// import Touchable from '../../common/Touchable';

/* =============================================================================
<MyPostsScreen />

============================================================================= */
const MyPostsScreen = ({ profile, route, unFollowUser, followUser }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [openVideoModal, setOpenVideoModal] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const navigation = useNavigation();
  const [userProfileImage, setUsersProfileImage] = useState();
  const [userProfileInfo, setUsersProfileInfo] = useState();
  const { followNUnFollowUser } = useNotificationManger();
  const [isFollowUser, setFollowUser] = useState(false);
  const [followersModal, setFollowersModal] = useState(false);
  const [followersOrFollowingList, setFollowersOrFollowingList] = useState([]);
  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState);

  const _toggleFollowersModal = () => setFollowersModal((prev) => !prev);

  // GET POSTS
  useEffect(() => {
    if (isFocused && route?.params?.userId) {
      getPostsByUserId();
      // getHomePosts();
      fetchUsersData();
      setLoaderVisible(true);
    }
  }, [isFocused]);
  const fetchUsersData = async () => {
    const mUsersData = await getProfileDataByID(route.params.userId);
    if (mUsersData?.profileImage) {
      setUsersProfileImage(mUsersData.profileImage);
    }
    setUsersProfileInfo(mUsersData);
    const isFollowed = mUsersData.followers?.find(
      (user) => user === profile.userId
    );
    setFollowUser(isFollowed);
  };
  const getPostsByUserId = async () => {
    const totalPosts = await getPostsByID(route?.params?.userId);
    setUserPosts(totalPosts);
    setLoaderVisible(false);
    // dispatch(startLoader(false));
  };
  const _handlePostsGet = () => {
    if (userPosts) {
      // getPostsByUserId()
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <PostItem
        id={item.id}
        post={item}
        postDel={() => {
          getPostsByUserId();
          route.params.refreshCall();
        }}
        openVideoModal={(uri) => {
          setOpenVideoModal(uri);
        }}
        postReport={async (isReportCount) => {
          if (isReportCount == 2) {
            await blockUsers(item.author.userId);
            navigation.goBack();
          } else {
            reportPostItem = item;
            // setReportPostModal(true)
            navigation.navigate("ReportPost", {
              post: item,
              isReportCount: isReportCount,
            });
          }
        }}
      />
    );
  };

  const _handleFollowPress = async () => {
    setLoading(true);
    await followNUnFollowUser({
      actionType: Notification_Types.follow,
      reciverId: route.params.userId,
    });
    await followUser(route.params.userId, (res) => {
      if (res?.status) {
        setFollowUser(!isFollowUser);
      }
    });
    dispatch(updateHomeData(!selector.Home.updateHomeData));
    await fetchUsersData();
    setLoading(false);
  };

  const _handleUnFollowPress = async () => {
    // if (isFollowed) {
    setLoading(true);
    await followNUnFollowUser({
      actionType: Notification_Types.unFollow,
      reciverId: route.params.userId,
    });
    await unFollowUser(route.params.userId, (res) => {
      if (res?.status) {
        setFollowUser(!isFollowUser);
      }
    });
    dispatch(updateHomeData(!selector.Home.updateHomeData));

    await fetchUsersData();
    setLoading(false);
  };
  const goToChat = async () => {
    let threadObj = null;
    ThreadManager.instance.checkIsConnectionExist(
      profile?.userId,
      userProfileInfo?.userId,
      (threadData) => {
        threadObj = threadData;
      }
    );
    if (threadObj) {
      navigation.navigate(Routes.Chat.chatScreen, {
        thread: threadObj,
        from: "MyPosts",
      });
    } else {
      let senderObj = {};
      let reciverObj = {};
      senderObj = makeObjForInitialChat(profile);
      reciverObj = makeObjForInitialChat(userProfileInfo);

      if (!reciverObj?.id) {
        dispatch(
          setIsAlertShow({
            value: true,
            message: AppStrings.Network.somethingWrong,
          })
        );
        return;
      }
      ThreadManager.instance.setupRedux(selector?.sliceReducer, dispatch);
      dispatch(setIsAppLoader(true));
      let msg = "";
      let docId = ThreadManager.instance.makeid(7);
      await ThreadManager.instance.onSendCall(
        senderObj,
        reciverObj,
        docId,
        msg,
        async (data) => {
          dispatch(setIsAppLoader(false));
          if (data != "error") {
            navigation.navigate(Routes.Chat.chatScreen, {
              thread: data,
              from: "MyPosts",
            });
          } else {
            alert(JSON.stringify(data));
          }
        }
      );
    }
  };
  return (
    <Container
      style={{
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : AppColors.white.simpleLight,
      }}
    >
      {profile?.userId !== route?.params?.userId && userProfileInfo?.userId ? (
        <StackHeader
          title={
            route.params.userId == profile.userId
              ? "My Posts"
              : route.params.username + " Posts"
          }
          right={
            <Image
              source={AppImages.Chat.chatStartIcon}
              style={{
                height: normalized(35),
                width: normalized(35),
                marginTop: normalized(-15),
                resizeMode: "center",
              }}
            />
          }
          onRightPress={() => {
            goToChat();
          }}
        />
      ) : (
        <StackHeader
          title={
            route.params.userId == profile.userId
              ? "My Posts"
              : route.params.username + " Posts"
          }
        />
      )}

      {!loaderVisible && userProfileImage && (
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 15,
            marginVertical: 10,
          }}
        >
          <View style={{ width: userProfileInfo?.verified ? 76 : 70 }}>
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
            {userProfileInfo && userProfileInfo?.verified ? (
              <FastImage
                style={{
                  width: normalized(35),
                  height: normalized(35),
                  position: "absolute",
                  bottom: normalized(-5),
                  marginStart: normalized(45),
                  borderRadius: normalized(35 / 2),
                }}
                source={
                  themeType === Theme_Mode.isDark
                    ? AppImages.Common.aPlusIconDark
                    : AppImages.Common.aPlusIcon
                }
              />
            ) : null}
          </View>
          <View
            style={{
              flex: 1,
              marginStart: 30,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <View style={styles.topPostsContainer}>
                <Text
                  style={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? AppColors.white.white
                        : AppColors.black.black,
                    fontSize: 11,
                  }}
                  bold
                >
                  Post
                </Text>

                <Text
                  style={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? AppColors.white.white
                        : AppColors.black.black,
                    fontSize: 10,
                    marginTop: 3,
                  }}
                  bold
                >
                  {userPosts.length}
                </Text>
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  setFollowersOrFollowingList(userProfileInfo.followers);
                  setTimeout(() => {
                    _toggleFollowersModal();
                  }, 100);
                }}
              >
                <View style={styles.topPostsContainer}>
                  <Text
                    style={{
                      color:
                        themeType == Theme_Mode.isDark
                          ? AppColors.white.white
                          : AppColors.black.black,
                      fontSize: 11,
                    }}
                    bold
                  >
                    Followers
                  </Text>
                  <Text
                    style={{
                      color:
                        themeType == Theme_Mode.isDark
                          ? AppColors.white.white
                          : AppColors.black.black,
                      fontSize: 10,
                      marginTop: 3,
                    }}
                    bold
                  >
                    {userProfileInfo.followers.length}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              <>
                <TouchableWithoutFeedback
                  onPress={() => {
                    setFollowersOrFollowingList(userProfileInfo.followings);
                    setTimeout(() => {
                      _toggleFollowersModal();
                    }, 100);
                  }}
                >
                  <View style={styles.topPostsContainer}>
                    <Text
                      style={{
                        color:
                          themeType == Theme_Mode.isDark
                            ? AppColors.white.white
                            : AppColors.black.black,
                        fontSize: 11,
                      }}
                      bold
                    >
                      Following
                    </Text>
                    <Text
                      style={{
                        color:
                          themeType == Theme_Mode.isDark
                            ? AppColors.white.white
                            : AppColors.black.black,
                        fontSize: 10,
                        marginTop: 3,
                      }}
                      bold
                    >
                      {userProfileInfo.followings.length}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </>
            </View>

            {profile?.userId !== route.params.userId && (
              <Button
                title={isFollowUser ? "Unfollow" : "Follow"}
                style={styles.btn}
                loading={loading}
                btnTxtStyles={styles.btnTxtStyles}
                onPress={
                  isFollowUser ? _handleUnFollowPress : _handleFollowPress
                }
              />
            )}
          </View>
        </View>
      )}

      {loaderVisible ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        userPosts.length == 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text sm center>
              You don't have posts
            </Text>
          </View>
        )
      )}
      {userPosts.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={userPosts}
          refreshing={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            return item?.id;
          }}
          contentContainerStyle={styles.content}
          onEndReached={_handlePostsGet}
        />
      )}

      <ProfileFollowersListModal
        followers={followersOrFollowingList}
        visible={followersModal}
        onClose={_toggleFollowersModal}
      />
      {openVideoModal ? (
        <VideoPlayerModal
          item={{ url: openVideoModal }}
          onClose={() => {
            setOpenVideoModal("");
          }}
        />
      ) : null}
    </Container>
  );
};

const renderKeyExtractor = (item) => `${item}`;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
  },
  container: {
    height: "100%",
    marginTop: 200,
    marginHorizontal: 30,
  },
  topPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    // width: 120,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: Colors.primary,
    marginTop: 5,
    height: normalized(40),
  },
  btnTxtStyles: {
    fontSize: 12,
  },
  itemContainer: {
    maxHeight: 500,
    marginVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 6,
    paddingTop: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },

  header: {
    justifyContent: "space-between",
  },
  userInfoContainer: {
    marginLeft: 15,
  },
  menuBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

const mapStateToProps = (state) => ({
  posts: getMyPosts(state),
  profile: getProfile(state),
  userFollowings: selectUserFollowings(state),
});

const mapDispatchToProps = {
  unFollowUser: unFollowUserAction,
  followUser: followUserAction,
};
export default connect(mapStateToProps, mapDispatchToProps)(MyPostsScreen);

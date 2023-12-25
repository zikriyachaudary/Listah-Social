import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { PostItem, Container, StackHeader, Button } from "../../common";
import MyPostsListEmpty from "../components/MyPostsListEmpty";

import { getMyPosts } from "../redux/selectors";
import {
  blockUsers,
  getHomePosts,
  getPostsByID,
  getProfileDataByID,
  refreshHomePosts,
} from "../redux/actions";
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
import { Notification_Types } from "../../util/Strings";
import useNotificationManger from "../../hooks/useNotificationManger";
import { AppColors, normalized } from "../../util/AppConstant";

// import View from '../../common/View';
// import Avatar from '../../common/Avatar';
// import Touchable from '../../common/Touchable';

/* =============================================================================
<MyPostsScreen />

============================================================================= */
const MyPostsScreen = ({ profile, route, unFollowUser, followUser }) => {
  const [loading, setLoading] = useState(false);

  const isFocused = useIsFocused();
  const [userPosts, setUserPosts] = useState([]);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const navigation = useNavigation();
  const [userProfileImage, setUsersProfileImage] = useState();
  const [userProfileInfo, setUsersProfileInfo] = useState();
  const { followNUnFollowUser } = useNotificationManger();
  const [isFollowUser, setFollowUser] = useState();
  const [followersModal, setFollowersModal] = useState(false);
  const [followersOrFollowingList, setFollowersOrFollowingList] = useState([]);
  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState);

  const _toggleFollowersModal = () => setFollowersModal((prev) => !prev);

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
  // GET POSTS
  useEffect(() => {
    if (isFocused && route?.params?.userId) {
      getPostsByUserId();
      // getHomePosts();
      fetchUsersData();
      setLoaderVisible(true);
    }
  }, [isFocused]);

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
    await followUser(route.params.userId);
    dispatch(updateHomeData(!selector.Home.updateHomeData));
    setFollowUser(!isFollowUser);
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
    await unFollowUser(route.params.userId);
    dispatch(updateHomeData(!selector.Home.updateHomeData));
    setFollowUser(!isFollowUser);
    await fetchUsersData();
    setLoading(false);
  };

  return (
    <Container>
      <StackHeader
        title={
          route.params.userId == profile.userId
            ? "My Posts"
            : route.params.username + " Posts"
        }
      />

      {!loaderVisible && userProfileImage && (
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 15,
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
                borderColor: AppColors.blue.royalBlue,
              }}
            />
            {userProfileInfo && userProfileInfo?.verified ? (
              <Text
                style={{
                  position: "absolute",
                  bottom: 0,
                  marginStart: 50,
                  fontFamily: "Poppins-Bold",
                  fontSize: normalized(12),
                  color: Colors.primary,
                  width: Dimensions.get("screen").width - 200,
                }}
              >
                {`(A+)`}
              </Text>
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
                <Text style={{ color: "black", fontSize: 11 }} bold>
                  Post
                </Text>

                <Text
                  style={{ color: "black", fontSize: 10, marginTop: 3 }}
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
                  <Text style={{ color: "black", fontSize: 11 }} bold>
                    Followers
                  </Text>
                  <Text
                    style={{ color: "black", fontSize: 10, marginTop: 3 }}
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
                    <Text style={{ color: "black", fontSize: 11 }} bold>
                      Following
                    </Text>
                    <Text
                      style={{ color: "black", fontSize: 10, marginTop: 3 }}
                      bold
                    >
                      {userProfileInfo.followings.length}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </>
            </View>

            {profile.userId !== route.params.userId && (
              // <View
              //   style={{
              //     height: 40,
              //     flex: 1,
              //     marginHorizontal: 20,
              //     backgroundColor: Colors.primary,
              //     marginTop: 5,
              //     borderRadius: 20,
              //     justifyContent: "center",
              //     alignItems: "center",
              //   }}
              // >
              //   <Text style={{ color: "white", fontSize: 14 }} bold>
              //     {isFollowed ? "Unfollow" : "Follow"}
              //   </Text>
              // </View>
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
    marginHorizontal: 20,
    backgroundColor: Colors.primary,
    marginTop: 5,
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

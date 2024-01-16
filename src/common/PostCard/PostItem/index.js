import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from "react-native";

// import Text from "../../Text";
import View from "../../View";
import PostActions from "./PostActions";
import PostItemHeader from "./PostItemHeader";
import Card from "../../Card";
import LikeUserModal from "./LikeUserModal";
import * as Colors from "../../../config/colors";
import PostInnerItems from "./PostInnerItems";

import LikeInActiveIcon from "../../../assets/icons/edit-like-icon.svg";
import LikeActiveIcon from "../../../assets/icons/edit-like-icon-active.svg";
import { getProfile } from "../../../profile/redux/selectors";
import Touchable from "../../Touchable";
import { challengePostLikeUnlike } from "../../../home/redux/actions";
import { CHALLENGE_REQUEST } from "../../../suggestion/redux/constants";
import { AppColors, AppImages, normalized } from "../../../util/AppConstant";
import moment from "moment";
import ThreadManager from "../../../ChatModule/ThreadManger";
/* =============================================================================
<PostItem />
============================================================================= */

const PostItem = ({
  id,
  post,
  postDel,
  postRefresh,
  postReport,
  showIndex,
  postIndex,
  profile,
}) => {
  const postItems =
    post.order && post.order == "1" ? post?.items : post?.items.reverse();

  const challengePostItems = post.challenge
    ? post.challenge.order == "1"
      ? post.challenge.items
      : post.challenge.items.reverse()
    : [];
  const B = (props) => (
    <Text style={{ fontWeight: "bold", fontSize: 18 }}>{props.children}</Text>
  );
  const [showLikeUserModal, setLikeUserModalVisible] = useState(false);
  const [challengeItems, setChallengeItems] = useState(
    post.challenge && post.challenge.items
      ? post.challenge.items.length > 3
        ? post.challenge.items.slice(0, 3)
        : post.challenge.items
      : []
  );
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [challengeLikeLoading, setChallengeLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(
    post?.likeOne ? post?.likeOne : 0
  );

  const [challengeLikesCount, setChallengeLikesCount] = useState(
    post?.challenge && post?.challenge.likes ? post?.challenge.likes : 0
  );

  const [liked, setLiked] = useState();
  const [challengeLiked, setChallengeLiked] = useState();

  const _handlePostReact = async (isCallenge) => {
    if (isCallenge) {
      setChallengeLoading(true);
      await challengePostLikeUnlike(post?.id, isCallenge);
      postRefresh();
      if (challengeLiked) {
        setChallengeLikesCount(challengeLikesCount - 1);
        setChallengeLiked(false);
      } else {
        setChallengeLikesCount(challengeLikesCount + 1);
        setChallengeLiked(true);
      }

      setChallengeLoading(false);
    } else {
      setLoading(true);
      await challengePostLikeUnlike(post?.id, isCallenge);
      postRefresh();
      if (liked) {
        setLikesCount(likesCount - 1);
        setLiked(false);
      } else {
        setLikesCount(likesCount + 1);
        setLiked(true);
      }

      setLoading(false);
    }
  };

  const formatTime = (timeObject) => {
    // Combine seconds and nanoseconds to create a Unix timestamp
    const timestamp = timeObject.seconds + timeObject.nanoseconds / 1e9;

    // Convert the timestamp to a moment object
    const momentObj = moment.unix(timestamp);

    // Format the moment object as a string
    const formattedString = momentObj.format("YYYY-MM-DD HH:mm:ss.SSS Z");

    return formattedString;
  };
  useEffect(() => {
    if (post?.likeOneUsers) {
      const isLiked =
        post.likeOneUsers.filter((id) => id == profile?.userId).length > 0
          ? true
          : false;
      setLiked(isLiked);
    }
    if (post?.createdAt?.seconds && post?.createdAt?.nanoseconds) {
      let dateTime = moment(
        moment(
          formatTime(post?.createdAt),
          ThreadManager.instance.dateFormater.fullDate
        )
      );
      const endDate = moment();
      const diffInDays = endDate.diff(dateTime, "days");
      if (diffInDays < 7) {
        setTime(moment(dateTime).fromNow());
      } else {
        const dateNTime = moment(dateTime).format("DD MMM YYYY");
        setTime(dateNTime);
      }
    }
    if (post.challenge && post.challenge.likedUsers) {
      const isChallengeLiked =
        post.challenge.likedUsers.filter((id) => id == profile?.userId).length >
          0
          ? true
          : false;
      setChallengeLiked(isChallengeLiked);
    }
  }, []);
  if (!post) {
    return (
      <Card style={styles.container}>
        <PostItemHeader />
        <Text center>Post no longer available</Text>
      </Card>
    );
  }
  return (
    <ScrollView
      nestedScrollEnabled
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <PostItemHeader
        id={id}
        post={post}
        postIndex={postIndex}
        showIndex={showIndex}
        postDeleted={() => {
          if (postDel) {
            postDel();
          }
        }}
        postRefresh={() => {
          if (postRefresh) {
            postRefresh();
          }
        }}
        postReport={(isReportCount) => {
          postReport(isReportCount);
        }}
      />
      <PostInnerItems post={post} userPosts={postItems} />

      {post?.challenge &&
        post?.challengeRequest == CHALLENGE_REQUEST.ACCEPT && (
          <View>
            <Touchable
              horizontal
              style={{ ...styles.btn }}
              onPress={() => {
                _handlePostReact(false);
              }}
            >
              {loading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : liked ? (
                <LikeActiveIcon />
              ) : (
                <LikeInActiveIcon />
              )}
              <TouchableWithoutFeedback
                onPress={() => {
                  // likeUserOpenClicked()
                }}
              >
                <Text
                  style={[
                    liked ? styles.btnActiveTxt : styles.btnTxt,
                    { paddingHorizontal: 10 },
                  ]}
                >
                  {likesCount}
                </Text>
              </TouchableWithoutFeedback>
            </Touchable>
            <Image
              style={{
                width: 60,
                height: 60,
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: 10,
                aspectRatio: 1,
              }}
              source={AppImages.Common.versus_icon}
            />
            <PostItemHeader
              id={id}
              post={post}
              postIndex={postIndex}
              showIndex={showIndex}
              postDeleted={() => {
                if (postDel) {
                  postDel();
                }
              }}
              postRefresh={() => {
                if (postRefresh) {
                  postRefresh();
                }
              }}
              postReport={(isReportCount) => {
                postReport(isReportCount);
              }}
              isChallenge={true}
            />
            <PostInnerItems post={post} userPosts={challengePostItems} />

            <Touchable
              horizontal
              style={{ ...styles.btn }}
              onPress={() => {
                _handlePostReact(true);
              }}
            >
              {challengeLikeLoading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : challengeLiked ? (
                <LikeActiveIcon />
              ) : (
                <LikeInActiveIcon />
              )}
              <TouchableWithoutFeedback
                onPress={() => {
                  // likeUserOpenClicked()
                }}
              >
                <Text
                  style={[
                    challengeLiked ? styles.btnActiveTxt : styles.btnTxt,
                    { paddingHorizontal: 10 },
                  ]}
                >
                  {challengeLikesCount}
                </Text>
              </TouchableWithoutFeedback>
            </Touchable>
          </View>
        )}

      {post?.description && (
        <Text style={{ marginTop: 10, fontSize: 16, color: "black" }}>
          <B>
            {post?.announcement
              ? "A-Listah"
              : post?.author?.username
                ? post?.author?.username
                : ""}
          </B>{" "}
          {post.description}.
        </Text>
      )}

      {!post?.announcement && (
        <PostActions
          id={id}
          post={post}
          postRefresh={() => {
            if (postRefresh) {
              console.log("triggerr -- > ", postRefresh);
              postRefresh();
            }
          }}
          likeUserOpenClicked={() => {
            console.log("printPost -- > ", post);
            setLikeUserModalVisible((prev) => true);
          }}
        />
      )}
      {time ? (
        <Text
          style={{
            fontSize: normalized(14),
            color: AppColors.grey.dark,
            marginBottom: normalized(10),
          }}
        >
          {time}
        </Text>
      ) : null}

      {showLikeUserModal && (
        <LikeUserModal
          visible={showLikeUserModal}
          onClose={() => setLikeUserModalVisible(false)}
          likedUsers={post.likedUsers}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 5800,
    marginVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 6,
    paddingTop: 5,
    backgroundColor: AppColors.white.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: "#999",
    justifyContent: "space-between",
  },
  indexCounter: {
    width: 30,
    height: 30,
    marginRight: 12,
    borderWidth: 2,
    paddingTop: 2,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  imgContainer: {
    marginRight: 5,
  },
  userInfoContainer: {
    marginLeft: 15,
  },
  descriptionTxt: {
    flex: 0.5,
  },
  menuBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  btn: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: "center",
  },
  btnTxt: {
    marginTop: 5,
    marginLeft: 5,
  },
  btnActiveTxt: {
    marginLeft: 5,
    marginTop: 5,
    color: Colors.primary,
  },
});
const mapStateToProps = (state) => ({
  profile: getProfile(state),
});
// const mapStateToProps = (state, { id }) => ({
//   post: getPostsById(state, { id })
// });

// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) =>
  prevProps.id === nextProps.id &&
  JSON.stringify(prevProps.post?.items) ===
  JSON.stringify(nextProps?.post?.items);

/* Export
============================================================================= */
export default connect(mapStateToProps)(React.memo(PostItem, propsAreEqual));

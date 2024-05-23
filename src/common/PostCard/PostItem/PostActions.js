import { connect, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import FireAuth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { useToast } from "react-native-toast-notifications";
import FireStore from "@react-native-firebase/firestore";

import {
  ActivityIndicator,
  Alert,
  Platform,
  Share,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import dynamicLinks from "@react-native-firebase/dynamic-links";

import Text from "../../Text";
import View from "../../View";
import Touchable from "../../Touchable";
import PostItemCommentModal from "./PostItemCommentModal/index";
import LikeInActiveIcon from "../../../assets/icons/edit-like-icon.svg";
import LikeActiveIcon from "../../../assets/icons/edit-like-icon-active.svg";
import CommentIcon from "../../../assets/icons/edit-comment-icon.svg";
import SuggestionImg from "../../../assets/images/edit-suggestion-button.jpeg";
import DarkSuggestionImg from "../../../assets/images/edit-suggestion-button_dark.png";
import ShareIcon from "../../../assets/icons/edit-share-icon.svg";
import * as Colors from "../../../config/colors";

import { getProfile } from "../../../profile/redux/selectors";
import { getPostsById } from "../../../home/redux/selectors";
import {
  likePost as likePostAction,
  dislikePost as dislikePostAction,
  likeUnlikeUserPosts,
} from "../../../home/redux/actions";
import { CHALLENGE_REQUEST } from "../../../suggestion/redux/constants";
import { Notification_Types, Theme_Mode } from "../../../util/Strings";
import useNotificationManger from "../../../hooks/useNotificationManger";
import ThreadManager from "../../../ChatModule/ThreadManger";
import moment from "moment";
import { normalized } from "../../../util/AppConstant";

/* =============================================================================
<PostActions />
============================================================================= */
const PostActions = ({
  id,
  post,
  profile,
  postRefresh,
  likeUserOpenClicked,
}) => {
  const selector = useSelector((AppState) => AppState);
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const toast = useToast();
  const { likeNUnLikePost } = useNotificationManger();
  const navigation = useNavigation();
  const [likesCount, setLikesCount] = useState(post?.likes);
  const authorId = post?.author?.userId;
  const [commentsCount, setCommentsCount] = useState(post?.comments?.length);
  const [liked, setLiked] = useState();
  const [loading, setLoading] = useState(false);
  const [commentModal, setCommentModal] = useState(false);

  useEffect(() => {
    setLoading(false);
    const isLiked =
      post.likedUsers.filter((id) => id == profile.userId).length > 0
        ? true
        : false;
    setLiked(isLiked);
  }, []);

  const _handlePostReact = async () => {
    setLoading(true);
    await likeUnlikeUserPosts(post?.id?.toString(), async (response) => {
      if (response?.status && authorId != selector?.Auth?.user?.uid) {
        await likeNUnLikePost({
          actionType: liked
            ? Notification_Types.unlike
            : Notification_Types?.like,
          reciverId: post?.author?.userId,
          extraData: { postId: post?.id },
        });
      }
    });

    postRefresh();
    if (liked) {
      setLikesCount(likesCount - 1);
      setLiked(false);
    } else {
      setLikesCount(likesCount + 1);
      setLiked(true);
    }

    setLoading(false);
  };

  const _toggleCommentModal = (count = 0) => {
    setCommentsCount(count);
    setCommentModal((prevState) => !prevState);
  };

  const _handleSharePress = async () => {
    try {
      const link = await dynamicLinks().buildLink({
        link:
          Platform.OS == "ios"
            ? "https://apps.apple.com/pk/app/listah-your-social-list/id6444810525"
            : "https://play.google.com/store/apps/details?id=com.listaapp",
        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: "https://listaapp.page.link",
        // optional setup which updates Firebase analytics campaign
        // "banner". This also needs setting up before hand
      });
      console.log("linksssss - > ", link);
      await Share.share({
        message: link,
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const _handleSuggestionPress = () => {
    if (FireAuth().currentUser.uid === authorId) {
      toast.show("Post Author can't suggest");
    } else {
      navigation.navigate("SuggestionStack", {
        screen: "SelectSuggestion",
        params: { id, type: "home", post: post },
      });
    }
  };

  const challengeAcceptReject = () => {
    navigation.navigate("AcceptRejectChallenge", { post: post });
  };

  return (
    <View horizontal style={styles.btnContainer}>
      <View horizontal>
        <Touchable
          horizontal
          style={{ ...styles.btn }}
          onPress={_handlePostReact}
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
              likeUserOpenClicked();
            }}
          >
            <Text
              style={[
                liked ? styles.btnActiveTxt : styles.btnTxt,
                { paddingEnd: 10 },
              ]}
            >
              {likesCount}
            </Text>
          </TouchableWithoutFeedback>
        </Touchable>
        <Touchable
          horizontal
          style={{ ...styles.btn }}
          onPress={() => {
            _toggleCommentModal(commentsCount);
          }}
        >
          <CommentIcon />
          <Text style={styles.btnTxt}>{commentsCount}</Text>
        </Touchable>
        <Touchable
          horizontal
          style={{ ...styles.btn }}
          onPress={_handleSharePress}
        >
          <ShareIcon />
        </Touchable>
        {post.challenge &&
        post.challengeRequest !== CHALLENGE_REQUEST.REJECT ? null : (
          <Touchable
            horizontal
            style={{ ...styles.btn }}
            onPress={_handleSuggestionPress}
          >
            <FastImage
              style={{
                ...styles.suggestionBtnImg,
                height: 30,
                width: 30,
                borderRadius: normalized(
                  themeType == Theme_Mode.isDark ? 40 / 2 : 0
                ),
              }}
              resizeMode="cover"
              source={
                themeType == Theme_Mode.isDark
                  ? DarkSuggestionImg
                  : SuggestionImg
              }
            />
          </Touchable>
        )}

        {post.challenge &&
          post.challengeRequest == CHALLENGE_REQUEST.REQUEST &&
          FireAuth().currentUser.uid === authorId && (
            <Touchable
              horizontal
              style={{ ...styles.btn }}
              onPress={challengeAcceptReject}
            >
              <FastImage
                style={{ ...styles.suggestionBtnImg, width: 22, height: 22 }}
                source={require("../../../assets/images/challenge_request_icon.png")}
              />
            </Touchable>
          )}
      </View>

      {commentModal && (
        <PostItemCommentModal
          id={id}
          post={post}
          visible={commentModal}
          onClose={_toggleCommentModal}
          postRefresh={postRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    height: 65,
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
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
  suggestionBtnImg: {
    width: 30,
    height: 30,
  },
});

const mapStateToProps = (state, { id }) => ({
  mpost: getPostsById(state, { id }),
  profile: getProfile(state),
});

const mapDispatchToProps = {
  likePost: likePostAction,
  dislikePost: dislikePostAction,
};

// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) =>
  prevProps.id === nextProps.id &&
  prevProps.post?.likes === nextProps?.post?.likes &&
  prevProps.post?.comments?.length === nextProps?.post?.comments?.length &&
  prevProps.profile?.likedPosts.toString() ===
    nextProps?.profile?.likedPosts.toString();

/* Export
============================================================================= */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(PostActions, propsAreEqual));

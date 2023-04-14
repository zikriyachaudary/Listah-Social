import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import FireAuth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'
import { useToast } from "react-native-toast-notifications";
import { ActivityIndicator, Alert, Image, Share, StyleSheet } from 'react-native';

import Text from '../../Text';
import View from '../../View';
import Touchable from '../../Touchable';
import PostDiscoveryCommentModal from './PostDiscoveryCommentModal/index';
import LikeInActiveIcon from '../../../assets/icons/edit-like-icon.svg';
import LikeActiveIcon from '../../../assets/icons/edit-like-icon-active.svg';
import CommentIcon from '../../../assets/icons/edit-comment-icon.svg';
import SuggestionImg from '../../../assets/images/edit-suggestion-button.jpeg';
import ShareIcon from '../../../assets/icons/edit-share-icon.svg';
import * as Colors from '../../../config/colors';

import { getProfile } from '../../../profile/redux/selectors';
import { getPostsById } from '../../../discover/redux/selectors';
import {
  likePost as likePostAction,
  dislikePost as dislikePostAction,
} from '../../../home/redux/actions';

/* =============================================================================
<PostDiscoveryActions />
============================================================================= */
const PostDiscoveryActions = ({
  id,
  post,
  profile,
  likePost,
  dislikePost,
}) => {
  const toast = useToast();
  const navigation = useNavigation();
  const likesCount = post?.likes;
  const likedPosts = profile?.likedPosts;
  const authorId = post?.author?.userId;
  const commentsCount = post?.comments?.length;
  const [liked, setLiked] = useState();
  const [loading, setLoading] = useState(false);
  const [commentModal, setCommentModal] = useState(false);

  useEffect(() => {
    setLiked(likedPosts?.find((_id) => {
      if (_id === id) {
        return true
      }
      return false
    }))
  }, [likedPosts?.length])

  const _handlePostReact = async () => {
    setLoading(true);
    if (!liked) {
      await likePost(post?.id);
    } else {
      await dislikePost(post?.id);
    }
    setLoading(false);
  };

  const _toggleCommentModal = () => setCommentModal((prevState) => !prevState);

  const _handleSharePress = async () => {
    try {
      await Share.share({
        message: `https://list_app/posts/${id}`,
      });
    } catch (e) {
      Alert.alert(e.message);
    }
  };

  const _handleSuggestionPress = () => {
    if (FireAuth().currentUser.uid === authorId) {
      toast.show("Post Author can't suggest")
    } else {
      navigation.navigate('SuggestionStack', {
        screen: 'SelectSuggestion',
        params: { id, type: 'discovery' }
      });
    }
  };

  return (
    <View horizontal style={styles.btnContainer}>
      <View horizontal>
        <Touchable horizontal style={styles.btn} onPress={_handlePostReact}>
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : liked ? (
            <LikeActiveIcon />
          ) : <LikeInActiveIcon />}
          <Text style={[liked ? styles.btnActiveTxt : styles.btnTxt]}>{likesCount}</Text>
        </Touchable>
        <Touchable horizontal style={styles.btn} onPress={_toggleCommentModal}>
          <CommentIcon />
          <Text style={styles.btnTxt}>{commentsCount}</Text>
        </Touchable>
        <Touchable horizontal style={styles.btn} onPress={_handleSharePress}>
          <ShareIcon />
        </Touchable>
      </View>
      <Touchable horizontal style={styles.btn} onPress={_handleSuggestionPress}>
        <FastImage style={styles.suggestionBtnImg} source={SuggestionImg} />
      </Touchable>
      <PostDiscoveryCommentModal
        id={id}
        visible={commentModal}
        onClose={_toggleCommentModal}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  btnContainer: {
    height: 65,
    justifyContent: 'space-between',
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  post: getPostsById(state, { id }),
  profile: getProfile(state),
});

const mapDispatchToProps = {
  likePost: likePostAction,
  dislikePost: dislikePostAction,
};

// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) => prevProps.id === nextProps.id
  && prevProps.post?.likes === nextProps?.post?.likes
  && prevProps.post?.comments?.length === nextProps?.post?.comments?.length
  && prevProps.profile?.likedPosts.toString() === nextProps?.profile?.likedPosts.toString()

/* Export
============================================================================= */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(PostDiscoveryActions, propsAreEqual));


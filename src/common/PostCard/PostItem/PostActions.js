import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import FireAuth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import FastImage from 'react-native-fast-image'
import { useToast } from "react-native-toast-notifications";
import { ActivityIndicator, Alert, Image, Platform, Share, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import FireStore from '@react-native-firebase/firestore';
import dynamicLinks from '@react-native-firebase/dynamic-links';


import Text from '../../Text';
import View from '../../View';
import Touchable from '../../Touchable';
import PostItemCommentModal from './PostItemCommentModal/index';
import LikeInActiveIcon from '../../../assets/icons/edit-like-icon.svg';
import LikeActiveIcon from '../../../assets/icons/edit-like-icon-active.svg';
import CommentIcon from '../../../assets/icons/edit-comment-icon.svg';
import SuggestionImg from '../../../assets/images/edit-suggestion-button.jpeg';
import ShareIcon from '../../../assets/icons/edit-share-icon.svg';
import * as Colors from '../../../config/colors';

import { getProfile } from '../../../profile/redux/selectors';
import { getPostsById } from '../../../home/redux/selectors';
import {
  likePost as likePostAction,
  dislikePost as dislikePostAction,
  likeUnlikeUserPosts,
} from '../../../home/redux/actions';

/* =============================================================================
<PostActions />
============================================================================= */
const PostActions = ({
  id,
  post,
  profile,
  likePost,
  dislikePost,
  postRefresh,
  likeUserOpenClicked
}) => {
  const toast = useToast();
  const navigation = useNavigation();
  const [likesCount, setLikesCount] = useState(post?.likes);
  const likedPosts = profile?.likedPosts;
  const authorId = post?.author?.userId;
  const commentsCount = post?.comments?.length;
  const [liked, setLiked] = useState();
  const [loading, setLoading] = useState(false);
  const [commentModal, setCommentModal] = useState(false);

  useEffect(() => {
    setLoading(false);
    const isLiked = post.likedUsers.filter((id) => id == profile.userId).length > 0 ? true : false
    setLiked(isLiked)
  }, [])
  // useEffect(() => {
  //   setLiked(likedPosts?.find((_id) => {
  //     if (_id === id) {
  //       return true
  //     }
  //     return false
  //   }))
  // }, [likedPosts?.length])

  const _handlePostReact = async () => {
    setLoading(true);


    await likeUnlikeUserPosts(post?.id)
    // if (!liked) {
    //   await likePost(post?.id);
    // } else {
    //   await dislikePost(post?.id);
    // }
    postRefresh()
    if (liked) {
      setLikesCount(likesCount - 1)
      setLiked(false)
    }else{
      setLikesCount(likesCount + 1)
      setLiked(true)

    }
    
    setLoading(false);

  };

  const _toggleCommentModal = () => setCommentModal((prevState) => !prevState);

  const _handleSharePress = async () => {
    try {

      const link = await dynamicLinks().buildLink({
        link: Platform.OS == "ios" ? "https://apps.apple.com/pk/app/listah-your-social-list/id6444810525" : 'https://play.google.com/store/apps/details?id=com.listaapp',
        // domainUriPrefix is created in your Firebase console
        domainUriPrefix: 'https://listaapp.page.link',
        // optional setup which updates Firebase analytics campaign
        // "banner". This also needs setting up before hand
      
      });
      console.log("linksssss - > " , link)
      await Share.share({
        message: link,
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
        params: { id, type: 'home', post: post }
      });
    }
  };

  return (
    <View horizontal style={styles.btnContainer}>
      <View horizontal>
        <Touchable horizontal style={{...styles.btn}} onPress={_handlePostReact}>
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : liked ? (
            <LikeActiveIcon />
          ) : <LikeInActiveIcon />}
          <TouchableWithoutFeedback
            onPress={() => {
              likeUserOpenClicked()
            }}
          >
            <Text style={[liked ? styles.btnActiveTxt : styles.btnTxt, { paddingHorizontal: 10 }]}>{likesCount}</Text>
          </TouchableWithoutFeedback>
        </Touchable>
        <Touchable horizontal style={{...styles.btn}} onPress={_toggleCommentModal}>
          <CommentIcon />
          <Text style={styles.btnTxt}>{commentsCount}</Text>
        </Touchable>
        <Touchable horizontal style={{...styles.btn}} onPress={_handleSharePress}>
          <ShareIcon />
        </Touchable>
        <Touchable horizontal style={{...styles.btn}} onPress={_handleSuggestionPress}>
        <FastImage style={styles.suggestionBtnImg} source={SuggestionImg} />
      </Touchable>
      </View>
    

      {
        commentModal && (
          <PostItemCommentModal
            id={id}
            post={post}
            visible={commentModal}
            onClose={_toggleCommentModal}
            postRefresh={postRefresh}
          />
        )
      }

    </View>
  )
};

const styles = StyleSheet.create({
  btnContainer: {
    height: 65,
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
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
  mpost: getPostsById(state, { id }),
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
)(React.memo(PostActions, propsAreEqual));


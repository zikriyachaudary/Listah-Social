import React from 'react';
import { connect } from 'react-redux';
import { Image, StyleSheet } from 'react-native';

import Text from '../../Text';
import View from '../../View';
import Avatar from '../../Avatar';
import FireImg from '../../../assets/images/fire.gif';

import { getPostsById } from '../../../discover/redux/selectors';
import { deletePost as deletePostAction } from '../../../home/redux/actions';

/* =============================================================================
<PostDiscoveryItemHeader />
============================================================================= */
const PostDiscoveryItemHeader = ({ post }) => {
  const title = post?.title;
  const likesCount = post?.likes;
  const username = post?.author?.username;
  const profileImage = post?.author?.profileImage;

  return (
    <View horizontal style={styles.header}>
      <View horizontal>
        <Avatar size={63} url={{ uri: `${profileImage}` }} />
        <View style={styles.userInfoContainer}>
          <Text lg bold>{title}</Text>
          <Text>{username}</Text>
        </View>
      </View>
      {likesCount >= 10 && (
        <Image style={styles.fireImg} source={FireImg} />
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    marginLeft: 15,
  },
  fireImg: {
    width: 65,
    height: 65,
  }
});

const mapStateToProps = (state, { id }) => ({
  post: getPostsById(state, { id })
});

const mapDispatchToProps = {
  deletePost: deletePostAction,
};

// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) => prevProps.id === nextProps.id
  && prevProps.post?.title === nextProps.post?.title
  && prevProps.post?.likes === nextProps.post?.likes
  && prevProps.post?.author?.username === nextProps.post?.author?.username
  && prevProps.post?.author?.profileImage === nextProps.post?.author?.profileImage;

/* Export
============================================================================= */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(PostDiscoveryItemHeader, propsAreEqual));


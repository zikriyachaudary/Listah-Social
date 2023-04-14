import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TouchableOpacity, Text, Dimensions, Modal } from 'react-native';
import FireAuth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Menu, MenuItem } from 'react-native-material-menu';

// import Text from '../../Text';
import View from '../../View';
import Avatar from '../../Avatar';
import Touchable from '../../Touchable';
import MenuIcon from '../../../assets/icons/edit-menu-icon.svg';

import { getPostsById } from '../../../home/redux/selectors';
import { deletePost as deletePostAction } from '../../../home/redux/actions';

/* =============================================================================
<PostItemHeader />
============================================================================= */
const PostItemHeader = ({ id, deletePost, post, postDeleted, postRefresh, postReport, postIndex, showIndex }) => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const title = post?.title;
  const username = post?.author?.username;
  const authorId = post?.author?.userId;
  const profileImage = post?.author?.profileImage;
  const isAuthor = authorId === FireAuth().currentUser.uid;


  useEffect(() => {
    // console.log("ppppp - > ", post)
  }, [])
  const _toggleMenu = () => setVisible((prev) => !prev);

  const _handleEditPress = () => {
    navigation.navigate('PostEdit', { id, post: post, postRefresh: postRefresh })
    _toggleMenu();
  };

  const _handleDeletePress = async () => {
    await deletePost(id);
    postDeleted()

  };

  const reportPost = (isReportCount) => {
    setVisible(false)
    postReport(isReportCount)
  }

  const blockUser = () => {
    // console.log("blockUserPost -- > ", post)
    setVisible(false)
    postReport(2)

  }


  return (
    <View horizontal style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          console.log("clicked11 - > ", postRefresh)
          navigation.navigate('MyPosts', { userId: post.author.userId, username: username, refreshCall: postRefresh });

        }}
      >
        <View horizontal>
          {
            showIndex && (
              <View style={styles.indexCounter}>
                <Text sm bold>{postIndex === 0 ? 1 : postIndex + 1}</Text>
              </View>
            )
          }
          <Avatar size={68} url={{ uri: `${profileImage}` }} />
          <View style={styles.userInfoContainer}>
            <Text style={{
              fontFamily: 'Poppins-Bold',
              fontSize: 16,
              width: Dimensions.get("screen").width - 200,
            }}
              numberOfLines={2}
            >{title}</Text>
            <Text>{username}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Menu
        visible={visible}
        onRequestClose={_toggleMenu}
        anchor={
          <Touchable style={styles.menuBtn} onPress={_toggleMenu}>
            <MenuIcon />
          </Touchable>
        }
      >
        <>
          {isAuthor ? (
            <>
              <MenuItem onPress={_handleEditPress}>Edit</MenuItem>
              <MenuItem onPress={_handleDeletePress}>Delete</MenuItem>
            </>
          ) :
            <>
              <MenuItem onPress={blockUser}>Block User</MenuItem>
              <MenuItem onPress={() => reportPost(0)}>Report Post</MenuItem>
              <MenuItem onPress={() => reportPost(1)}>Report User</MenuItem>
            </>

          }
        </>
      </Menu>

    </View>
  )
};

const styles = StyleSheet.create({
  indexCounter: {
    width: 12,
    height: 20,
    marginRight: 12,
    // borderWidth: 2,
    paddingTop: 2,
    // borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    marginLeft: 15,
  },
  menuBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

const mapStateToProps = (state, { id }) => ({
  mpost: getPostsById(state, { id })
});

const mapDispatchToProps = {
  deletePost: deletePostAction,
};

// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) => prevProps.id === nextProps.id
  && prevProps.post?.title === nextProps.post?.title
  && prevProps.post?.author?.userId === nextProps.post?.author?.userId
  && prevProps.post?.author?.username === nextProps.post?.author?.username
  && prevProps.post?.author?.profileImage === nextProps.post?.author?.profileImage;

/* Export
============================================================================= */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(PostItemHeader, propsAreEqual));


import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { StyleSheet, TouchableOpacity } from 'react-native';

import Text from '../../Text';
import View from '../../View';
import Avatar from '../../Avatar';
import PostActions from './PostActions';
import PostItemHeader from './PostItemHeader';

import { getPostsById } from '../../../home/redux/selectors';
import Card from '../../Card';
import LikeUserModal from './LikeUserModal';
import * as Colors from '../../../config/colors';
import PostInnerItems from './PostInnerItems';

/* =============================================================================
<PostItem />
============================================================================= */

const PostItem = ({ id, post, postDel, postRefresh, postReport, showIndex, postIndex }) => {
  const postItems = post.order && post.order == "1" ? post?.items : post?.items.reverse();
  const B = (props) => <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{props.children}</Text>
  const [showLikeUserModal, setLikeUserModalVisible] = useState(false)

  const [showMore, setShowMore] = useState(false)

  if (!post) {
    return (
      <Card style={styles.container}>
        <PostItemHeader />
        <Text center>Post no longer available</Text>
      </Card>
    )
  };

  return (
    <ScrollView nestedScrollEnabled style={styles.container}>
      <PostItemHeader
        id={id}
        post={post}
        postIndex={postIndex}
        showIndex={showIndex}
        postDeleted={() => {
          if (postDel) {
            postDel()
          }
        }}
        postRefresh={() => {
          if (postRefresh) {
            postRefresh()
          }
        }}
        postReport={(isReportCount) => {
          postReport(isReportCount)
        }}
      />
      <PostInnerItems
        post={post}
        userPosts={postItems}
      />
      {/* {postItems?.length >= 0 && postItems?.map((item, index) => (
        <View horizontal style={styles.item} key={index}>
          {
            post.isNumberShowInItems && (
              <View style={styles.indexCounter}>
                <Text sm bold>{post.order && post.order == "1" ? index === 0 ? 1 : index + 1 : postItems?.length - index}</Text>
              </View>
            )
          }

          {
            item.image && (
              <View style={styles.imgContainer}>
                <Avatar style={{ borderRadius: 2 }} size={66} url={{ uri: `${item.image}` }} />
              </View>
            )
          }

          <Text flex center sm medium>{item.name || '--'}</Text>
          <Text center xs light style={styles.descriptionTxt} >{item.description || '--'}</Text>
        </View>
      ))} */}
      
      {
        post.description && (
          <Text style={{ marginTop: 10, fontSize: 16 }}><B>{post.author.username}</B> {post.description}.</Text>
        )
      }
      <PostActions
        id={id}
        post={post}
        postRefresh={() => {
          if (postRefresh) {
            console.log("triggerr -- > ", postRefresh)
            postRefresh()
          }
        }}
        likeUserOpenClicked={() => {
          console.log("printPost -- > ", post)
          setLikeUserModalVisible((prev) => true)
        }}
      />

      {
        showLikeUserModal && (
          <LikeUserModal
            visible={showLikeUserModal}
            onClose={() => setLikeUserModalVisible(false)}
            likedUsers={post.likedUsers}
          />
        )
      }

    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 500,
    marginVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 6,
    paddingTop: 5,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  item: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    justifyContent: 'space-between',
  },
  indexCounter: {
    width: 30,
    height: 30,
    marginRight: 12,
    borderWidth: 2,
    paddingTop: 2,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
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
});

// const mapStateToProps = (state, { id }) => ({
//   post: getPostsById(state, { id })
// });

// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) => prevProps.id === nextProps.id
  && JSON.stringify(prevProps.post?.items) === JSON.stringify(nextProps?.post?.items);

/* Export
============================================================================= */
export default connect()(React.memo(PostItem, propsAreEqual));


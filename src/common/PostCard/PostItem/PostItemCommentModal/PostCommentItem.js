import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet } from 'react-native';

import View from '../../../View';
import Text from '../../../Text';
import Avatar from '../../../Avatar';

import { getProfileById } from '../../../../profile/redux/selectors';
import Touchable from '../../../Touchable';
import * as Colors from '../../../../config/colors';
import LikeInActiveIcon from '../../../../assets/icons/edit-like-icon.svg';
import LikeActiveIcon from '../../../../assets/icons/edit-like-icon-active.svg';
import EditIcon from '../../../../assets/icons/edit-icon.svg';
import DeleteIcon from '../../../../assets/icons/delete-ic.svg';
import ReplyIcon from "../../../../assets/icons/reply-icon.svg"
import FireAuth from '@react-native-firebase/auth';
import { deletePostComment, likeUnlikePostComments } from '../../../../home/redux/actions';
import { updateHomeData } from '../../../../home/redux/appLogics';
import SubCommentItem, { ShowMoreSubCommentView } from './SubCommentItem';

/* =============================================================================
 PostCommentItem />
============================================================================= */
let isEditDeleteOrLike = false
const PostCommentItem = ({ key, comment, commentID, postID, text, profile, author, likedUsers, postRefresh, postAutor, onClose, onEditComment, deleteComment, onReplyComment }) => {
  const [user, setUser] = useState();
  const username = user?.username;
  const profileImage = user?.profileImage;
  const [likedUserList, setLikedUserList] = useState([])
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAndEditIcon, setShowEditIcon] = useState(false)
  const dispatch = useDispatch()
  const [showSubCommentDisplay, setSubCommentDisplay] = useState(false)
  const selector = useSelector((AppState) => AppState)


  useEffect(() => {
    const currentUser = FireAuth().currentUser.uid;
    console.log("postAutor - >  ", postAutor.userId, "commentAutor - > ", author, "currentUser - > ", currentUser)
    setShowEditIcon(author == currentUser ? true : false)

    if (profile) {
      profile.then((res) => {
        setUser(res)
      });
    }
    if (likedUsers && likedUsers.length > 0) {
      setLikedUserList(likedUsers)
      const isLiked = likedUsers.filter((id) => id == currentUser).length > 0 ? true : false
      setLiked(isLiked)
    }

    return () => {
      console.log("commentModalDisappear")
      if (isEditDeleteOrLike) {
        dispatch(updateHomeData(!selector.Home.updateHomeData))
      }
    }
  }, [])

  if (!user) {
    return null
  }

  const _likeUnLikePostComments = async () => {
    setLoading(true)
    setLiked((prev) => !prev)

    await likeUnlikePostComments(postID, commentID)
    // postRefresh()
    const currentUser = FireAuth().currentUser.uid;
    const isLiked = likedUserList.filter((id) => id == currentUser)
    console.log("islikedUser - > ", isLiked)
    if (isLiked.length > 0) {
      let removeUserFromLikedList = likedUserList.filter((item) => item != currentUser)
      setLikedUserList(removeUserFromLikedList)
    } else {
      let addUserInLikedList = [...likedUserList, currentUser]
      console.log("addUserLike - > ", addUserInLikedList)
      setLikedUserList(addUserInLikedList)
    }

    isEditDeleteOrLike = true
    setTimeout(() => {
      // onClose()
      setLoading(false)
    }, 600)

  }

  const _deleteComment = async () => {
    Alert.alert(
      '',
      'Are you sure you want to delete this comment?',
      [
        { text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'Yes', onPress: async () => {
            await deletePostComment(postID, commentID)
            isEditDeleteOrLike = false
            console.log("delete -- > ")
            deleteComment()
            // postRefresh()
            // setTimeout(() => {
            //   onClose()
            // }, 600)
          }
        },
      ],
      { cancelable: false }
    )

  }

  const renderItem = (item, index) => {
    return (
      <View style={{
        flexDirection: "row",
        marginHorizontal: 40,

      }}>

        <View style={{
          flex: 1,
          width: 0.6,
          backgroundColor: "gray"
        }} />

        <View style={{
          width: "100%",
          margin: 30
        }}></View>

      </View>
    )
  }

  return (
    <Touchable>
      <View>
        <View style={styles.container}>
          <View horizontal>
            <Avatar size={45} url={{ uri: `${profileImage}` }} />
            <View flex style={styles.txtContainer}>
              <Text sm>{username}</Text>
              <Text medium>{text}</Text>
            </View>

          </View>
          <View horizontal style={{ justifyContent: "center", alignItems: "center", alignSelf: "center" }}>
            <Touchable horizontal style={styles.btn} onPress={() => {
              _likeUnLikePostComments()
            }}>
              {loading ? (
                <ActivityIndicator color={Colors.primary} />
              ) : liked ? (
                <LikeActiveIcon />
              ) : <LikeInActiveIcon />}
              <Text style={[liked ? styles.btnActiveTxt : styles.btnTxt, { paddingHorizontal: 10 }]}>{likedUserList.length}</Text>
            </Touchable>
            {
              showAndEditIcon && (
                <>
                  <Touchable horizontal style={styles.btn} onPress={() => {
                    console.log("clickkkk")
                    onEditComment()
                  }} >
                    <EditIcon
                      width={20}
                      height={20}
                      stroke={"#999"}
                    />
                  </Touchable>

                  <Touchable horizontal style={styles.btn} onPress={() => {
                    _deleteComment()
                  }} >
                    <DeleteIcon
                      width={24}
                      height={24}
                      fill={"#999"}
                    />
                  </Touchable>


                </>
              )
            }

            <Touchable horizontal style={styles.btn} onPress={() => {
              // _deleteComment()
              onReplyComment()
            }} >
              <Image
                style={{
                  width: 24,
                  height: 24
                }}
                source={require("../../../../assets/images/reply-ic.png")}
              />
            </Touchable>

          </View>
        </View>

        {
          comment.subCommentList.length > 0 && !showSubCommentDisplay ?

            <ShowMoreSubCommentView
              onClick={() => {
                setSubCommentDisplay(!showSubCommentDisplay)
              }}
            />

            :
            <FlatList
              data={comment.subCommentList ? comment.subCommentList : []}
              keyExtractor={(item, index) => {
                return item.id;
              }}
              renderItem={({ item, index }) => {
                console.log("printItem - > ", item)
                return (
                  <SubCommentItem
                    item={item}
                    index={index}
                    author={item?.author}
                  />
                )
              }}

            />
        }

      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    backgroundColor: '#f1f1f1'
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
  txtContainer: {
    marginLeft: 10,
  }
});

const mapStateToProps = (state, { author }) => ({
  profile: getProfileById(state, { id: author })
});
// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) => prevProps.text === nextProps.text
  && prevProps.author === nextProps.author
  && prevProps.profile.toString() === nextProps.profile.toString();

/* Export
============================================================================= */
export default connect(mapStateToProps)(React.memo(PostCommentItem, propsAreEqual));

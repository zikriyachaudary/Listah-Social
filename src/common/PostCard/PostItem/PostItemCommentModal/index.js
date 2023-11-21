import React, { useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import FireAuth from "@react-native-firebase/auth";
import {
  StyleSheet,
  FlatList,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import Card from "../../../Card";
import Text from "../../../Text";
import View from "../../../View";
import Touchable from "../../../Touchable";
import TextInput from "../../../TextInput";
import PostCommentItem from "./PostCommentItem";
import ChevronLeftIcon from "../../../../assets/icons/edit-chevron-left.svg";
import EditCloseIcon from "../../../../assets/icons/edit-close-icon.svg";

import { getPostsById } from "../../../../home/redux/selectors";
import {
  addReplyInComment,
  editCommentOfMine,
  getPostInfoById,
  postComment as postCommentAction,
} from "../../../../home/redux/actions";
import { updateHomeData } from "../../../../home/redux/appLogics";
import { useEffect } from "react";
import { Notification_Types } from "../../../../util/Strings";
import useNotificationManger from "../../../../hooks/useNotificationManger";

/* =============================================================================
 PostItemCommentModal />
============================================================================= */
let isEditComment = null;
let isAddComment = false;
const PostItemCommentModal = ({
  post,
  visible,
  onClose,
  postComment,
  postRefresh,
}) => {
  const { commentPostNoti } = useNotificationManger();
  const [comments, setComments] = useState([]);
  const [isEmptyVisible, setIsEmptyVisible] = useState(false);
  const [text, setText] = useState("");
  const [isEditViewEnable, setEditViewEnable] = useState(null);
  const [replyViewEnable, setReplyViewEnable] = useState(null);
  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState);
  const [shouldDismissKeyboard, setShouldDismissKeyboard] = useState(true);
  const flatListRef = useRef(null);

  useEffect(() => {
    return () => {
      if (isAddComment) {
        dispatch(updateHomeData(!selector.Home.updateHomeData));
      }
    };
  }, []);
  const _handleComment = async () => {
    try {
      if (text) {
        if (isEditViewEnable) {
          if (isEditViewEnable.text) {
            const editComment = isEditViewEnable;
            editComment.text = text;
            editCommentOfMine(editComment, post?.id);
            setEditViewEnable(null);
            isAddComment = true;
          }
        } else if (replyViewEnable) {
          if (replyViewEnable.text) {
            const replyComment = replyViewEnable;
            let subCommentList = replyComment.subCommentList
              ? replyComment.subCommentList
              : [];
            const payload = {
              text,
              id: Date.now(),
              postId: post?.id,
              author: FireAuth().currentUser.uid,
              // subCommentList: [],
              // likedUsers: []
            };
            subCommentList.push(payload);
            replyComment.subCommentList = subCommentList;
            addReplyInComment(replyComment, post?.id);
            setReplyViewEnable(null);
            dispatch(updateHomeData(!selector.Home.updateHomeData));

            isAddComment = true;
          }
        } else {
          const payload = {
            text,
            id: Date.now(),
            postId: post?.id,
            author: FireAuth().currentUser.uid,
            subCommentList: [],
            likedUsers: [],
          };

          await postComment(payload, async (response) => {
            if (
              response?.status &&
              post?.author?.userId != selector?.Auth?.user?.uid
            ) {
              await commentPostNoti({
                actionType: Notification_Types.comment,
                reciverId: post?.author?.userId,
                extraData: { postId: post?.id },
              });
            }
          });

          // postRefresh()
          isAddComment = true;
          console.log("refresCall");
          // setComments((prevState) => [...prevState, payload]);
          const myPostInfo = await getPostInfoById(post.id);
          if (myPostInfo.comments && myPostInfo.comments.length > 0) {
            setIsEmptyVisible(false);
            setComments(myPostInfo.comments);

            setTimeout(() => {
              if (flatListRef && flatListRef.current) {
                flatListRef.current.scrollToEnd();
              }
            }, 900);
          } else {
            setIsEmptyVisible(true);
          }
        }
      }
    } catch (e) {
      Alert.alert("Something went wrong please try later");
    }
    setText("");
  };

  const renderListEmptyComponent = () => (
    <View center style={styles.emptyListContainer}>
      <Text>No Comments Yet</Text>
    </View>
  );
  const renderItem = ({ item }) => (
    <PostCommentItem
      key={item.id}
      comment={item}
      commentID={item.id}
      text={item?.text}
      author={item?.author}
      postID={post.id}
      postAutor={post.author}
      likedUsers={item?.likedUsers}
      onClose={() => {
        onClose(comments.length);
      }}
      postRefresh={postRefresh}
      onEditComment={() => {
        console.log(item);
        isEditComment = item;
        setReplyViewEnable(null);
        setEditViewEnable(item);
        setText(item?.text);
      }}
      deleteComment={async () => {
        isAddComment = true;
        // let filterComment = comments.filter((mitem) => mitem.id !== item.id);
        // setComments(() => filterComment);
        const myPostInfo = await getPostInfoById(post.id);
        if (myPostInfo.comments && myPostInfo.comments.length > 0) {
          setIsEmptyVisible(false);
          setComments(myPostInfo.comments);
        } else {
          setIsEmptyVisible(true);
        }
      }}
      onLikeClicked={async () => {
        const myPostInfo = await getPostInfoById(post.id);
        if (myPostInfo.comments && myPostInfo.comments.length > 0) {
          setIsEmptyVisible(false);
          setComments(myPostInfo.comments);
        } else {
          setIsEmptyVisible(true);
        }
      }}
      onReplyComment={() => {
        setEditViewEnable(null);
        setReplyViewEnable(item);
        setText("");
      }}
    />
  );

  return (
    <SafeAreaView>
      <Modal
        isVisible={visible}
        style={styles.modal}
        // swipeDirection={"down"}
        onModalShow={async () => {
          const myPostInfo = await getPostInfoById(post.id);
          if (myPostInfo.comments && myPostInfo.comments.length > 0) {
            setIsEmptyVisible(false);
            setComments(myPostInfo.comments);
            setTimeout(() => {
              if (flatListRef && flatListRef.current) {
                flatListRef.current.scrollToEnd();
              }
            }, 800);
          } else {
            setIsEmptyVisible(true);
          }
        }}
        onModalHide={() => {
          console.log("hidecalll");
        }}
        onSwipeComplete={() => {
          onClose(comments.length);
        }}
        onBackButtonPress={() => {
          onClose(comments.length);
        }}
        onBackdropPress={() => {
          onClose(comments.length);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={60}
        >
          <View style={styles.card}>
            <SafeAreaView />
            <View style={styles.header}>
              <Touchable
                style={styles.headerBackBtn}
                onPress={() => {
                  onClose(comments.length);
                }}
              >
                <ChevronLeftIcon />
              </Touchable>
              <View
                style={{
                  width: 60,
                  height: 6,
                  backgroundColor: "gray",
                  alignSelf: "center",
                  borderRadius: 3,
                  marginTop: 19,
                  marginBottom: 30,
                }}
              />
            </View>
            <FlatList
              ref={flatListRef}
              refreshing={false}
              data={comments}
              renderItem={renderItem}
              keyboardShouldPersistTaps={"always"}
              keyExtractor={renderKeyExtractor}
              ListEmptyComponent={
                isEmptyVisible ? renderListEmptyComponent : null
              }
              contentContainerStyle={styles.contentContainer}
            />

            {isEditViewEnable && (
              <View
                style={{
                  width: "100%",
                  height: 30,
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    color: "gray",
                    fontSize: 14,
                  }}
                >
                  {replyViewEnable && replyViewEnable?.text
                    ? replyViewEnable?.text
                    : "Edit a comment " + isEditViewEnable?.text}
                </Text>
                <Touchable
                  onPress={() => {
                    setEditViewEnable(null);
                    setText("");
                  }}
                >
                  <EditCloseIcon width={20} height={20} stroke={"#999"} />
                </Touchable>
              </View>
            )}

            {replyViewEnable && (
              <View
                style={{
                  width: "100%",
                  height: 30,
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 10,
                  backgroundColor: "white",
                }}
              >
                <Text
                  style={{
                    color: "gray",
                    fontSize: 14,
                  }}
                >
                  {replyViewEnable ? replyViewEnable?.text : ""}
                </Text>
                <Touchable
                  onPress={() => {
                    setReplyViewEnable(null);
                    setText("");
                  }}
                >
                  <EditCloseIcon width={20} height={20} stroke={"#999"} />
                </Touchable>
              </View>
            )}

            <TextInput
              value={text}
              onChange={setText}
              containerStyle={styles.inputContainer}
              // autoFocus={"true"}
              placeholder="Type a comment..."
              onFocus={() => setShouldDismissKeyboard(false)}
              onBlur={() => setShouldDismissKeyboard(true)}
              onSubmitEditing={_handleComment}
            />
            <SafeAreaView />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const renderKeyExtractor = (item) => `${item.id}`;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    marginTop: 60,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    backgroundColor: "white",
    justifyContent: "flex-end",
  },
  card: {
    zIndex: 5,
    height: "100%",
    borderWidth: 1,
    borderColor: "#999",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    width: "100%",
  },
  headerBackBtn: {
    width: 50,
    height: 50,
    padding: 20,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    height: "100%",
  },
  inputContainer: {
    marginTop: 0,
  },
});

const mapStateToProps = (state, { id }) => ({
  mpost: getPostsById(state, { id }),
});

const mapDispatchToProps = {
  postComment: postCommentAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostItemCommentModal);

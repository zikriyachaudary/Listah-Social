import { Alert } from "react-native";
import * as constants from "./constants";
import FireStore from "@react-native-firebase/firestore";
import { setProfile } from "../../profile/redux/actions";
import { updatePost } from "../../home/redux/actions";
import { deleteNotification } from "../../notification/redux/actions";

const PostsCollection = FireStore().collection("posts");
const ProfileCollection = FireStore().collection("profiles");

/**
 * POST_SUGGEST
 */
export const suggestPost = (suggestion, cb) => async (dispatch) => {
  try {
    dispatch({ type: constants.POST_SUGGEST.REQUEST });
    const suggestionId = Date.now();
    const authorProfile = await (
      await ProfileCollection.doc(suggestion?.authorId).get()
    ).data();
    console.log("authorProfile------->", authorProfile);

    await ProfileCollection.doc(suggestion?.authorId).update({
      notifications: [
        {
          id: suggestionId,
          ...suggestion,
        },
        ...authorProfile?.notifications,
      ],
    });

    const updatedAuthorProfile = await (
      await ProfileCollection.doc(suggestion?.authorId).get()
    ).data();

    dispatch(setProfile(updatedAuthorProfile));
    dispatch({ type: constants.POST_SUGGEST.SUCCESS });

    if (cb) {
      cb();
    }
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.POST_SUGGEST.FAIL, error });
  } finally {
    dispatch({ type: constants.POST_SUGGEST.COMPLETE });
  }
};

/**
 * APPROVE_SUGGESTION
 */
export const suggestApprove = (suggestion, cb) => async (dispatch) => {
  try {
    dispatch({ type: constants.APPROVE_SUGGESTION.REQUEST });
    const { change, authorId, postId } = suggestion;
    const suggestionPost = await (
      await PostsCollection.doc(postId).get()
    ).data();

    if (change?.type === "change") {
      const from = change?.from;
      const to = change?.to;

      dispatch(
        updatePost({
          author: {
            userId: authorId,
          },
          id: postId,
          items: suggestionPost.items.map((item) => {
            if (item?.id === from?.id) {
              return {
                ...to,
                id: from?.id,
              };
            } else {
              return item;
            }
          }),
        })
      );
    }

    if (change?.type == "add") {
      dispatch(
        updatePost({
          author: {
            userId: authorId,
          },
          id: postId,
          items: [
            ...suggestionPost.items,
            {
              id: suggestionPost?.items.length + 1,
              ...change?.item,
            },
          ],
        })
      );
    }

    if (change?.type === "delete") {
      dispatch(
        updatePost({
          author: {
            userId: authorId,
          },
          id: postId,
          items: suggestionPost?.items.filter(
            (item) => item?.id !== change?.item?.id
          ),
        })
      );
    }

    dispatch(deleteNotification(suggestion));

    dispatch({ type: constants.APPROVE_SUGGESTION.SUCCESS });

    if (cb) {
      cb();
    }
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.APPROVE_SUGGESTION.FAIL, error });
  } finally {
    dispatch({ type: constants.APPROVE_SUGGESTION.COMPLETE });
  }
};

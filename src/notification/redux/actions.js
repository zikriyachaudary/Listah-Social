import FireStore from "@react-native-firebase/firestore";
import FireAuth from "@react-native-firebase/auth";
import * as constants from "./constants";
import { setNotificationData } from "../../home/redux/appLogics";
import { Collections } from "../../util/Strings";

const ProfilesCollection = FireStore().collection("profiles");
const NotificationsCollection = FireStore().collection(
  Collections.NOTIFICATION
);

export const getLoginUserNotificationCount = async (dispatch) => {
  console.log("enter");
  const currentUser = FireAuth().currentUser.uid;
  const currentUserProfile = await (
    await ProfilesCollection.doc(currentUser).get()
  ).data();

  const notifications = currentUserProfile.notifications
    ? currentUserProfile.notifications
    : [];
  const populatedNotification = await Promise.all(
    notifications.map(async (notification) => {
      const sender = await (
        await ProfilesCollection.doc(notification?.sender).get()
      ).data();
      return {
        ...notification,
        sender: {
          userId: sender?.userId,
          username: sender?.username,
          profileImage: sender?.profileImage,
        },
      };
    })
  );
  const unreadCount = populatedNotification.filter(
    (item) => item.unread
  ).length;
  dispatch(setNotificationData(unreadCount));
  console.log("popularNootificationList - > ", unreadCount);
};
/**
 * GET_NOTIFICATIONS
 */
export const getNotifications = (notificationCount) => async (dispatch) => {
  try {
    dispatch({ type: constants.GET_NOTIFICATIONS.REQUEST });
    const currentUser = FireAuth().currentUser.uid;

    const currentUserProfile = await (
      await ProfilesCollection.doc(currentUser).get()
    ).data();

    const notifications = currentUserProfile?.notifications
      ? currentUserProfile.notifications
      : [];

    // POPULATE SENDER
    const populatedNotification = await Promise.all(
      notifications.map(async (notification) => {
        const sender = await (
          await ProfilesCollection.doc(notification?.sender).get()
        ).data();
        return {
          ...notification,
          sender: {
            userId: sender?.userId,
            username: sender?.username,
            profileImage: sender?.profileImage,
          },
        };
      })
    );

    if (notificationCount > 0) {
      const filterNot = notifications.map((item) => {
        const obj = {
          ...item,
          unread: false,
        };
        return obj;
      });
      updateUnread(currentUser, filterNot);
      console.log("showPopularNot ", notifications);

      dispatch(setNotificationData(0));
    }

    dispatch({
      type: constants.GET_NOTIFICATIONS.SUCCESS,
      payload: populatedNotification,
    });
  } catch (error) {
    dispatch({ type: constants.GET_NOTIFICATIONS.FAIL, error });
  } finally {
    dispatch({ type: constants.GET_NOTIFICATIONS.COMPLETE });
  }
};

const updateUnread = async (currentUser, filterNot) => {
  try {
    await ProfilesCollection.doc(currentUser).update({
      notifications: filterNot,
    });
    console.log("complete", filterNot);
  } catch (error) {
    console.log("showError - > ", error, filterNot, currentUser);
  }
};

/**
 * DELETE_NOTIFICATION
 */
export const deleteNotification = (item) => async (dispatch) => {
  try {
    dispatch({ type: constants.DELETE_NOTIFICATION.REQUEST });
    const currentUser = FireAuth().currentUser.uid;

    console.log("printNotificationItem - ?", item);
    const currentUserProfile = await (
      await NotificationsCollection.doc(currentUser).get()
    ).data();
    console.log(
      "currentUserProfile.notification_List - ?",
      currentUserProfile.notification_List,
      item
    );

    const filteredNotifications = [];
    currentUserProfile.notification_List?.map((notification) => {
      if (
        notification &&
        notification.payload &&
        notification.payload.type == "suggestion" &&
        notification.payload.postId == item.postId
      ) {
        console.log("delete -- > ", notification);
      } else {
        filteredNotifications.push(notification);
      }
    });
    console.log("filteredNotifications - ?", filteredNotifications);

    await NotificationsCollection.doc(currentUser).update({
      notification_List: filteredNotifications,
    });

    dispatch({
      type: constants.DELETE_NOTIFICATION.SUCCESS,
      payload: id,
    });
  } catch (error) {
    dispatch({ type: constants.DELETE_NOTIFICATION.FAIL, error });
  } finally {
    dispatch({ type: constants.DELETE_NOTIFICATION.COMPLETE });
  }
};

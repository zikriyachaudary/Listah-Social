import { useSelector } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import {
  Collections,
  Notification_Messages,
  Notification_Types,
} from "../util/Strings";
import { sendPushNotification } from "../network/Services/NotificationServices";
const useNotificationManger = (props) => {
  const selector = useSelector((AppState) => AppState);
  const userSubscribed = async (currentUid, onComplete) => {
    await firestore()
      .collection(Collections.NOTIFICATION)
      .onSnapshot((snapDocs) => {
        userList = snapDocs.docs.map((doc) => {
          if (doc?._data?.userId !== currentUid) {
            return {
              fcmToken: doc?._data?.fcmToken,
              userId: doc?._data?.userId,
            };
          }
          return doc.data();
        });
        onComplete(userList);
      });
  };
  const checkNUpdateFCMToken = async (data) => {
    let isFound = false;
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(data?.userId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data) {
          isFound = true;
        }
      });
    if (isFound) {
      await firestore()
        .collection(Collections.NOTIFICATION)
        .doc(data?.userId)
        .update({ fcmToken: data?.fcmToken })
        .then(() => {
          console.log(" Token update -------->");
        })
        .catch((error) => {
          console.error("Error updating array value:", error);
        });
    } else {
      let obj = {
        userId: data?.userId,
        fcmToken: data?.fcmToken,
        notification_List: [],
      };
      await firestore()
        .collection(Collections.NOTIFICATION)
        .doc(data?.userId)
        .set(obj)
        .then(() => {
          console.log("set token -------->");
        })
        .catch((err) => {
          console.log("update====>", err);
        });
    }
  };
  const followNUnFollowUser = async (obj) => {
    let findedUserIndex = selector?.sliceReducer?.allUserFCMToken.findIndex(
      (item) => item?.userId == obj?.reciverId?.toString()
    );
    if (findedUserIndex == -1) {
      return;
    }
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    let completeNotiList = [];
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data) {
          if (snapDoc?._data?.notification_List?.length > 0) {
            completeNotiList = snapDoc?._data?.notification_List;
          }
        }
      });
    let newObj = {
      reciverId: obj?.reciverId,
      message: `${selector?.Profile?.profile?.username} ${Notification_Messages.followMsg}`,
      actionType: obj?.actionType,
      sender: sender,
      extraData: null,
    };
    let newArr = [];
    if (obj?.actionType == Notification_Types.follow) {
      newArr = [...completeNotiList, newObj];
    } else {
      completeNotiList.map((el) => {
        if (el?.actionType != Notification_Types.follow) {
          newArr.push(el);
        } else if (
          el?.reciverId != obj?.reciverId?.toString() &&
          el?.actionType != Notification_Types.follow
        ) {
          newArr.push(el);
        }
      });
    }

    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .update({ notification_List: newArr })
      .then(() => {
        if (obj?.actionType == Notification_Types.follow) {
          sendPushNoti(newObj);
        }
      })
      .catch((error) => {
        console.error("Error updating array value:", error);
      });
  };
  const likeNUnLikePost = async (obj) => {
    let findedUserIndex = selector?.sliceReducer?.allUserFCMToken.findIndex(
      (item) => item?.userId == obj?.reciverId?.toString()
    );
    if (findedUserIndex == -1) {
      return;
    }

    let completeNotiList = [];
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data) {
          if (snapDoc?._data?.notification_List?.length > 0) {
            completeNotiList = snapDoc?._data?.notification_List;
          }
        }
      });
    let newObj = {
      reciverId: obj?.reciverId,
      message: `${selector?.Profile?.profile?.username} ${Notification_Messages.likeMsg}`,
      actionType: obj?.actionType,
      sender: sender,
      extraData: obj?.extraData,
    };
    let newArr = [];
    if (obj?.actionType == Notification_Types.like) {
      newArr = [...completeNotiList, newObj];
    } else {
      completeNotiList.map((el) => {
        if (el?.actionType != Notification_Types.like) {
          newArr.push(el);
        } else if (
          el?.reciverId != obj?.reciverId &&
          el?.extraData?.postId != obj?.extraData?.postId
        ) {
          newArr.push(el);
        }
      });
    }

    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .update({ notification_List: newArr })
      .then(() => {
        if (obj?.actionType == Notification_Types.like) {
          sendPushNoti(newObj);
        }
      })
      .catch((error) => {
        console.error("Error updating array value:", error);
      });
  };
  const suggestionAtPost = async (obj) => {
    let findedUserIndex = selector?.sliceReducer?.allUserFCMToken.findIndex(
      (item) => item?.userId == obj?.reciverId?.toString()
    );
    if (findedUserIndex == -1) {
      return;
    }
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    let completeNotiList = [];
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data) {
          if (snapDoc?._data?.notification_List?.length > 0) {
            completeNotiList = snapDoc?._data?.notification_List;
          }
        }
      });
    let newObj = {
      reciverId: obj?.reciverId,
      message: `${selector?.Profile?.profile?.username} ${Notification_Messages.suggestion}`,
      actionType: obj?.actionType,
      sender: sender,
      extraData: obj?.extraData,
    };
    let newArr = [];
    newArr = [...completeNotiList, newObj];

    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .update({ notification_List: newArr })
      .then(() => {
        sendPushNoti(newObj);
      })
      .catch((error) => {
        console.error("Error updating array value:", error);
      });
  };
  const challengeAtPost = async (obj) => {
    let findedUserIndex = selector?.sliceReducer?.allUserFCMToken.findIndex(
      (item) => item?.userId == obj?.reciverId?.toString()
    );
    if (findedUserIndex == -1) {
      return;
    }
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    let completeNotiList = [];
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data) {
          if (snapDoc?._data?.notification_List?.length > 0) {
            completeNotiList = snapDoc?._data?.notification_List;
          }
        }
      });
    let newObj = {
      reciverId: obj?.reciverId,
      message: `${selector?.Profile?.profile?.username} ${Notification_Messages.challenge}`,
      actionType: obj?.actionType,
      sender: sender,
      extraData: obj?.extraData,
    };
    let newArr = [];
    newArr = [...completeNotiList, newObj];

    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .update({ notification_List: newArr })
      .then(() => {
        sendPushNoti(newObj);
      })
      .catch((error) => {
        console.error("Error updating array value:", error);
      });
  };
  const commentPostNoti = async (obj) => {
    let findedUserIndex = selector?.sliceReducer?.allUserFCMToken.findIndex(
      (item) => item?.userId == obj?.reciverId?.toString()
    );
    if (findedUserIndex == -1) {
      return;
    }
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    let completeNotiList = [];
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data) {
          if (snapDoc?._data?.notification_List?.length > 0) {
            completeNotiList = snapDoc?._data?.notification_List;
          }
        }
      });
    let newObj = {
      reciverId: obj?.reciverId,
      message: `${selector?.Profile?.profile?.username} ${Notification_Messages.comment}`,
      actionType: obj?.actionType,
      sender: sender,
      extraData: obj?.extraData,
    };
    let newArr = [];
    newArr = [...completeNotiList, newObj];

    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(obj?.reciverId)
      .update({ notification_List: newArr })
      .then(() => {
        sendPushNoti(newObj);
      })
      .catch((error) => {
        console.error("Error updating array value:", error);
      });
  };
  const sendPushNoti = async (obj) => {
    console.log("obj-------->", obj);
    //////////////////  Obj will look like ////////////////////
    // let obj = {
    //   reciverId: "yudfsuy78eqwhjembjheshjriuyuy",
    //   message: "usama follow you",
    //   actionType: "Follow",
    //   extraData: { email: "usamaMalik@gmail.com" },
    // };
    ///////////////////////////////////////////////////////////

    let title = selector?.Profile?.profile?.username;
    let findedUserIndex = selector?.sliceReducer?.allUserFCMToken.findIndex(
      (item) => item?.userId == obj?.reciverId?.toString()
    );
    let finededUserToken =
      selector?.sliceReducer?.allUserFCMToken[findedUserIndex].fcmToken;
    if (findedUserIndex != -1 && finededUserToken) {
      let notification = {
        title: title,
        body: obj?.message,
      };
      let params = {
        to: finededUserToken,
        notification: notification,
        data: {
          ...obj?.extraData,
          actionType: obj?.actionType,
          senderid: selector?.Profile?.profile?.userId,
          senderName: selector?.Profile?.profile?.username,
        },
      };
      await sendPushNotification(params, (type) => {
        if (type) {
          console.log("notification send", type);
        }
      });
    }
  };
  const fetchNotificationList = async (onComplete) => {
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(selector?.Profile?.profile?.userId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data) {
          if (snapDoc?._data?.notification_List?.length > 0) {
            onComplete(snapDoc?._data?.notification_List);
          } else {
            onComplete([]);
          }
        }
      });
  };
  const generateMultiplePushNotification = async (obj) => {
    let title = selector?.Profile?.profile?.username;
    let promiseList = [];
    let message = `${selector?.Profile?.profile?.username} ${Notification_Messages.announcment}`;
    for (let i = 0; i < obj?.receiverList.length; i++) {
      let receiver = obj?.receiverList[i];
      await updateMultiUserNotiList(message, receiver?.userId, obj?.extraData);
      let findedUserIndex = selector?.sliceReducer?.allUserFCMToken.findIndex(
        (item) => item?.userId == receiver?.userId?.toString()
      );
      let sender = {
        id: selector?.Profile?.profile?.userId,
        name: selector?.Profile?.profile?.username,
        image: selector?.Profile?.profile?.profileImage,
      };
      let finededUserToken =
        selector?.sliceReducer?.allUserFCMToken[findedUserIndex].fcmToken;
      if (findedUserIndex != -1 && finededUserToken) {
        let notification = {
          title: title,
          body: message,
        };
        let params = {
          to: finededUserToken,
          notification: notification,
          data: {
            ...obj?.extraData,
            actionType: Notification_Types.announced,
            senderid: sender?.id,
            senderName: sender?.name,
          },
        };
        let promise = new Promise((resolve, reject) => {
          sendPushNotification(params, (type) => {
            if (type) {
              console.log("notification send to ", receiver?.userId);
              resolve(true);
            } else {
              reject(false);
            }
          });
        });
        promiseList.push(promise);
      }
    }
    Promise.all(promiseList)
      .then(() => {
        console.log("notification send to");
      })
      .catch(() => {});
  };
  const updateMultiUserNotiList = async (msg, userId, data) => {
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    let completeNotiList = [];
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(userId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data) {
          if (snapDoc?._data?.notification_List?.length > 0) {
            completeNotiList = snapDoc?._data?.notification_List;
          }
        }
      });
    let newObj = {
      reciverId: userId,
      message: msg,
      actionType: Notification_Types.announced,
      sender: sender,
      extraData: data,
    };
    let newArr = [];
    newArr = [...completeNotiList, newObj];

    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(userId)
      .update({ notification_List: newArr })
      .then(() => {})
      .catch((error) => {
        console.error("Error updating array value:", error);
      });
  };
  return {
    userSubscribed,
    checkNUpdateFCMToken,
    followNUnFollowUser,
    likeNUnLikePost,
    suggestionAtPost,
    challengeAtPost,
    commentPostNoti,
    fetchNotificationList,
    generateMultiplePushNotification,
  };
};
export default useNotificationManger;

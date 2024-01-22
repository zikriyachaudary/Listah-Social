import { useDispatch, useSelector } from "react-redux";
import firestore from "@react-native-firebase/firestore";
import {
  Collections,
  Notification_Messages,
  Notification_Types,
} from "../util/Strings";
import FireStore from "@react-native-firebase/firestore";

import { sendPushNotification } from "../network/Services/NotificationServices";
import { setIsUnReadMsg } from "../redux/action/AppLogics";
import auth from "@react-native-firebase/auth";
const ProfilesCollection = FireStore().collection("profiles");

const useNotificationManger = (props) => {
  const dispatch = useDispatch();
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
        .then(() => {})
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
    let updatedReciverData = null;
    let completeNotiList = [];
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    await getupdatedFCM(obj?.reciverId?.toString(), async (res) => {
      if (res?.userId) {
        updatedReciverData = res;
        if (obj?.actionType == Notification_Types.follow && res?.fcmToken) {
          await unReadedMessageFun(obj?.reciverId?.toString());
        }
        completeNotiList =
          res?.notification_List?.length > 0 ? res?.notification_List : [];
      }

      if (!updatedReciverData?.userId) {
        return;
      }

      let newObj = {
        reciverId: obj?.reciverId,
        message: `${selector?.Profile?.profile?.username} ${Notification_Messages.followMsg}`,
        actionType: obj?.actionType,
        sender: sender,
        extraData: null,
      };
      if (obj.payload) {
        newObj["payload"] = obj.payload;
      }

      let newArr = [];
      if (obj?.actionType == Notification_Types.follow) {
        newArr = [...completeNotiList, newObj];
      } else {
        completeNotiList.map((el) => {
          if (
            el?.actionType == Notification_Types.follow &&
            el?.sender?.id == newObj?.sender?.id
          ) {
            console.log("el------>", el);
          } else {
            newArr.push(el);
          }
        });
      }

      await firestore()
        .collection(Collections.NOTIFICATION)
        .doc(obj?.reciverId)
        .update({ notification_List: newArr })
        .then(() => {
          if (
            obj?.actionType == Notification_Types.follow &&
            updatedReciverData?.fcmToken
          ) {
            sendPushNoti(newObj, updatedReciverData?.fcmToken);
          }
        })
        .catch((error) => {
          console.error("Error updating array value:", error);
        });
    });
  };
  const likeNUnLikePost = async (obj) => {
    let updatedReciverData = null;
    let completeNotiList = [];
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    await getupdatedFCM(obj?.reciverId?.toString(), async (res) => {
      if (res?.userId) {
        updatedReciverData = res;
        if (obj?.actionType == Notification_Types.like && res?.fcmToken) {
          await unReadedMessageFun(obj?.reciverId?.toString());
        }
        completeNotiList = res?.notification_List ? res?.notification_List : [];
      }

      if (!updatedReciverData?.userId) {
        return;
      }

      let newObj = {
        reciverId: obj?.reciverId,
        message: `${selector?.Profile?.profile?.username} ${Notification_Messages.likeMsg}`,
        actionType: obj?.actionType,
        sender: sender,
        extraData: obj?.extraData,
      };
      if (obj.payload) {
        newObj["payload"] = obj.payload;
      }

      let newArr = [];
      if (obj?.actionType == Notification_Types.like) {
        newArr = [...completeNotiList, newObj];
      } else {
        completeNotiList.map((el) => {
          if (
            el?.actionType == Notification_Types.like &&
            el?.sender?.id == newObj?.sender?.id &&
            el?.extraData?.postId == obj?.extraData?.postId
          ) {
            console.log("el------>", el);
          } else {
            newArr.push(el);
          }
        });
      }

      await firestore()
        .collection(Collections.NOTIFICATION)
        .doc(obj?.reciverId)
        .update({ notification_List: newArr })
        .then(() => {
          if (
            obj?.actionType == Notification_Types.like &&
            updatedReciverData?.fcmToken
          ) {
            sendPushNoti(newObj, updatedReciverData?.fcmToken);
          }
        })
        .catch((error) => {
          console.error("Error updating array value:", error);
        });
    });
  };
  const suggestionAtPost = async (obj, suggestionMessage) => {
    let updatedReciverData = null;
    let completeNotiList = [];
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    await getupdatedFCM(obj?.reciverId?.toString(), async (res) => {
      if (res?.userId) {
        updatedReciverData = res;
        if (res?.fcmToken) {
          await unReadedMessageFun(obj?.reciverId?.toString());
        }
        completeNotiList = res?.notification_List;
      }

      if (!updatedReciverData?.userId) {
        return;
      }
      let newObj = {
        reciverId: obj?.reciverId,
        message: `${selector?.Profile?.profile?.username} ${suggestionMessage}`,
        actionType: obj?.actionType,
        sender: sender,
        extraData: obj?.extraData,
      };

      if (obj.payload) {
        newObj["payload"] = obj.payload;
      }

      let newArr = [];
      newArr = [...completeNotiList, newObj];

      await firestore()
        .collection(Collections.NOTIFICATION)
        .doc(obj?.reciverId)
        .update({ notification_List: newArr })
        .then(() => {
          if (updatedReciverData?.fcmToken) {
            sendPushNoti(newObj, updatedReciverData?.fcmToken);
          }
        })
        .catch((error) => {
          console.error("Error updating array value:", error);
        });
    });
  };
  const challengeAtPost = async (obj) => {
    let updatedReciverData = null;
    let completeNotiList = [];
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    await getupdatedFCM(obj?.reciverId?.toString(), async (res) => {
      if (res?.userId) {
        updatedReciverData = res;
        if (res?.fcmToken) {
          await unReadedMessageFun(obj?.reciverId?.toString());
        }
        completeNotiList = res?.notification_List;
      }
      if (!updatedReciverData?.userId) {
        return;
      }
      let newObj = {
        reciverId: obj?.reciverId,
        message: `${selector?.Profile?.profile?.username} ${Notification_Messages.challenge}`,
        actionType: obj?.actionType,
        sender: sender,
        extraData: obj?.extraData,
      };
      if (obj.payload) {
        newObj["payload"] = obj.payload;
      }

      let newArr = [];
      newArr = [...completeNotiList, newObj];

      await firestore()
        .collection(Collections.NOTIFICATION)
        .doc(obj?.reciverId)
        .update({ notification_List: newArr })
        .then(() => {
          if (updatedReciverData?.fcmToken) {
            sendPushNoti(newObj, updatedReciverData?.fcmToken);
          }
        })
        .catch((error) => {
          console.error("Error updating array value:", error);
        });
    });
  };
  const commentPostNoti = async (obj) => {
    let updatedReciverData = null;
    let completeNotiList = [];
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    await getupdatedFCM(obj?.reciverId?.toString(), async (res) => {
      if (res?.userId) {
        updatedReciverData = res;
        if (res?.fcmToken) {
          await unReadedMessageFun(obj?.reciverId?.toString());
        }
        completeNotiList = res?.notification_List;
      }
      if (!updatedReciverData?.userId) {
        return;
      }
      let newObj = {
        reciverId: obj?.reciverId,
        message: `${selector?.Profile?.profile?.username} ${Notification_Messages.comment}`,
        actionType: obj?.actionType,
        sender: sender,
        extraData: obj?.extraData,
      };

      if (obj.payload) {
        newObj["payload"] = obj.payload;
      }
      let newArr = [];
      newArr = [...completeNotiList, newObj];

      await firestore()
        .collection(Collections.NOTIFICATION)
        .doc(obj?.reciverId)
        .update({ notification_List: newArr })
        .then(() => {
          if (updatedReciverData?.fcmToken) {
            sendPushNoti(newObj, updatedReciverData?.fcmToken);
          }
        })
        .catch((error) => {
          console.error("Error updating array value:", error);
        });
    });
  };
  const sendPushNoti = async (obj, fcmToken) => {
    let title = selector?.Profile?.profile?.username;
    console.log("fcmToken----->", fcmToken);
    if (fcmToken) {
      let notification = {
        title: title,
        body: obj?.message,
      };
      let params = {
        to: fcmToken,
        notification: notification,
        data: {
          ...obj?.extraData,
          actionType: obj?.actionType,
          senderId: selector?.Profile?.profile?.userId,
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
    const userId = auth().currentUser.uid;
    console.log("printUserId - > ", userId, selector?.Profile?.profile?.userId);
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(userId)
      // .doc(selector?.Profile?.profile?.userId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?._data && snapDoc?._data?.notification_List?.length > 0) {
          onComplete(snapDoc?._data?.notification_List);
        } else {
          onComplete([]);
        }
      });
  };
  const generateMultiplePushNotification = async (obj) => {
    const extraData = obj?.extraData;
    let message = `${selector?.Profile?.profile?.username} ${Notification_Messages.announcment}`;
    for (let i = 0; i < obj?.receiverList?.length; i++) {
      let receiver = obj?.receiverList[i];
      if (receiver?.userId)
        await updateMultiUserNotiList(message, receiver?.userId, extraData);
    }
  };
  const updateMultiUserNotiList = async (msg, userId, data) => {
    let sender = {
      id: selector?.Profile?.profile?.userId,
      name: selector?.Profile?.profile?.username,
      image: selector?.Profile?.profile?.profileImage,
    };
    let updatedReciverData = null;
    let completeNotiList = [];
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(userId)
      .get()
      .then(async (snapDoc) => {
        if (snapDoc?._data) {
          if (snapDoc?._data?.notification_List?.length > 0) {
            updatedReciverData = snapDoc?._data;
            if (snapDoc?._data?.fcmToken) {
              await unReadedMessageFun(userId?.toString());
            }
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
      .then(() => {
        if (updatedReciverData?.fcmToken) {
          sendPushNoti(newObj, updatedReciverData?.fcmToken);
        }
      })
      .catch((error) => {
        console.error("Error updating array value:", error);
      });
  };
  const getupdatedFCM = async (uId, onComplete) => {
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(uId)
      .get()
      .then(async (snapDoc) => {
        if (snapDoc?._data) {
          onComplete(snapDoc?._data);
        } else {
          onComplete(null);
        }
      });
  };
  const unReadedMessageFun = async (userId) => {
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(userId)
      .update({ isUnRead: true })
      .then(() => {})
      .catch((error) => {
        console.error("Error updating array value:", error);
      });
  };
  const setMessageIsRead = async () => {
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(selector?.Profile?.profile?.userId?.toString())
      .get()
      .then(async (snapDoc) => {
        if (snapDoc?._data?.notification_List) {
          await firestore()
            .collection(Collections.NOTIFICATION)
            .doc(selector?.Profile?.profile?.userId?.toString())
            .update({ isUnRead: false })
            .then(() => {
              dispatch(setIsUnReadMsg(false));
            })
            .catch((error) => {
              console.error("Error updating array value:", error);
            });
        }
      });
  };
  const fetchIsUnReadValue = async (userId) => {
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(userId?.toString())
      .get()
      .then(async (snapDoc) => {
        dispatch(setIsUnReadMsg(snapDoc?._data?.isUnRead ? true : false));
      });
  };
  const fetchPostDetail = async (postId, onComplete) => {
    console.log("postId------>", postId);
    await firestore()
      .collection(Collections.POST)
      .doc(postId?.toString())
      .get()
      .then(async (snapDoc) => {
        if (snapDoc?._data) {
          const postAuthor = await (
            await ProfilesCollection.doc(snapDoc?._data?.author).get()
          ).data();

          const obj = {
            ...snapDoc?._data,
            author: {
              userId: postAuthor?.userId,
              username: postAuthor?.username,
              profileImage: postAuthor?.profileImage,
            },
          };
          onComplete([obj]);
        } else {
          onComplete([]);
        }
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
    setMessageIsRead,
    fetchIsUnReadValue,
    fetchPostDetail,
  };
};
export default useNotificationManger;

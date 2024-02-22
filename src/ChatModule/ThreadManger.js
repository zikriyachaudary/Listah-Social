import firestore from "@react-native-firebase/firestore";
import { Platform } from "react-native";
import storage from "@react-native-firebase/storage";
import { Collections } from "../util/Strings";
import { setThreadList } from "../redux/action/AppLogics";
let CHANNEL_COLLECTION = "channels";
let PARTICIPATION_COLLECTION = "channel_participation";
let THREAD_COLLECITON = "thread";

class ThreadManager {
  static instance = new ThreadManager();
  threadSubscriber = null;
  participantSubscriber = null;
  messageSubscriber = null;
  userSubscriber = null;
  selector = null;
  dispatch = null;
  threadList = [];
  isAppLoaded = false;
  pushObj = {};
  dateFormater = {
    fullDate: "Y-MM-DD HH:mm:ss.SSS Z",
    month: "Y-MM-DD",
    time: "HH:mm:ss",
  };
  setAppLoaded = () => {
    this.isAppLoaded = true;
  };
  //Set Push Obj
  setPushObj = (obj) => {
    this.pushObj = obj;
  };
  //Redux For Store Thread List------>
  setupRedux(selector, dispatch) {
    this.selector = selector;
    this.dispatch = dispatch;
  }

  //At initialize Chat Creating Thread for Chat
  createThread = async (sender, receiver, docId, msg) => {
    let data = {
      lastMessage: msg,
      name: "",
      creatorID: sender?.id,
      channelID: docId,
      id: docId,
      users: [sender?.id, receiver?.id],
    };
    return firestore().collection(CHANNEL_COLLECTION).doc(docId).set(data);
  };
  //set thread At Both side Listener
  setupThreadListener = async (userId) => {
    this.threadSubscriber = firestore()
      .collection(CHANNEL_COLLECTION)
      .where("users", "array-contains", userId)
      .onSnapshot((snapshot) => {
        var newDocs = [];
        if (snapshot) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
            }
            if (change.type === "modified") {
              newDocs.push(change.doc.data());
            }
            if (change.type === "removed") {
            }
            this.updateList(newDocs);
          });
        }
      });
  };

  //update thread list
  updateList = (updatedDocsList) => {
    if (updatedDocsList.length > 0) {
      let newList = [];
      for (let i = 0; i < this.threadList.length; i++) {
        let obj = this.threadList[i];
        let index = updatedDocsList.findIndex(
          (item) => item.channelID == obj.channelID
        );
        if (index != -1) {
          let newObj = {
            ...obj,
            ...updatedDocsList[index],
          };
          newList.push(newObj);
        } else {
          newList.push(obj);
        }
      }
      this.threadList = newList;
      this.updateStateList();
    }
  };
  //set Participant At Both side Listener
  setupParticipantListener = async (userId) => {
    this.participantSubscriber = firestore()
      .collection(PARTICIPATION_COLLECTION)
      .where("user", "==", userId)
      .onSnapshot((snapshot) => {
        var newDocs = [];
        if (snapshot) {
          snapshot?.docChanges()?.forEach((change) => {
            if (change.type === "added") {
              if (
                this.checkThreadExist(change.doc.data()["channel"]) == false
              ) {
                newDocs.push(change.doc.data());
              }
            }
            if (change.type === "modified") {
            }
            if (change.type === "removed") {
              this.removeThreadObj(change.doc.data()["channel"]);
            }
          });
          newDocs.map((doc) => {
            this.addNewThread(doc);
          });
        }
      });
  };
  //at reciver read Message clear Count Fun
  clearUnreadCount = (thread, userId) => {
    let data = {};
    data[`${userId}$$`] = 0;
    firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(thread.channelID)
      .update(data);
  };
  // unnessacery Thread Remove Fun
  removeThreadObj = (channelId) => {
    let index = this.threadList.findIndex(
      (item) => item.channelID == channelId
    );
    if (index != -1) {
      firestore()
        .collection(CHANNEL_COLLECTION)
        .doc(channelId)
        .delete()
        .finally(() => {
          this.threadList.splice(index, 1);
          this.updateStateList();
        });
    }
  };
  //Check thread Is Exist in FB Collection
  checkThreadExist = (threadId) => {
    let isExist = false;
    if (this.threadList.length > 0) {
      let index = this.threadList.findIndex(
        (item) => item.channelID == threadId
      );
      if (index != -1) {
        isExist = true;
      }
    }
    return isExist;
  };
  //at setUpchat add new Thread
  addNewThread = (findedDoc) => {
    var collectionRef = firestore().collection(PARTICIPATION_COLLECTION);
    var channelFilter = collectionRef.where(
      "channel",
      "==",
      findedDoc["channel"]
    );
    var userFilter = channelFilter.where("user", "!=", findedDoc["user"]);
    userFilter.get().then((snapDoc) => {
      if (snapDoc?.docs?.length > 0) {
        let firstDoc = snapDoc.docs[0].data();
        firestore()
          .collection(CHANNEL_COLLECTION)
          .doc(findedDoc["channel"])
          .get()
          .then((findedThread) => {
            let thread = {
              ...findedThread.data(),
              participants: [findedDoc, firstDoc],
            };
            this.threadList.push(thread);
            this.updateStateList();
          });
      }
    });
  };
  // remove Thread Observer at App close and Other State's
  removeThreadObserver = () => {
    console.log("removeThreadObserver------>", removeThreadObserver);
    if (this.threadSubscriber) {
      this.threadSubscriber();
      this.participantSubscriber();
      this.userSubscriber();
    }
  };
  //Chat Initialize Fun------>
  onSendCall = async (sender, receiver, docId, msg, onComplete) => {
    this.createThread(sender, receiver, docId, msg)
      .then(() => {
        this.createParticipant(sender, receiver, docId)
          .then(() => {
            let participantsList = [
              {
                channel: docId,
                user: sender?.id,
                isAdmin: true,
                status: "accept",
                userName: sender?.username
                  ? sender?.username
                  : sender?.firstName,
                userProfileImageUrl: sender?.image ? sender?.image : "",
              },
              {
                channel: docId,
                user: receiver?.id,
                isAdmin: false,
                status: "accept",
                userName: receiver?.username
                  ? receiver?.username
                  : receiver?.firstname,
                userProfileImageUrl: receiver?.image ? receiver?.image : "",
              },
            ];
            let threadData = {
              lastMessage: msg,
              name: "",
              creatorID: sender.id,
              channelID: docId,
              id: docId,
              users: [sender.id, receiver.id],
              participants: participantsList,
            };
            this.threadList.push(threadData);
            onComplete(threadData);
          })
          .catch((error) => {
            console.log("printError - > ", error);
            onComplete("error");
          });
      })
      .catch((err) => {
        onComplete("error===>", err);
      });
  };
  //For Chat Initialize create Participant Fun------>
  createParticipant = async (sender, receiver, docId) => {
    let senderPromise = new Promise((resolve, reject) => {
      let senderPic = sender?.image
        ? sender?.image
        : sender.profileImage
        ? sender.profileImage
        : sender.profile_image;

      let data = {
        channel: docId,
        user: sender.id,
        isAdmin: true,
        status: "accept",
        userName: sender?.username
          ? sender.username
          : sender.firstName
          ? sender.firstName
          : "",
        userProfileImageUrl: senderPic ? senderPic : "",
      };
      firestore()
        .collection(PARTICIPATION_COLLECTION)
        .add(data)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(true);
        });
    });
    let receiverPromise = new Promise((resolve, reject) => {
      let data = {
        channel: docId,
        user: receiver?.id,
        isAdmin: false,
        status: "request",
        userName: receiver?.username ? receiver?.username : receiver?.firstname,
        userProfileImageUrl: receiver?.image ? receiver?.image : "",
      };

      firestore()
        .collection(PARTICIPATION_COLLECTION)
        .add(data)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(true);
        });
    });
    return Promise.all([senderPromise, receiverPromise]);
  };
  // REQUEST METHODS
  getUserThread = async (userId, onComplete) => {
    firestore()
      .collection(PARTICIPATION_COLLECTION)
      .where("user", "==", userId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?.docs?.length > 0) {
          var promiseList = [];
          this.threadList = [];
          for (let i = 0; i < snapDoc.docs.length; i++) {
            let snapObj = snapDoc.docs[i].data();
            let promise = new Promise((resolve, reject) => {
              firestore()
                .collection(CHANNEL_COLLECTION)
                .doc(snapObj["channel"])
                .get()
                .then((snapDoc) => {
                  let threadData = snapDoc.data();
                  firestore()
                    .collection(PARTICIPATION_COLLECTION)
                    .where("user", "!=", userId)
                    .where("channel", "==", snapObj["channel"])
                    .get()
                    .then((snapData) => {
                      let findedData = {
                        ...threadData,
                        participants: [snapData.docs[0].data(), snapObj],
                      };
                      this.threadList = [...this.threadList, findedData];
                      this.threadList.push(findedData);
                      resolve(true);
                    })
                    .catch((error) => {
                      console.log("error------>", error);
                      reject(true);
                    });
                })
                .catch((error) => {
                  console.log("error===---==>", error);
                  reject(error);
                });
            });
            promiseList.push(promise);
          }
          Promise.all(promiseList).finally(() => {
            this.updateStateList();
            onComplete(this.threadList);
          });
        } else {
          onComplete([]);
        }
      });
  };

  // UPDATE STATE LIST
  updateStateList = () => {
    let newArray = [];
    for (let i = 0; i < this.threadList.length; i++) {
      let obj = this.threadList[i];
      let index = newArray.findIndex(
        (item) => item?.channelID == obj?.channelID
      );
      if (index == -1) {
        newArray.push(obj);
      }
    }
    this.dispatch(setThreadList(newArray));
    this.threadList = newArray;
  };
  // MESSAGES METHOD
  sendMessage = async (docId, data) => {
    return firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(docId)
      .collection(THREAD_COLLECITON)
      .doc(data.messageId)
      .set(data);
  };
  // SEND PUSH NOTIFICATION
  updateNotificationList = async (thread, sender, receiver, message, type) => {
    let updatedReciverData = null;
    let completeNotiList = [];
    await this.getupdatedUserData(receiver?.user?.toString(), async (res) => {
      if (res?.userId) {
        updatedReciverData = res;
        completeNotiList = res?.notification_List;
      }
      if (!updatedReciverData?.userId) {
        return;
      }
      let newObj = {
        reciverId: receiver?.user,
        message: message,
        actionType: type,
        sender: sender,
        thread: thread,
      };
      let newArr = [];
      newArr = [...completeNotiList, newObj];
      await firestore()
        .collection(Collections.NOTIFICATION)
        .doc(receiver?.user)
        .update({ notification_List: newArr })
        .then(() => {})
        .catch((error) => {
          console.error("Error updating array value:", error);
        });
    });
    ///////
  };
  getupdatedUserData = async (userId, onComplete) => {
    await firestore()
      .collection(Collections.NOTIFICATION)
      .doc(userId)
      .get()
      .then(async (snapDoc) => {
        if (snapDoc?._data) {
          onComplete(snapDoc?._data);
        } else {
          onComplete(null);
        }
      });
  };
  getIsUserBlocked = async (blockedUser, blockedUserBy, onComplete) => {
    let isUserBlocked = false;
    await firestore()
      .collection(Collections.BLOCKED_USER)
      .where("blockedBy", "==", blockedUserBy)
      .get()
      .then(async (snapDoc) => {
        if (snapDoc?.docs[0]?.data()?.blockUserId?.length > 0) {
          let blockedList = snapDoc?.docs[0]?.data()?.blockUserId;
          if (blockedList?.length > 0) {
            let findedIndexValue = blockedList.findIndex(
              (value) => value == blockedUser
            );
            if (findedIndexValue != -1) {
              isUserBlocked = true;
            }
          }
        }
      });
    if (!isUserBlocked) {
      await firestore()
        .collection(Collections.BLOCKED_USER)
        .where("blockedBy", "==", blockedUser)
        .get()
        .then(async (snapDoc) => {
          if (snapDoc?.docs[0]?.data()?.blockUserId?.length > 0) {
            let blockedList = snapDoc?.docs[0]?.data()?.blockUserId;
            if (blockedList?.length > 0) {
              let findedIndexValue = blockedList.findIndex(
                (value) => value == blockedUserBy
              );
              if (findedIndexValue != -1) {
                isUserBlocked = true;
              }
            }
          }
        });
    }
    onComplete(isUserBlocked);
  };
  // MESSAGE LISTNERS
  getInitialThreadMessages = (threadId, onMessageUpdates) => {
    firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(threadId)
      .collection(THREAD_COLLECITON)
      .limit(50)
      .orderBy("created", "desc")
      .get()
      .then((snapShot) => {
        var messagesList = [];
        snapShot?.docs?.forEach((doc) => {
          messagesList.push(doc.data());
        });
        onMessageUpdates(messagesList);
      })
      .catch(() => {
        onMessageUpdates([]);
      });
  };
  setUpMessageListener = (threadId, onMessageUpdates) => {
    this.messageSubscriber = firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(threadId)
      .collection(THREAD_COLLECITON)
      .onSnapshot((snapDocs) => {
        var docsList = [];
        snapDocs.docChanges().forEach((change) => {
          if (change.type == "added") {
            docsList.push({
              type: "added",
              data: change.doc.data(),
            });
          }
          if (change.type == "modified") {
            docsList.push({
              type: "modified",
              data: change.doc.data(),
            });
          }
        });
        if (docsList.length > 0) {
          onMessageUpdates(docsList);
        }
      });
  };
  updateMessageSeener = (docId, messagesList, userId) => {
    let promiseList = [];
    messagesList.forEach((item) => {
      let promise = new Promise((resolve, reject) => {
        firestore()
          .collection(CHANNEL_COLLECTION)
          .doc(docId)
          .collection(THREAD_COLLECITON)
          .doc(item.messageId)
          .update({
            lastMessageSeeners: [userId],
          })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
      promiseList.push(promise);
    });
    Promise.all(promiseList).finally(() => {});
  };
  removeMessageListener = () => {
    if (this.messageSubscriber) {
      this.messageSubscriber();
    }
  };
  updateLastThreadMessage = (
    thread,
    lastMessage,
    otherUser,
    createAt,
    payload
  ) => {
    let data = {};
    data["createdAt"] = createAt;
    if (payload?.reply) {
      data["reply"] = payload?.reply;
    }
    if (payload?.marked) {
      data["marked"] = payload.marked;
    }
    if (payload?.messageId) {
      data["messageId"] = payload.messageId;
    }
    data["lastMessage"] = lastMessage;

    if (otherUser) {
      data[`${otherUser.user}$$`] = 1;
      if (thread[`${otherUser.user}$$`]) {
        let count = thread[`${otherUser.user}$$`] + 1;
        thread[`${otherUser.user}$$`] = count;
        data[`${otherUser.user}$$`] = count;
      }
    }
    firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(thread.channelID)
      .update(data)
      .catch((err) => {
        console.log("errrrorr=====>", err);
      });
  };

  // COMMON METHOD
  makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  fetchMessageData = async (docId, messageId, onComplete) => {
    await firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(docId)
      .collection(THREAD_COLLECITON)
      .where("messageId", "==", messageId)
      .get()
      .then((snapDoc) => {
        if (snapDoc?.docs?.length > 0) {
          onComplete(snapDoc.docs[0]?._data?.lastMessageSeeners);
        }
      });
  };

  // IMAGE MESSAGE
  uploadMedia = async (uri, videoType, onComplete) => {
    let filename = this.makeid(6) + uri.substring(uri.lastIndexOf("/") + 1);
    let uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    if (videoType && uploadUri.includes("mov")) {
      let fileArr = filename.split(".");
      const ext = fileArr[fileArr.length - 1];
      if (ext.toLowerCase() == "mov") {
        filename = filename.replace(/mov/g, "mp4");
      }
    }
    const ref = storage().ref(filename);
    const task = ref.putFile(uploadUri);
    // set progress state
    task.on("state_changed", (snapshot) => {});
    try {
      await task
        .then((item) => {
          ref.getDownloadURL().then((url) => {
            onComplete(url);
          });
        })
        .catch((error) => {
          console.log("error getting url ", error);
          onComplete("error");
        });
    } catch (e) {
      onComplete("error");
    }
  };

  //Check is Already Connection or Not
  checkIsConnectionExist = async (senderId, reciverId, onComplete) => {
    let threadListArr = this.threadList;
    let newArr = [];
    console.log("threadListArr.length----->,", threadListArr.length);
    for (let i = 0; i < threadListArr.length; i++) {
      let threadObj = threadListArr[i];
      let participants = threadObj.participants;
      let isSenderIndex = participants.findIndex(
        (value) => value.user == senderId
      );
      let isReciverIndex = participants.findIndex(
        (value) => value.user == reciverId
      );
      console.log("senderIndex------>", isSenderIndex);
      console.log("reciverIndex------>", isReciverIndex);
      if (isSenderIndex != -1 && isReciverIndex != -1) {
        newArr.push(threadObj);
      }
    }
    onComplete(newArr?.length > 0 ? newArr[0] : null);
  };

  ////
  uploadVoiceMedia = async (uri, onComplete) => {
    const filename = this.makeid(6) + uri.substring(uri.lastIndexOf("/") + 1);
    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    const ref = storage().ref(filename);
    const task = ref.putFile(uploadUri);
    // set progress state
    task.on("state_changed", (snapshot) => {});
    try {
      await task
        .then((item) => {
          ref.getDownloadURL().then((url) => {
            onComplete(url);
          });
        })
        .catch((error) => {
          console.log("error getting url ", error);
          onComplete("error");
        });
    } catch (e) {
      onComplete("error");
    }
  };

  ////////////////////
}
export default ThreadManager;

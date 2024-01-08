import React, { useEffect, useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  SectionList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  PermissionsAndroid,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import { createThumbnail } from "react-native-create-thumbnail";
import DocumentPicker, { types } from "react-native-document-picker";
import RNFS from "react-native-fs";
import { setIsAppLoader, setIsHideTabBar } from "../../redux/action/AppLogics";
import ThreadManager from "../../ChatModule/ThreadManger";
import moment from "moment";
import ChatHeader from "../Components/ChatHeader";
import MyMessage from "../Components/MyMessages";
import OtherUserMessage from "../Components/OtherUserMessage";
import ChatBar from "../Components/ChatBar";
import PdfView from "../Components/PdfView";
import ChatImageView from "../Components/ChatImageView";
import MediaSelectionModal from "../Components/MediaSelectionModal";
import {
  AppColors,
  hv,
  isSmallDevice,
  normalized,
} from "../../util/AppConstant";
import { capitalizeFirstLetter, removeEmptyLines } from "../../util/helperFun";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Notification_Types } from "../../util/Strings";
const ChatScreen = (props) => {
  const selector = useSelector((AppState) => AppState?.Profile);
  const thread = props?.route?.params?.thread
    ? props?.route?.params?.thread
    : [];
  var selectedUrl = useRef();
  const [openSelectionMediaModal, setOpenSelectionMediaModal] = useState(false);
  const dispatch = useDispatch();
  const scrollToBottomRef = useRef(null);
  const [receiverFcmToken, setReceiverFcmToken] = useState(null);
  const [message, setMessage] = useState("");
  const currentlyVisibleMessages = useRef([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const userId = selector?.profile?.userId?.toString();
  const [otherUserStatus] = useState(null);
  const threadSelector = useSelector(
    (AppState) => AppState?.sliceReducer.threadList
  );
  const isFocused = useIsFocused();
  const [currentUserData] = useState(selector?.profile);
  const [visibleMessages, setVisibleMessage] = useState([]);
  const [showPdf, setShowPdf] = useState(false);
  const [showImageView, setShowImageView] = useState(false);
  var allMessages = useRef();
  var otherUserRef = useRef();
  var initialMessageRef = useRef();
  var threadRef = useRef();
  var initialCall = useRef();
  useEffect(() => {
    if (props?.route?.params?.thread) {
      fetchFcmToken();
    }
  }, [props?.route?.params?.thread]);
  const fetchFcmToken = () => {
    let participants = props?.route?.params?.thread
      ? typeof props?.route?.params?.thread?.participants == "string"
        ? JSON.parse(props?.route?.params?.thread?.participants)
        : props?.route?.params?.thread?.participants
      : typeof thread.participants == "string"
      ? JSON.parse(thread.participants)
      : thread.participants;

    let otherIndex = participants.findIndex((value) => value.user != userId);
    if (otherIndex != -1) {
      ThreadManager.instance.getupdatedUserData(
        participants[otherIndex]?.user,
        (response) => {
          setReceiverFcmToken(response?.fcmToken);
          console.log("response----->", response?.fcmToken);
        }
      );
    }
  };

  useFocusEffect(() => {
    if (isFocused) {
      dispatch(setIsHideTabBar(true));
    }
    return () => {
      dispatch(setIsHideTabBar(false));
    };
  }, [isFocused]);
  useEffect(() => {
    threadRef.current = thread;
    initialMessageRef.current = 50;
    getInitialMessageList();
    clearCount();
    return () => {
      ThreadManager.instance.removeMessageListener();
    };
  }, []);
  useEffect(() => {
    let index = threadSelector.findIndex(
      (item) => item.channelID == threadRef.current.channelID
    );
    if (index == -1) {
      // props?.navigation.goBack();
    } else {
      let count = 0;
      let findedThread = threadSelector[index];
      threadRef.current = findedThread;
      if (threadRef.current[`${userId}$$`]) {
        count = threadRef.current[`${userId}$$`];
      }
      if (count > 0) {
        clearCount();
      }
    }
  }, [threadSelector]);
  const clearCount = () => {
    ThreadManager.instance.clearUnreadCount(threadRef.current, userId);
  };
  const getInitialMessageList = () => {
    dispatch(setIsAppLoader(true));
    ThreadManager.instance.getInitialThreadMessages(
      threadRef.current.channelID,
      (messageList) => {
        dispatch(setIsAppLoader(false));
        allMessages.current = messageList;
        createSectionData();
        setTimeout(() => {
          listMessageListener();
        }, 2000);
      }
    );
  };
  const createSectionData = (isScrollBottom = true) => {
    let data = [];
    allMessages.current.sort((s1, s2) => {
      let firstObj = moment(
        s1.created,
        ThreadManager.instance.dateFormater.fullDate
      ).toDate();
      let secondObj = moment(
        s2.created,
        ThreadManager.instance.dateFormater.fullDate
      ).toDate();
      return secondObj - firstObj;
    });
    let messsges = allMessages.current.slice(0, initialMessageRef.current);

    if (messsges?.length > 0) {
      messsges.forEach((item) => {
        let findedDate = moment(
          moment(item.created, ThreadManager.instance.dateFormater.fullDate)
        );
        let date = findedDate.format(ThreadManager.instance.dateFormater.month);
        let index = data.findIndex((obj) => obj.title == date);
        let timeDate = findedDate.format(
          ThreadManager.instance.dateFormater.time
        );
        let newItem = {
          ...item,
          type: userId == item?.senderID ? "Owner" : "guest",
          time: timeDate,
        };

        if (index == -1) {
          let newObj = {
            title: date,
            data: [newItem],
          };
          data.push(newObj);
        } else {
          let findedObj = data[index];
          let finedList = findedObj.data;
          finedList.push(newItem);
          findedObj.data = finedList;
          data[index] = findedObj;
        }
      });
    }

    currentlyVisibleMessages.current = data;
    setVisibleMessage(data);
    if (data?.length > 0) {
      if (isScrollBottom) {
        setTimeout(() => {
          scrollToEnd();
        }, 1000);
      }
    }
  };

  const listMessageListener = () => {
    ThreadManager.instance.setUpMessageListener(
      threadRef.current.channelID,
      (docList) => {
        let newDocsCount = 0;
        let lastSeenerMessageList = [];
        docList.forEach((item) => {
          let data = item.data;
          if (data.senderID != userId && data.lastMessageSeeners.length == 0) {
            lastSeenerMessageList.push(data);
          }
          let index = allMessages.current.findIndex(
            (item) => item.messageId == data.messageId
          );
          if (index != -1) {
            allMessages.current[index] = data;
          } else {
            if (initialCall.current == false) {
              newDocsCount += 1;
            }
            allMessages.current.push(data);
          }
        });
        if (initialCall.current) {
          initialCall.current = false;
        }
        initialMessageRef.current = initialMessageRef.current + newDocsCount;
        createSectionData();
        if (lastSeenerMessageList.length > 0) {
          ThreadManager.instance.updateMessageSeener(
            thread.channelID,
            lastSeenerMessageList,
            currentUserData?.userId
          );
        }
      }
    );
  };
  const onTopReached = () => {
    initialMessageRef.current = initialMessageRef.current + 50;
    createSectionData(false);
  };
  const scrollToEnd = () => {
    if (visibleMessages.length > 0) {
      scrollToBottomRef.current?.scrollToLocation({
        animated: true,
        sectionIndex: 0,
        itemIndex: 0,
        viewPosition: 0,
      });
    }
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(true);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [isKeyboardVisible]);

  const setName = () => {
    let name = "";
    let participants = threadRef.current
      ? typeof threadRef.current.participants == "string"
        ? JSON.parse(threadRef.current.participants)
        : threadRef.current.participants
      : typeof thread.participants == "string"
      ? JSON.parse(thread.participants)
      : thread.participants;
    if (participants?.length > 0) {
      let otherUserIndex = participants.findIndex(
        (value) => value.user != userId
      );
      if (otherUserIndex != -1) {
        otherUserRef.current = participants[otherUserIndex];
        name = participants[otherUserIndex]?.userName;
      }
      return name;
    }
  };
  const onSendMessage = (params) => {
    let messageId = ThreadManager.instance.makeid(8);
    let currentDate = moment
      .utc(new Date())
      .format(ThreadManager.instance.dateFormater.fullDate);

    let data = {
      created: currentDate,
      createdAt: currentDate,
      senderID: userId,
      senderName: currentUserData?.username ? currentUserData.username : "",
      senderProfilePictureURL: currentUserData?.profileImage
        ? currentUserData?.profileImage
        : "",
      recipientID: otherUserRef?.current?.user,
      recipientName: otherUserRef.current?.userName,
      recipientProfilePictureURL: otherUserRef.current?.userProfileImageUrl,
      lastMessageSeeners: [],
      messageId: messageId,
      content: message,
      ...params,
    };
    let lastMessage = "";
    if (data["content"]) {
      lastMessage = data["content"];
    }

    if (data["url"]) {
      lastMessage = "Photo";
    }
    if (data["documentUrl"]) {
      lastMessage = "Document";
    }
    let newParams = {
      ...data,
      send: false,
    };

    allMessages.current.push(newParams);
    initialMessageRef.current = initialMessageRef.current + 1;
    createSectionData();
    ThreadManager.instance
      .sendMessage(threadRef.current.channelID, data)
      .then(async () => {
        let payload = {
          reply: params?.reply ? params.reply : null,
          marked: params?.marked ? params.marked : null,
        };
        ThreadManager.instance.updateLastThreadMessage(
          threadRef.current,
          lastMessage,
          otherUserRef.current,
          currentDate,
          payload
        );
        let fullName = capitalizeFirstLetter(
          currentUserData?.username ? currentUserData.username : ""
        );
        setTimeout(async () => {
          await ThreadManager.instance.updateNotificationList(
            threadRef.current,
            {
              id: currentUserData?.userId,
              userName: fullName,
              image: currentUserData?.profileImage,
            },
            otherUserRef.current,
            lastMessage,
            Notification_Types.chat_messages
          );
        }, 1000);
        if (receiverFcmToken) {
          setTimeout(() => {
            ThreadManager.instance.fetchMessageData(
              threadRef.current.channelID,
              data?.messageId,
              (response) => {
                if (response?.length == 0) {
                  let notification = {
                    title: fullName,
                    body: lastMessage,
                  };
                  let params = {
                    to: receiverFcmToken,
                    notification: notification,
                    data: {
                      thread: threadRef?.current,
                      actionType: Notification_Types.chat_messages,
                    },
                  };
                  sendPushNotification(params, (type) => {
                    if (type) {
                      console.log("notification send", type);
                    }
                  });
                  ////////
                }
              }
            );
          }, 1000);
        }
      })
      .catch((error) => {
        console.log("error==---=>", error);
      });
  };

  const mediaSelection = () => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: "photo",
      compressImageQuality: 0.5,
    }).then((images) => {
      setOpenSelectionMediaModal(false);
      dispatch(setIsAppLoader(true));
      let video = false;
      video = images.mime.toLocaleLowerCase().includes("video");
      ThreadManager.instance.uploadMedia(images.path, video, (url) => {
        if (url != "error") {
          let params = {};
          if (video && url) {
            createThumbnail({
              url: url,
              timeStamp: 10000,
            })
              .then(async (response) => {
                params["videoUrl"] = url;
                await uploadThumnail(response.path, params);
              })
              .catch((err) => {
                dispatch(setIsAppLoader(false));
                console.log("printImgErr ", err);
              });
          } else {
            params["url"] = url;
            dispatch(setIsAppLoader(false));
            onSendMessage(params);
          }
        } else {
          dispatch(setIsAppLoader(false));

          Alert.alert("", "Error while uploading media");
        }
      });
    });
  };
  const uploadThumnail = async (path, payload) => {
    let obj = { ...payload };
    await ThreadManager.instance.uploadMedia(path, false, (url) => {
      if (url !== "error") {
        obj["thumbnail"] = url;
        dispatch(setIsAppLoader(false));
        onSendMessage(obj);
      } else {
        dispatch(setIsAppLoader(false));
        Alert.alert("", "Error while uploading media");
      }
    });
  };
  const checkAndroidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "File Access",
          message: "We Need Your File Access to Upload Pdf",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        documentSelection();
      }
    } catch (e) {}
  };
  const documentSelection = async () => {
    DocumentPicker.pick({
      presentationStyle: "formSheet",
      type: types.pdf,
      allowMultiSelection: false,
    })
      .then(async (pdf) => {
        setOpenSelectionMediaModal(false);
        const result = pdf[0];
        dispatch(setIsAppLoader(true));
        let urls = await getPathForFirebaseStorage(result.uri);
        ThreadManager.instance.uploadMedia(urls, false, (url) => {
          dispatch(setIsAppLoader(false));
          if (url != "error") {
            let params = {
              documentUrl: url,
            };
            onSendMessage(params);
          } else {
            Alert.alert("", "Error while uploading media");
          }
        });
      })
      .catch((e) => {
        console.log("DocumentPicker (error) => ", e.message);
      });
  };
  const getPathForFirebaseStorage = async (uri) => {
    if (Platform.OS == "ios") {
      return uri;
    } else {
      const destPath = `${
        RNFS.TemporaryDirectoryPath
      }/${ThreadManager.instance.makeid(5)}`;
      await RNFS.copyFile(uri, destPath);
      let data = await RNFS.stat(destPath);
      return data.path;
    }
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: AppColors.white.white }} />
      <View style={styles.container}>
        <ChatHeader
          otherUserStatus={otherUserStatus}
          title={setName()}
          profile={otherUserRef?.current?.userProfileImageUrl}
          atBackPress={() => {
            props?.navigation?.goBack();
          }}
          showBorder={true}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: normalized(5),
          }}
        >
          <SectionList
            inverted
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              onTopReached();
            }}
            ref={scrollToBottomRef}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            sections={visibleMessages}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index, section }) => {
              return (
                <View style={styles.sectionListCon}>
                  {item.type == "Owner" ? (
                    <MyMessage
                      item={item}
                      onPdf={() => {
                        selectedUrl.current = item.documentUrl;
                        setShowPdf(true);
                      }}
                      onImage={() => {
                        selectedUrl.current = item.url;
                        setShowImageView(true);
                      }}
                      atProfilePress={() => {}}
                      navigation={props.navigation}
                      playVideo={(obj) => {}}
                    />
                  ) : (
                    <OtherUserMessage
                      otherUserData={otherUserRef.current}
                      item={item}
                      onPdf={() => {
                        selectedUrl.current = item.documentUrl;
                        setShowPdf(true);
                      }}
                      onImage={() => {
                        selectedUrl.current = item.url;
                        setShowImageView(true);
                      }}
                      navigation={props.navigation}
                      playVideo={(obj) => {}}
                    />
                  )}
                </View>
              );
            }}
            renderSectionFooter={({ section }) => {
              return (
                <View
                  style={{
                    flex: 1,
                    paddingTop: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.simpleLine} />
                  <Text
                    style={{
                      marginHorizontal: normalized(15),
                      fontSize: normalized(14),
                      paddingVertical: hv(4),
                      color: AppColors.black.lightBlack,
                      textAlign: "center",
                    }}
                  >{`${section.title} (${moment(
                    section.title,
                    "YYYY-MM-DD"
                  ).format("ddd")})`}</Text>
                  <View style={styles.simpleLine} />
                </View>
              );
            }}
            renderSectionHeader={({ section }) => {
              return null;
            }}
          />
        </View>

        <KeyboardAvoidingView
          keyboardVerticalOffset={
            Platform.OS === "ios"
              ? isSmallDevice
                ? normalized(30)
                : normalized(50)
              : -5
          }
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.chatBarStyle}>
            <ChatBar
              onAttachmentPress={() => {
                setOpenSelectionMediaModal(true);
              }}
              onSendPress={() => {
                const newMessage = removeEmptyLines(message);
                if (newMessage != "") {
                  setMessage("");
                  let params = {
                    content: newMessage,
                  };
                  onSendMessage(params);
                }
                setMessage("");
              }}
              smileBtnPress={() => {
                console.log("smileBtnPress=====>");
              }}
              audioBtnPress={() => {
                console.log("audioBtnPress=====>");
              }}
              value={message}
              onChangeText={(m) => {
                setMessage(m);
              }}
              isDisable={false}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
      <SafeAreaView style={{ backgroundColor: AppColors.white.white }} />
      <Modal visible={showPdf} presentationStyle="fullScreen">
        <PdfView url={selectedUrl.current} onClose={() => setShowPdf(false)} />
      </Modal>
      {showImageView ? (
        <ChatImageView
          showImageView={showImageView}
          url={selectedUrl.current}
          onClose={() => setShowImageView(false)}
        />
      ) : null}
      {openSelectionMediaModal ? (
        <MediaSelectionModal
          onClose={() => {
            setOpenSelectionMediaModal(false);
          }}
          atPress={(type) => {
            if (type == "upload image") {
              mediaSelection();
            } else {
              if (Platform.OS == "android") {
                checkAndroidPermission();
              } else {
                documentSelection();
              }
            }
          }}
        />
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white.white,
  },
  chatBarStyle: {
    maxHeight: hv(100),
    marginHorizontal: normalized(5),
  },
  chatView: {
    flex: 1,
    paddingHorizontal: normalized(8),
  },
  specificTime: {
    fontSize: normalized(14),
    paddingVertical: hv(4),
    color: AppColors.grey.grey,
    textAlign: "center",
  },
  sectionListCon: {
    paddingHorizontal: normalized(8),
    paddingTop: hv(15),
  },
  simpleLine: {
    height: normalized(1),
    width: normalized(90),
    backgroundColor: "#E8E6EA",
  },
});

export default ChatScreen;

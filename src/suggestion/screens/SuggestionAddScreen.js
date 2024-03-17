import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import FireAuth from "@react-native-firebase/auth";
import FireStorage from "@react-native-firebase/storage";
import { Alert, Image, StyleSheet, TouchableOpacity } from "react-native";

import {
  View,
  Content,
  Container,
  StackHeader,
  TextInput,
  Touchable,
} from "../../common";

import UploadIcon from "../../assets/icons/edit-upload-icon.svg";
import CheckIcon from "../../assets/icons/edit-check-icon.svg";

import { suggestPost as suggestPostAction } from "../redux/actions";
import {
  Notification_Messages,
  Notification_Types,
  Theme_Mode,
} from "../../util/Strings";
import useNotificationManger from "../../hooks/useNotificationManger";
import MediaTypeSelection from "../../common/MediaTypeSelection";
import VideoPlayerModal from "../../common/VideoPlayerModal";
import MediaPickerModal from "../../common/MediaPickerModal";
import { Routes } from "../../util/Route";
import {
  AppColors,
  AppImages,
  darkModeColors,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import LoadingImage from "../../common/LoadingImage";
import { setIsAppLoader } from "../../redux/action/AppLogics";
import ImageResizer from "react-native-image-resizer";
import { createThumbnail } from "react-native-create-thumbnail";
import ThreadManager from "../../ChatModule/ThreadManger";

/* =============================================================================
<SuggestionAddScreen />
============================================================================= */
const SuggestionAddScreen = ({ route, navigation, suggestPost }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const selector = useSelector((AppState) => AppState);
  const dispatch = useDispatch();
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState("");
  const [openMediaModal, setOpenMediaModal] = useState({
    value: false,
    type: "",
  });
  const [mediaObj, setMediaObj] = useState(null);

  const { postId, postTitle, authorId } = route?.params;
  const { suggestionAtPost } = useNotificationManger();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const disabled = name || description;

  const _handleSubmit = async () => {
    if (disabled) {
      dispatch(setIsAppLoader(true));
      let mediaUrl = null;
      await uploadMedia((rep) => {
        mediaUrl = rep;
      });
      let singleItem = {
        name,
        description,
        video: "",
        image: "",
      };
      if (mediaUrl?.thumbnail) {
        singleItem["videoObj"] = mediaUrl;
      } else {
        singleItem["image"] = mediaUrl ? mediaUrl : "";
      }

      const payload = {
        type: "suggestion",
        change: {
          type: "add",
          item: singleItem,
        },
        postId,
        postTitle,
        sender: {
          userId: FireAuth().currentUser.uid,
          username: FireAuth().currentUser.displayName,
        },
        authorId,
      };
      await suggestPost(payload, async () => {
        if (authorId != selector?.Auth?.user?.uid) {
          await suggestionAtPost(
            {
              actionType: Notification_Types.suggestion,
              reciverId: authorId,
              extraData: { postId: postId },
              payload: payload,
            },
            Notification_Messages.suggestion
          );
        }

        Alert.alert("Suggestion Successful", "Your suggestion has been send", [
          { text: "OK", onPress: () => navigation.navigate("HomeStack") },
        ]);
      });
    }
    // setLoading(false);
    dispatch(setIsAppLoader(false));
  };
  const uploadMedia = async (onComplete) => {
    let obj = null;
    if (
      (typeof mediaObj == "string" && mediaObj.includes("https")) ||
      (typeof mediaObj?.video == "string" && mediaObj?.video.includes("https"))
    ) {
      obj = {
        ...mediaObj,
      };
    }
    if (mediaObj?.uri != "" && !mediaObj?.thumbnail) {
      const compressedImage = await ImageResizer.createResizedImage(
        mediaObj?.uri,
        1000,
        1000,
        "PNG",
        100,
        0
      );
      const storageRef = FireStorage()
        .ref("post_media")
        .child(mediaObj?.fileName);
      await storageRef.putFile(compressedImage.uri);
      obj = await storageRef.getDownloadURL();
    } else if (mediaObj?.video?.uri) {
      let uploadMediaUrl = "";
      let filename =
        ThreadManager.instance.makeid(6) +
        mediaObj?.video?.uri.substring(
          mediaObj?.video?.uri.lastIndexOf("/") + 1
        );
      let uploadUri = mediaObj?.video?.uri.replace("file://", "");

      if (uploadUri.includes("mov")) {
        let fileArr = filename.split(".");
        const ext = fileArr[fileArr.length - 1];
        if (ext.toLowerCase() == "mov") {
          filename = filename.replace(/mov/g, "mp4");
        }
      }
      const storageRef = FireStorage().ref("post_media").child(filename);
      await storageRef.putFile(uploadUri);
      uploadMediaUrl = await storageRef.getDownloadURL();
      obj = {
        ...mediaObj,
        video: uploadMediaUrl,
      };
    }
    onComplete(obj);
  };
  const uploadThumnail = async (path, onComlpete) => {
    await ThreadManager.instance.uploadMedia(path, false, (url) => {
      if (url !== "error") {
        onComlpete(url);
      } else {
        dispatch(setIsAppLoader(false));
        Alert.alert("", "Error while uploading media");
      }
    });
  };
  return (
    <Container
      style={{
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
      }}
    >
      <StackHeader title={`What would you like to${"\n"}suggest?`} />
      <Content
        containerStyle={{
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : lightModeColors.background,
        }}
        contentContainerStyle={{
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : lightModeColors.background,
        }}
      >
        <View horizontal style={styles.changeFieldContainer}>
          {mediaObj?.uri ||
          mediaObj?.image ||
          mediaObj?.thumbnail ||
          typeof mediaObj == "string" ? (
            <View
              style={{
                height: normalized(70),
                width: normalized(60),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setMediaObj(null);
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: normalized(4),
                  zIndex: 1,
                }}
              >
                <Image
                  source={AppImages.Common.crossIcon}
                  style={{
                    height: normalized(18),
                    width: normalized(18),
                  }}
                />
              </TouchableOpacity>
              {mediaObj?.thumbnail ? (
                <TouchableOpacity
                  onPress={() => {
                    setOpenVideoModal(
                      mediaObj?.video?.uri
                        ? mediaObj?.video?.uri
                        : mediaObj?.video
                    );
                  }}
                  activeOpacity={1}
                >
                  <LoadingImage
                    isDisable={true}
                    source={{
                      uri: mediaObj?.thumbnail,
                    }}
                    style={styles.img}
                  />

                  <Image
                    source={AppImages.playbutton}
                    style={styles.playIcon}
                  />
                </TouchableOpacity>
              ) : (
                <LoadingImage
                  isDisable={true}
                  source={{ uri: mediaObj?.image || mediaObj?.uri || mediaObj }}
                  style={styles.img}
                />
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.unSelectedPic}
              onPress={() => {
                setOpenTypeModal(true);
              }}
            >
              <UploadIcon />
            </TouchableOpacity>
          )}
          <TextInput
            contentContainerStyle={{
              backgroundColor:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.background
                  : lightModeColors.background,
            }}
            inputStyle={{
              ...styles.input,
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
            value={name}
            placeholder="Enter name..."
            containerStyle={styles.inputContainer}
            onChange={setName}
          />
          <TextInput
            contentContainerStyle={{
              backgroundColor:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.background
                  : lightModeColors.background,
            }}
            inputStyle={{
              ...styles.input,
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
            value={description}
            placeholder="Enter description..."
            containerStyle={styles.inputContainer}
            onChange={setDescription}
          />
        </View>
        <View horizontal center>
          <Touchable style={styles.actionBtn} onPress={_handleSubmit}>
            <CheckIcon stroke="#6d14c4" />
          </Touchable>
        </View>
      </Content>
      {openTypeModal ? (
        <MediaTypeSelection
          onClose={() => {
            setOpenTypeModal(false);
          }}
          atMediaTypeSelection={(value) => {
            setOpenMediaModal({
              value: true,
              type: value,
            });
            setOpenTypeModal(false);
          }}
        />
      ) : null}
      {openMediaModal?.value ? (
        <MediaPickerModal
          openMediaModal={openMediaModal}
          onClose={() => {
            setOpenMediaModal({
              value: false,
              type: "",
            });
          }}
          onMediaSelection={(value) => {
            if (!value) {
              setOpenMediaModal({
                value: false,
                type: "",
              });
              return;
            }
            let mediaTypeObj = openMediaModal;

            let type =
              value?.type.includes("video") || mediaTypeObj?.type == "video"
                ? "video"
                : "image";
            if (type == "video") {
              dispatch(setIsAppLoader(true));
              createThumbnail({
                url: value?.uri,
                timeStamp: 10000,
              })
                .then(async (response) => {
                  await uploadThumnail(response?.path, (thumbnailUrl) => {
                    if (thumbnailUrl) {
                      dispatch(setIsAppLoader(false));
                      setMediaObj({
                        thumbnail: thumbnailUrl,
                        video: value,
                      });
                    }
                  });
                })
                .catch((err) => {
                  dispatch(setIsAppLoader(false));
                  console.log("printImgErr ", err);
                });
            } else {
              setMediaObj(value);
            }

            setOpenMediaModal({
              value: false,
              type: "",
            });
          }}
        />
      ) : null}
      {openVideoModal ? (
        <VideoPlayerModal
          item={{ url: openVideoModal }}
          onClose={() => {
            setOpenVideoModal("");
          }}
        />
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  changeFieldContainer: {
    width: "100%",
    borderRadius: 20,
    marginTop: 50,
  },
  indexCounter: {
    width: 30,
    height: 30,
    borderWidth: 2,
    paddingTop: 2,
    marginRight: 5,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    marginTop: 0,
    marginHorizontal: 5,
  },
  input: {
    height: 40,
  },
  addBtn: {
    padding: 20,
    marginTop: 20,
  },
  img: {
    width: normalized(50),
    height: normalized(50),
    borderRadius: normalized(50 / 2),
    marginVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: normalized(3),
  },
  playIcon: {
    height: normalized(15),
    width: normalized(15),
    position: "absolute",
    alignSelf: "center",
    top: normalized(20),
  },
  actionBtn: {
    margin: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  unSelectedPic: {
    borderColor: AppColors.blue.navy,
    borderWidth: 1,
    borderRadius: normalized(50 / 2),
    height: normalized(50),
    width: normalized(50),
    justifyContent: "center",
    alignItems: "center",
  },
});

const mapDispatchToProps = {
  suggestPost: suggestPostAction,
};

export default connect(null, mapDispatchToProps)(SuggestionAddScreen);

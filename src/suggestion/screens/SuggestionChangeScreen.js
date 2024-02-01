import { connect, useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import FastImage from "react-native-fast-image";
import FireAuth from "@react-native-firebase/auth";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FireStorage from "@react-native-firebase/storage";

import {
  View,
  Text,
  Content,
  Container,
  StackHeader,
  TextInput,
  Touchable,
} from "../../common";

import UploadIcon from "../../assets/icons/edit-upload-icon.svg";
import CheckIcon from "../../assets/icons/edit-check-icon.svg";
import * as Colors from "../../config/colors";

import { suggestPost as suggestPostAction } from "../redux/actions";
import useNotificationManger from "../../hooks/useNotificationManger";
import { Notification_Messages, Notification_Types } from "../../util/Strings";
import VideoPlayerModal from "../../common/VideoPlayerModal";
import { setIsAppLoader } from "../../redux/action/AppLogics";
import LoadingImage from "../../common/LoadingImage";
import { AppColors, AppImages, normalized } from "../../util/AppConstant";
import MediaTypeSelection from "../../common/MediaTypeSelection";
import MediaPickerModal from "../../common/MediaPickerModal";
import ThreadManager from "../../ChatModule/ThreadManger";
import { createThumbnail } from "react-native-create-thumbnail";
import { Routes } from "../../util/Route";

/* =============================================================================
<SuggestionChangeScreen />
============================================================================= */
const SuggestionChangeScreen = ({ route, navigation, suggestPost }) => {
  const dispatch = useDispatch();
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [openVideoModal, setOpenVideoModal] = useState("");
  const [openMediaModal, setOpenMediaModal] = useState({
    value: false,
    type: "",
  });
  const [mediaObj, setMediaObj] = useState(null);

  const { item, postTitle, postId, authorId } = route?.params;
  const [name, setName] = useState("");

  const [description, setDescription] = useState("");
  const disabled = name || description;
  const { suggestionAtPost } = useNotificationManger();
  const selector = useSelector((AppState) => AppState);

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
          type: "change",
          from: item,
          to: singleItem,
        },
        postId,
        postTitle,
        sender: {
          userId: FireAuth().currentUser.uid,
          username: FireAuth().currentUser.displayName,
        },
        authorId,
      };
      console.log("change Suggestion Payload ----> ", payload);
      await suggestPost(payload, async () => {
        if (authorId != selector?.Auth?.user?.uid) {
          await suggestionAtPost(
            {
              actionType: Notification_Types.suggestion,
              reciverId: authorId,
              extraData: { postId: postId },
              payload: payload,
            },
            Notification_Messages.changeSuggestion
          );
        }
        Alert.alert("Suggestion Successful", "Your suggestion has been send", [
          { text: "OK", onPress: () => navigation.navigate("HomeStack") },
        ]);
      });
    }
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
    <Container>
      <StackHeader title={`What would you like to${"\n"}suggest?`} />
      <Content>
        <View horizontal style={styles.item}>
          <View style={styles.indexCounter}>
            <Text sm bold primary>
              {item?.id === 0 ? 1 : item?.id + 1}
            </Text>
          </View>

          {item?.videoObj?.thumbnail || item?.video?.thumbnail ? (
            <TouchableOpacity
              onPress={() => {
                setOpenVideoModal(
                  item?.videoObj?.video
                    ? item?.videoObj?.video
                    : item?.video?.video
                );
              }}
              activeOpacity={1}
            >
              <LoadingImage
                isDisable={true}
                source={{
                  uri: item?.videoObj?.thumbnail || item?.video?.thumbnail,
                }}
                style={styles.img}
              />

              <Image source={AppImages.playbutton} style={styles.playIcon} />
            </TouchableOpacity>
          ) : (
            <LoadingImage
              isDisable={true}
              source={{ uri: item?.image }}
              style={styles.img}
            />
          )}
          <Text sm medium>
            {item?.name}
          </Text>
          <Text sm light>
            {item?.description}
          </Text>
        </View>
        <Text center bold style={styles.dividerTxt}>
          To
        </Text>
        <View horizontal style={styles.changeFieldContainer}>
          {mediaObj?.uri ||
          mediaObj?.image ||
          mediaObj?.thumbnail ||
          typeof mediaObj == "string" ? (
            <>
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
            </>
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
            value={name}
            inputStyle={styles.input}
            placeholder="Enter name..."
            containerStyle={styles.inputContainer}
            onChange={setName}
          />
          <TextInput
            value={description}
            inputStyle={styles.input}
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
            let mediaTypeObj = openMediaModal;
            if (!value) {
              navigation.navigate(Routes.Post.videoCreateScreen, {
                isImage: mediaTypeObj?.type == "photo",
                atBack: (obj) => {
                  if (obj?.thumbnail) {
                    setMediaObj(obj);
                  } else if (obj?.image) {
                    setMediaObj(obj?.image);
                  }
                },
              });
            } else {
              setOpenMediaModal({
                value: false,
                type: "",
              });
              let type = value?.type.includes("video") ? "video" : "image";
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
  item: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: "#999",
    justifyContent: "space-between",
  },
  img: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
  },
  indexCounter: {
    width: 30,
    height: 30,
    borderWidth: 2,
    paddingTop: 2,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerTxt: {
    marginVertical: 20,
  },
  changeFieldContainer: {
    width: "100%",
    borderRadius: 20,
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
    width: 66,
    height: 50,
    borderRadius: 55 / 2,
  },
  actionBtn: {
    marginHorizontal: 60,
    paddingHorizontal: 20,
    paddingVertical: 10,
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

export default connect(null, mapDispatchToProps)(SuggestionChangeScreen);

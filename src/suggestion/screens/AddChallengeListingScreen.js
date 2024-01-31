import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import { View, Container, TextInput, StackHeader, Text } from "../../common";
import DeleteIcon from "../../assets/icons/edit-trash-icon.svg";
import AddIcon from "../../assets/icons/edit-plus-square.svg";
import { connect, useDispatch, useSelector } from "react-redux";
import UploadIcon from "../../assets/icons/edit-upload-icon.svg";
import { getLoading } from "../redux/selectors";
import { RadioGroup } from "react-native-radio-buttons-group";
import CheckBox from "@react-native-community/checkbox";
import { challengePost, createPost } from "../../home/redux/actions";
import { updateHomeData } from "../../home/redux/appLogics";
import { UPDATE_CHALLENGE_FEATURE } from "../redux/constants";
import { Notification_Types } from "../../util/Strings";
import useNotificationManger from "../../hooks/useNotificationManger";
import { setIsAppLoader } from "../../redux/action/AppLogics";
import VideoPlayerModal from "../../common/VideoPlayerModal";
import MediaPickerModal from "../../common/MediaPickerModal";
import ThreadManager from "../../ChatModule/ThreadManger";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../../util/AppConstant";
import LoadingImage from "../../common/LoadingImage";
import MediaTypeSelection from "../../common/MediaTypeSelection";
import { Routes } from "../../util/Route";

const AddChallengeListingScreen = ({ challengePost, navigation, route }) => {
  const post = route.params.post;
  const [openTypeModal, setOpenTypeModal] = useState(false);
  const [itemList, setItemList] = useState([
    {
      name: "",
      image: "",
      description: "",
    },
  ]);
  const { challengeAtPost } = useNotificationManger();
  const [isShowAddBtn, setShowAddBtn] = useState(true);
  const [openVideoModal, setOpenVideoModal] = useState("");
  const [openMediaModal, setOpenMediaModal] = useState({
    value: false,
    data: null,
    index: -1,
  });

  const [radioButtons, setRadioButtons] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Ascending List",
      value: "ascendinglist",
      borderColor: "#6d14c4",
      selected: true,
    },
    {
      id: "2",
      label: "Descending List",
      value: "descendinglist",
      borderColor: "#6d14c4",
    },
  ]);
  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState);

  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const _handleAdd = () => {
    let newArr = [...itemList];
    if (newArr?.length >= 7) {
      setShowAddBtn(false);
    } else {
      newArr.push({
        name: "",
        image: "",
        description: "",
      });
      setShowAddBtn(true);
      setItemList(newArr);
    }
  };
  const _handleRemove = (index) => {
    let newArr = [];
    itemList.map((el, i) => {
      if (i !== index) {
        newArr.push(el);
      }
    });
    setItemList(newArr);
    if (newArr?.length < 10) {
      setShowAddBtn(true);
    } else {
      setShowAddBtn(false);
    }
  };
  const _handleSubmit = async () => {
    let isErrorFound = false;
    if (itemList?.length > 0) {
      itemList.map((el) => {
        if (!el?.name || !el?.description) {
          isErrorFound = true;
        }
      });
    }
    if (isErrorFound) {
      return;
    }
    let values = {};
    values["order"] = radioButtons.find((item) => item.selected).id;
    values["isNumberShowInItems"] = toggleCheckBox;
    values["items"] = itemList?.length > 0 ? fetchItemList() : [];

    dispatch(setIsAppLoader(true));
    await challengePost(values, post, async (response) => {
      let authorId = post?.author?.userId || post?.author;
      if (response?.status && authorId != selector?.Auth?.user?.uid) {
        await challengeAtPost({
          actionType: Notification_Types.challenge,
          reciverId: authorId,
          extraData: { postId: post?.id },
        });
      }
    });
    dispatch(setIsAppLoader(false));
    UPDATE_CHALLENGE_FEATURE.isUpdate = true;
    dispatch(updateHomeData(!selector.Home.updateHomeData));
    navigation.goBack();
  };

  const fetchItemList = () => {
    let newArr = [];
    itemList.map((el, i) => {
      if (el?.video?.video?.uri || el?.video?.uri || el?.videoObj) {
        newArr.push({
          id: i,
          name: el?.name,
          description: el?.description,
          videoObj: el?.video || el?.videoObj,
        });
      } else {
        newArr.push({
          id: i,
          name: el?.name,
          description: el?.description,
          image: el?.image,
        });
      }
    });
    return newArr;
  };

  const onPressRadioButton = (radioButtonsArray) => {
    setRadioButtons(radioButtonsArray);
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

  const updateStates = (type, index, value) => {
    const updatedArray = [...itemList];
    let previousObj = updatedArray[index];
    let newObj = {};

    newObj = {
      ...previousObj,
      [`${type}`]: value,
    };
    updatedArray[index] = newObj;
    setItemList(updatedArray);
  };
  return (
    <Container style={styles.content}>
      <StackHeader />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? hv(35) : hv(30)}
      >
        <ScrollView
          style={styles.containerStyle}
          showsVerticalScrollIndicator={false}
        >
          {itemList.length > 0
            ? itemList.map((item, index) => (
                <View key={index} style={styles.dynamicFieldContainer}>
                  {(item?.image && item?.image !== "a") ||
                  item?.video?.thumbnail ||
                  item?.videoObj?.thumbnail ? (
                    <>
                      {item?.video || item?.videoObj ? (
                        <TouchableOpacity
                          onPress={() => {
                            setOpenVideoModal(
                              item?.video?.video?.uri
                                ? item?.video?.video?.uri
                                  ? el?.video?.uri
                                  : el?.video?.uri
                                : item?.videoObj?.video
                            );
                          }}
                        >
                          <LoadingImage
                            isDisable={true}
                            source={
                              item?.image?.base64
                                ? item?.image
                                : item?.video?.thumbnail
                                ? { uri: item?.video?.thumbnail }
                                : { uri: item?.image }
                            }
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
                          source={
                            item?.image?.base64
                              ? item?.image
                              : item?.video?.thumbnail
                              ? { uri: item?.video?.thumbnail }
                              : { uri: item?.image }
                          }
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

                  <View
                    style={{
                      width: "70%",
                      height: normalized(135),
                      marginVertical: normalized(10),
                    }}
                  >
                    <TextInput
                      value={item?.name}
                      inputStyle={styles.input}
                      placeholder="Enter name..."
                      containerStyle={styles.inputContainer}
                      errorText={
                        item?.name?.length == 0 ? "!Empty Field" : null
                      }
                      onChange={(val) => {
                        updateStates("name", index, val);
                      }}
                    />
                    <TextInput
                      value={item?.description}
                      inputStyle={styles.input}
                      placeholder="Enter description..."
                      containerStyle={styles.inputContainer}
                      errorText={
                        item?.description?.length == 0 ? "!Empty Field" : null
                      }
                      onChange={(des) => {
                        updateStates("description", index, des);
                      }}
                    />
                  </View>

                  <TouchableOpacity
                    center
                    style={styles.deleteBtn}
                    onPress={() => {
                      _handleRemove(index);
                    }}
                  >
                    <DeleteIcon />
                  </TouchableOpacity>
                </View>
              ))
            : null}

          <View
            style={{
              alignItems: "flex-start",
              marginVertical: 10,
            }}
          >
            <RadioGroup
              radioButtons={radioButtons}
              onPress={onPressRadioButton}
              layout="row"
              containerStyle={{
                paddingHorizontal: 10,
                paddingVertical: 25,
              }}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: normalized(18),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {Platform.OS == "android" ? (
                <TouchableOpacity
                  onPress={() => {
                    setToggleCheckBox(!toggleCheckBox);
                  }}
                >
                  <View
                    style={{
                      width: 25,
                      height: 25,
                      borderColor: "#6d14c4",

                      borderWidth: 1,
                      borderRadius: 5,
                      marginEnd: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {toggleCheckBox && (
                      <View
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: "#6d14c4",
                          borderRadius: 5,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      ></View>
                    )}
                  </View>
                </TouchableOpacity>
              ) : (
                <CheckBox
                  value={toggleCheckBox}
                  tintColor="#6d14c4"
                  onCheckColor="#6d14c4"
                  onTintColor="#6d14c4"
                  tintColors={{ true: "black", false: "#a9a9a9" }}
                  lineWidth={2}
                  onFillColor="#6d14c4"
                  style={{
                    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
                  }}
                  boxType={"circle"}
                  onValueChange={(newValue) => {
                    setToggleCheckBox(newValue);
                  }}
                />
              )}

              <Text
                style={{
                  fontSize: 14,
                  marginStart: 5,
                  color: AppColors.black.black,
                }}
              >
                Numbered List
              </Text>
            </View>
          </View>

          {isShowAddBtn ? (
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => {
                _handleAdd();
              }}
            >
              <AddIcon />
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              _handleSubmit();
            }}
            style={styles.uploadBtnCont}
          >
            <Text style={styles.uploadTxt}>Challenge</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {openTypeModal ? (
        <MediaTypeSelection
          onClose={() => {
            setOpenTypeModal(false);
          }}
          atMediaTypeSelection={(value) => {
            setOpenTypeModal(false);
            setOpenMediaModal({
              value: true,
              data: null,
              type: value,
            });
          }}
        />
      ) : null}
      {openMediaModal?.value ? (
        <MediaPickerModal
          openMediaModal={openMediaModal}
          onClose={() => {
            setOpenMediaModal({
              value: false,
              data: null,
              index: -1,
            });
          }}
          onMediaSelection={(value) => {
            if (!value) {
              let mediaTypeObj = openMediaModal;
              navigation.navigate(Routes.Post.videoCreateScreen, {
                isImage: mediaTypeObj?.type == "photo",
                atBack: (obj) => {
                  if (obj?.thumbnail) {
                    updateStates("video", mediaTypeObj?.index, obj);
                  } else if (obj?.image) {
                    updateStates("image", mediaTypeObj?.index, obj);
                  }
                },
              });
            } else {
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
                        updateStates(type, openMediaModal?.index, {
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
                updateStates(type, openMediaModal?.index, value);
              }
            }
            setOpenMediaModal({
              value: false,
              data: null,
              index: -1,
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

const mapStateToProps = (state) => ({
  loading: getLoading(state),
});

const mapDispatchToProps = {
  challengePost: challengePost,
  createPost: createPost,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddChallengeListingScreen);

const styles = StyleSheet.create({
  dynamicFieldContainer: {
    width: "100%",
    borderRadius: 20,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "space-between",
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
  errorText: {
    color: "#6d14c4",
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
    alignItems: "center",
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
  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  containerStyle: {
    flex: 1,
    marginHorizontal: AppHorizontalMargin,
    paddingTop: hv(20),
  },
  uploadBtnCont: {
    height: normalized(50),
    backgroundColor: AppColors.blue.navy,
    borderRadius: normalized(40),
    width: normalized(180),
    marginVertical: hv(30),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadTxt: {
    fontSize: normalized(16),
    color: AppColors.white.white,
    fontWeight: "600",
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
  playIcon: {
    height: normalized(15),
    width: normalized(15),
    position: "absolute",
    alignSelf: "center",
    top: normalized(20),
  },
});

import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { createThumbnail } from "react-native-create-thumbnail";
import DeleteIcon from "../../assets/icons/edit-trash-icon.svg";
import AddIcon from "../../assets/icons/edit-plus-square.svg";
import { useToast } from "react-native-toast-notifications";
import { createPost as createPostAction } from "../redux/actions";
import { updatePost as updatePostAction } from "../redux/actions";
import { createAnnouncementPost as createAnnouncementPostAction } from "../redux/actions";
import { RadioGroup } from "react-native-radio-buttons-group";
import CheckBox from "@react-native-community/checkbox";
import UploadIcon from "../../assets/icons/edit-upload-icon.svg";
import { setPostRefresh } from "../redux/appLogics";
import { makeid } from "../../util/functions";
import {
  setAllUserFCMToken,
  setCreatePostFailError,
  setDraftPost,
  setIsAppLoader,
  setShowToast,
} from "../../redux/action/AppLogics";
import AlertModal from "../../common/AlertModal";
import { saveUserDraftPost } from "../../util/helperFun";
import { useIsFocused } from "@react-navigation/native";
import TextInputComponent from "../../common/TextInputComponent";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  ScreenSize,
  darkModeColors,
  hv,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import useNotificationManger from "../../hooks/useNotificationManger";
import CustomHeader from "../../common/CommonHeader";
import CustomDropDown from "../../common/CustomDropDown";
import { fetchPostData } from "../../network/Services/ProfileServices";
import LoadingImage from "../../common/LoadingImage";
import { View } from "react-native";
import { AppStyles } from "../../util/AppStyles";
import { TextInput } from "../../common";
import MediaPickerModal from "../../common/MediaPickerModal";
import VideoPlayerModal from "../../common/VideoPlayerModal";
import ThreadManager from "../../ChatModule/ThreadManger";
import MediaTypeSelection from "../../common/MediaTypeSelection";
import { Theme_Mode } from "../../util/Strings";

/* =============================================================================
<PostCreateScreen />
============================================================================= */
const PostCreateScreen = ({
  navigation,
  createPost,
  route,
  createAnnouncementPost,
  updatePost,
}) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const { generateMultiplePushNotification, userSubscribed } =
    useNotificationManger();
  const selector = useSelector((AppState) => AppState);

  const [openTypeModal, setOpenTypeModal] = useState({
    value: false,
    index: -1,
  });
  const isFocused = useIsFocused();
  const [openVideoModal, setOpenVideoModal] = useState("");
  const [selectedcategory, setSelectedCategory] = useState("");
  const selectedCatRef = useRef("");
  const [categoryError, setCategoryError] = useState("");
  const dispatch = useDispatch();
  const [itemList, setItemList] = useState([]);
  const [title, setTitle] = useState("");
  const title2 = useRef("");
  const [titleError, setTitleError] = useState("");
  const [des, setDes] = useState("");
  const des2 = useRef("");
  const [desError, setDesError] = useState("");
  const toast = useToast();
  const isBtnActive = useRef(false);
  const [radioButtons, setRadioButtons] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Ascending List",
      value: "ascendinglist",
      borderColor: "#6d14c4",
      selected: true,
      labelStyle: {
        color: "black",
      },
    },
    {
      id: "2",
      label: "Descending List",
      value: "descendinglist",
      borderColor: "#6d14c4",
      labelStyle: {
        color: "black",
      },
    },
  ]);
  const itemsList = useRef([]);

  const [openMediaModal, setOpenMediaModal] = useState({
    value: false,
    index: -1,
  });
  const [alertModal, setAlertModal] = useState({
    value: false,
    data: null,
    message: "",
  });
  const [isShowAddBtn, setShowAddBtn] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  useEffect(() => {
    const backAction = () => {
      if (route?.params?.from !== "EditPost") {
        fetchCurrentStates();
      } else {
        navigation?.goBack();
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => {
      backHandler.remove();
      clearStates();
    };
  }, []);
  useEffect(() => {
    if (route?.params?.isEdit && isFocused) {
      initialFun(route?.params?.data?.id);
    }
    return () => {
      clearStates();
    };
  }, [isFocused]);

  const initialFun = async (postId) => {
    let data = route?.params?.data;
    if (postId) {
      dispatch(setIsAppLoader(true));
      await fetchPostData(postId, (res) => {
        data = res;
      });
      dispatch(setIsAppLoader(false));
    }
    if (data) {
      setSelectedCategory(data?.category ? data?.category : "");
      selectedCatRef.current = data?.category ? data?.category : "";
      if (data?.isNumberShowInItems) {
        setToggleCheckBox(true);
      }
      if (data?.order == "2") {
        setRadioButtons([
          {
            id: "1", // acts as primary key, should be unique and non-empty string
            label: "Ascending List",
            value: "ascendinglist",
            borderColor: "#6d14c4",
          },
          {
            id: "2",
            label: "Descending List",
            value: "descendinglist",
            borderColor: "#6d14c4",
            selected: true,
          },
        ]);
      }
      setTitle(data?.title ? data?.title : "");
      title2.current = data?.title ? data?.title : "";
      setDes(data?.description ? data?.description : "");
      des2.current = data?.description ? data?.description : "";
      setItemList(data?.items);
      itemsList.current = data?.items;
    }
  };
  const clearStates = () => {
    title2.current = "";
    des2.current = "";
    setItemList([]);
    itemsList.current = [];
    setTitle("");
    setDes("");
    setSelectedCategory("");
    selectedCatRef.current = "";
  };
  const fetchCurrentStates = () => {
    let obj = {
      items: itemsList.current,
      title: title2.current,
      description: des2.current,
      isNumberShowInItems: toggleCheckBox,
      order: radioButtons.find((item) => item.selected).id,
      category: selectedCatRef.current,
    };
    if (
      !obj?.category &&
      !obj?.description &&
      !obj?.isNumberShowInItems &&
      obj?.items?.length == 0 &&
      !obj?.title
    ) {
      navigation?.goBack();
      return;
    }
    if (route?.params?.isEdit && route?.params?.data) {
      if (
        JSON.stringify(route?.params?.data) ===
        JSON.stringify({
          ...obj,
          draftPostId: route?.params?.data?.draftPostId,
        })
      ) {
        navigation?.goBack();
      } else {
        setAlertModal({
          value: true,
          data: obj,
          message: "Do you want to update this post in your draft?",
        });
      }
    } else {
      let isOpenAlert = false;
      if (obj?.title?.length > 0) {
        isOpenAlert = true;
      } else if (obj?.description?.length > 0) {
        isOpenAlert = true;
      } else if (obj?.isNumberShowInItems) {
        isOpenAlert = true;
      } else if (obj?.items?.length > 0) {
        isOpenAlert = true;
      }

      if (isOpenAlert) {
        setAlertModal({
          value: true,
          data: obj,
          message: "Do you want to save this post in your draft?",
        });
      } else {
        navigation?.goBack();
      }
    }
  };
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
    isBtnActive.current = true;
    if (selectedcategory == "") {
      isBtnActive.current = false;
      setCategoryError("Please select Category");
    }
    if (title == "") {
      isBtnActive.current = false;
      setTitleError("!Empty Field");
    }
    if (des == "") {
      isBtnActive.current = false;
      setDesError("!Empty Field");
    }

    if (
      title?.length == 0 ||
      des?.length == 0 ||
      selectedcategory?.length == 0
    ) {
      isBtnActive.current = false;
      return;
    }
    let isErrorFound = false;
    if (itemList?.length > 0) {
      itemList.map((el) => {
        if (!el?.name || !el?.description) {
          isErrorFound = true;
        }
      });
    }
    if (isErrorFound) {
      isBtnActive.current = false;
      return;
    }
    let values = {};
    values["title"] = title;
    values["description"] = des;
    values["order"] = radioButtons.find((item) => item.selected).id;
    values["isNumberShowInItems"] = toggleCheckBox;
    values["category"] = selectedcategory;
    values["items"] = itemList?.length > 0 ? fetchItemList() : [];
    dispatch(setIsAppLoader(true));
    if (route.params?.isEdit && route?.params?.data?.author?.userId) {
      values["author"] = route?.params?.data?.author;
      values["id"] = route?.params?.id;
      await updatePost(values);
    } else if (route.params && route.params.isAnnouncement) {
      await createAnnouncementPost(values, async (response) => {
        if (response?.status && response?.message) {
          let isUserFetch = false;
          await userSubscribed(selector?.Auth?.user?.uid, async (res) => {
            if (res?.length > 0 && !isUserFetch) {
              dispatch(setAllUserFCMToken(res));
              setTimeout(async () => {
                await generateMultiplePushNotification({
                  receiverList: res,
                  extraData: { postId: response?.message.toString() },
                });
              }, 1500);
            }
            isUserFetch = true;
          });
        }
      });
    } else {
      await createPost(values);
    }
    if (selector?.DraftPost?.createPostAPIFail !== "") {
      updateDraftFun(values);
    } else {
      dispatch(setPostRefresh(!selector.Home.isPostRefresh));
      navigation.goBack();
    }
    clearStates();
    setTimeout(() => {
      isBtnActive.current = false;
      // setIsLoading(false);
      dispatch(setIsAppLoader(false));
    }, 800);
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
  const updateDraftFun = async (obj) => {
    let draftArr;
    if (route?.params?.isEdit) {
      let findInexValue = selector?.DraftPost?.draftPost.findIndex(
        (el) => el.draftPostId == route?.params?.data?.draftPostId
      );
      if (findInexValue != -1) {
        let previousData = [...selector?.DraftPost?.draftPost];
        previousData[findInexValue] = {
          ...obj,
          draftPostId: route?.params?.data?.draftPostId,
        };
        draftArr = previousData;
      }
    } else {
      draftArr = [
        ...selector?.DraftPost?.draftPost,
        { ...obj, draftPostId: makeid(7) },
      ];
    }
    dispatch(setDraftPost(draftArr));
    await saveUserDraftPost(draftArr);
    dispatch(setCreatePostFailError(""));
    toast.show(
      route?.params?.isEdit
        ? "Post update in your draft list"
        : "Post save in your draft list"
    );
    dispatch(setPostRefresh(!selector.Home.isPostRefresh));
    navigation.goBack();
  };
  const onPressRadioButton = (radioButtonsArray) => {
    setRadioButtons(radioButtonsArray);
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
    itemsList.current = updatedArray;
    setItemList(updatedArray);
  };
  return (
    <View
      style={{
        ...AppStyles.MainStyle,
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
      }}
    >
      <CustomHeader
        isStatusBar={true}
        atBackPress={() => {
          if (route?.params?.from !== "EditPost") {
            fetchCurrentStates();
          } else {
            navigation.goBack();
          }
        }}
        leftIcon={AppImages.Common.backArrow}
        logo={AppImages.Common.appLogo}
        mainStyle={{ backgroundColor: AppColors.blue.royalBlue }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? hv(35) : hv(30)}
      >
        <ScrollView
          style={styles.containerStyle}
          showsVerticalScrollIndicator={false}
        >
          <TextInputComponent
            mainContainer={{ marginHorizontal: normalized(15) }}
            value={title}
            maxLength={55}
            setValue={(val) => {
              setTitleError("");
              setTitle(val);
              title2.current = val;
            }}
            placeholder="What's your List Title..."
            error={titleError}
          />

          <TextInputComponent
            mainContainer={{ marginHorizontal: normalized(15) }}
            value={des}
            setValue={(val) => {
              setDesError("");
              setDes(val);
              des2.current = val;
            }}
            placeholder="Post description..."
            error={desError}
          />
          <CustomDropDown
            dropDownStyle={{
              marginHorizontal: AppHorizontalMargin,
              marginVertical: 10,
            }}
            placeHolder={"Select Category"}
            atSelect={(val) => {
              setSelectedCategory(val?.name);
              selectedCatRef.current = val?.name;
              setCategoryError("");
            }}
            selected={selectedcategory?.name || selectedcategory}
            list={selector?.sliceReducer?.categoriesList}
            error={categoryError}
          />

          <View>
            {itemList?.length > 0
              ? itemList.map((item, index) => {
                  return !item ? null : (
                    <View
                      key={String(index)}
                      style={styles.dynamicFieldContainer}
                    >
                      {(item?.image && item.image !== "a") ||
                      item?.video?.thumbnail ||
                      item?.videoObj?.thumbnail ? (
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
                              if (
                                item?.video?.thumbnail ||
                                item?.videoObj?.thumbnail
                              ) {
                                updateStates(
                                  item?.video?.thumbnail ? "video" : "videoObj",
                                  index,
                                  null
                                );
                              } else {
                                updateStates("image", index, "");
                              }
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
                          {item?.video || item?.videoObj ? (
                            <TouchableOpacity
                              onPress={() => {
                                setOpenVideoModal(
                                  item?.video?.video?.uri
                                    ? item?.video?.video?.uri
                                    : item?.video?.uri
                                    ? item?.video?.uri
                                    : item?.videoObj?.video
                                );
                              }}
                            >
                              <LoadingImage
                                isDisable={true}
                                source={{
                                  uri:
                                    item?.video?.thumbnail ||
                                    item?.videoObj?.thumbnail,
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
                              isDisable={false}
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
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={styles.unSelectedPic}
                          onPress={() => {
                            setOpenTypeModal({ value: true, index: index });
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
                          inputStyle={{
                            ...styles.input,
                            color:
                              themeType == Theme_Mode.isDark
                                ? darkModeColors.text
                                : lightModeColors.text,
                          }}
                          contentContainerStyle={{
                            backgroundColor:
                              themeType == Theme_Mode.isDark
                                ? darkModeColors.background
                                : lightModeColors.background,
                          }}
                          placeholder="Enter name..."
                          containerStyle={{
                            ...styles.inputContainer,
                          }}
                          errorText={
                            item?.name?.length == 0 ? "!Empty Field" : null
                          }
                          onChange={(val) => {
                            updateStates("name", index, val);
                          }}
                        />
                        <TextInput
                          value={item?.description}
                          inputStyle={{
                            ...styles.input,
                            color:
                              themeType == Theme_Mode.isDark
                                ? darkModeColors.text
                                : lightModeColors.text,
                          }}
                          contentContainerStyle={{
                            backgroundColor:
                              themeType == Theme_Mode.isDark
                                ? darkModeColors.background
                                : lightModeColors.background,
                          }}
                          placeholder="Enter description..."
                          containerStyle={styles.inputContainer}
                          errorText={
                            item?.description?.length == 0
                              ? "!Empty Field"
                              : null
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
                  );
                })
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
                    color:
                      themeType == Theme_Mode.isDark
                        ? darkModeColors.text
                        : lightModeColors.text,
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
              disabled={isBtnActive.current}
              style={styles.uploadBtnCont}
            >
              <Text style={styles.uploadTxt}>Upload</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {alertModal?.value ? (
        <AlertModal
          visible={alertModal?.value}
          multipleBtn={true}
          atLeftBtn={() => {
            clearStates();
            setAlertModal({ value: false, data: null, message: "" });
            dispatch(setPostRefresh(!selector.Home.isPostRefresh));
            navigation.goBack();
          }}
          leftBtnLabel={"No"}
          rightBtnLabel={"Yes"}
          onPress={() => {
            let obj = alertModal?.data;
            updateDraftFun(obj);
            setAlertModal({ value: false, data: null, message: "" });
          }}
          message={alertModal?.message}
        />
      ) : null}
      {openTypeModal?.value ? (
        <MediaTypeSelection
          onClose={() => {
            setOpenTypeModal({ value: false, index: -1 });
          }}
          atMediaTypeSelection={(value) => {
            setOpenTypeModal({ value: false, index: -1 });
            setOpenMediaModal({
              value: true,
              type: value,
              index: openTypeModal?.index,
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
              type: "",
              index: -1,
            });
          }}
          onMediaSelection={(value) => {
            console.log("value------>", value);
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
                      updateStates(type, mediaTypeObj?.index, {
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
              updateStates(type, mediaTypeObj?.index, value);
            }

            setOpenMediaModal({
              value: false,
              type: "",
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
    </View>
  );
};

const styles = StyleSheet.create({
  dynamicFieldContainer: {
    width: ScreenSize.width - normalized(Platform.OS == "ios" ? 30 : 40),
    borderRadius: normalized(10),
    alignItems: "center",
    height: normalized(140),
    marginTop: normalized(7),
    justifyContent: "space-between",
    flexDirection: "row",
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
    marginVertical: 10,
    marginHorizontal: 5,
  },
  input: {
    width: normalized(150),
    height: 40,
  },
  addBtn: {
    marginTop: 20,
    alignSelf: "center",
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
    padding: normalized(5),
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

const mapStateToProps = (state) => ({
  // loading: getLoading(state),
});

const mapDispatchToProps = {
  createPost: createPostAction,
  createAnnouncementPost: createAnnouncementPostAction,
  updatePost: updatePostAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostCreateScreen);

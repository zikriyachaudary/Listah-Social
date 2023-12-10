import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { connect, useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import {
  BackHandler,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Formik, FieldArray } from "formik";

import {
  View,
  Button,
  Content,
  Container,
  TextInput,
  Touchable,
  StackHeader,
  ImagePickerButton,
  Text,
} from "../../common";
import DeleteIcon from "../../assets/icons/edit-trash-icon.svg";
import AddIcon from "../../assets/icons/edit-plus-square.svg";
import { useToast } from "react-native-toast-notifications";
import { createPost as createPostAction } from "../redux/actions";
import { createAnnouncementPost as createAnnouncementPostAction } from "../redux/actions";
import { RadioGroup } from "react-native-radio-buttons-group";
import CheckBox from "@react-native-community/checkbox";
import { setPostRefresh } from "../redux/appLogics";
import { makeid } from "../../util/functions";
import {
  setAllUserFCMToken,
  setCreatePostFailError,
  setDraftPost,
} from "../../redux/action/AppLogics";
import AlertModal from "../../common/AlertModal";
import { saveUserDraftPost } from "../../util/helperFun";
import { useIsFocused } from "@react-navigation/native";
import TextInputComponent from "../../common/TextInputComponent";
import {
  AppColors,
  AppImages,
  ScreenSize,
  hv,
  normalized,
} from "../../util/AppConstant";
import useNotificationManger from "../../hooks/useNotificationManger";
import CustomHeader from "../../common/CommonHeader";

/* =============================================================================
<PostCreateScreen />
============================================================================= */
const PostCreateScreen = ({
  navigation,
  loading,
  createPost,
  route,
  createAnnouncementPost,
}) => {
  const { generateMultiplePushNotification, userSubscribed } =
    useNotificationManger();
  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState);
  const [title, setTitle] = useState("");
  const title2 = useRef("");
  const [titleError, setTitleError] = useState("");
  const [des, setDes] = useState("");
  const des2 = useRef("");
  const [desError, setDesError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const isFocused = useIsFocused();
  const formikRef = useRef();
  const [initialValues, setInitialValues] = useState({
    items: [
      {
        name: "",
        image: "",
        description: "",
      },
    ],
  });

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
  const initialState = useRef({
    items: [
      {
        name: "",
        image: "",
        description: "",
      },
    ],
  });

  const [alertModal, setAlertModal] = useState({
    value: false,
    data: null,
    message: "",
  });
  const [isShowAddBtn, setShowAddBtn] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  useEffect(() => {
    formikRef.current?.resetForm();
    let data = route?.params?.data;
    if (isFocused && route?.params?.isEdit && data) {
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
      let makeObj = {
        items:
          data?.items?.length > 0
            ? data?.items
            : [
                {
                  name: "",
                  image: "",
                  description: "",
                },
              ],
      };
      setInitialValues(makeObj);
    }
    return () => {
      clearStates();
    };
  }, [isFocused]);
  const clearStates = () => {
    title2.current = "";
    des2.current = "";
    formikRef.current?.resetForm();
    setInitialValues({
      items: [
        {
          name: "",
          image: "",
          description: "",
        },
      ],
    });
    setTitle("");
    setDes("");
  };
  useEffect(() => {
    const backAction = () => {
      fetchCurrentStates();
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
  const fetchCurrentStates = () => {
    let obj = {
      ...initialState.current,
      title: title2.current,
      description: des2.current,
      isNumberShowInItems: toggleCheckBox,
      order: radioButtons.find((item) => item.selected).id,
    };
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
      } else if (
        obj?.items[0]?.name?.length > 0 ||
        obj?.items[0]?.description?.length > 0 ||
        obj?.items[0]?.image !== ""
      ) {
        isOpenAlert = true;
      } else if (
        initialState.current?.items?.length == 0 &&
        (initialState.current?.items[0]?.description?.length > 0 ||
          initialState.current?.items[0]?.title?.length > 0)
      ) {
        isOpenAlert = true;
      } else if (obj?.isNumberShowInItems) {
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
  const _handleAdd = (arrayHelpers) => {
    let arraySize = arrayHelpers.form.values.items.length + 1;
    arrayHelpers.push({
      name: "",
      image: "",
      description: "",
    });
    if (arraySize == 10 || arraySize > 10) {
      setShowAddBtn(false);
    } else {
      setShowAddBtn(true);
    }
  };

  const _handleRemove = (arrayHelpers, index) => {
    let arraySize = arrayHelpers.form.values.items.length - 1;
    arrayHelpers.remove(index);
    if (arraySize < 10) {
      setShowAddBtn(true);
    } else {
      setShowAddBtn(false);
    }
  };
  const _handleSubmit = async (values, { resetForm }) => {
    if (title == "") {
      setTitleError("!Empty Field");
    }
    if (des == "") {
      setDesError("!Empty Field");
    }
    if (title?.length == 0 || des?.length == 0) {
      return;
    }
    setIsLoading(true);

    values["title"] = title;
    values["description"] = des;
    values["order"] = radioButtons.find((item) => item.selected).id;
    values["isNumberShowInItems"] = toggleCheckBox;
    if (route.params && route.params.isAnnouncement) {
      await createAnnouncementPost(values, async (response) => {
        if (response?.status) {
          let isUserFetch = false;

          await userSubscribed(selector?.Auth?.user?.uid, async (res) => {
            if (res?.length > 0 && !isUserFetch) {
              dispatch(setAllUserFCMToken(res));
              setTimeout(async () => {
                await generateMultiplePushNotification({
                  receiverList: res,
                  extraData: { postId: response?.message.toString() },
                });
              }, 800);
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
      // route.params.postRefresh();
      dispatch(setPostRefresh(!selector.Home.isPostRefresh));
      resetForm();
      navigation.goBack();
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
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

    setAlertModal({ value: false, data: null, message: "" });
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

  return (
    <Container style={styles.content}>
      <CustomHeader
        atBackPress={() => {
          fetchCurrentStates();
        }}
        leftIcon={AppImages.Common.backArrow}
        isStatusBar={true}
        logo={AppImages.Common.appLogo}
        mainStyle={{ backgroundColor: AppColors.blue.royalBlue }}
      />
      {/* <StackHeader
        onLeftPress={() => {
          fetchCurrentStates();
        }}
      /> */}
      <View style={{ marginVertical: hv(8) }} />
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

      <Formik
        enableReinitialize={true}
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={_handleSubmit}
      >
        {({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
          <FieldArray
            name="items"
            render={(arrayHelpers, i) => {
              let isSelect = false;

              initialState.current = values;
              return (
                <Content contentContainerStyle={styles.content}>
                  <View key={i} center>
                    {values.items && values.items.length > 0
                      ? values.items.map((item, index) => (
                          <View
                            horizontal
                            key={index}
                            style={styles.dynamicFieldContainer}
                          >
                            {item?.image && item.image !== "a" ? (
                              <FastImage
                                style={styles.img}
                                source={item?.image}
                              />
                            ) : (
                              <ImagePickerButton
                                btnSize="small"
                                style={styles.img}
                                onImageSelect={(img) => {
                                  setFieldValue(`items.${index}.image`, img);
                                }}
                              />
                            )}

                            <View
                              style={{
                                width: "70%",
                                height: hv(120),
                              }}
                            >
                              <TextInput
                                value={item.name}
                                inputStyle={styles.input}
                                placeholder="Enter name..."
                                containerStyle={styles.inputContainer}
                                errorText={
                                  errors?.items && errors?.items[index]
                                    ? errors?.items[index].name
                                    : null
                                }
                                onChange={handleChange(`items.${index}.name`)}
                              />
                              <TextInput
                                value={item.description}
                                inputStyle={styles.input}
                                placeholder="Enter description..."
                                containerStyle={styles.inputContainer}
                                errorText={
                                  errors?.items && errors?.items[index]
                                    ? errors?.items[index].description
                                    : null
                                }
                                onChange={handleChange(
                                  `items.${index}.description`
                                )}
                              />
                            </View>

                            <Touchable
                              center
                              style={styles.deleteBtn}
                              onPress={() => _handleRemove(arrayHelpers, index)}
                            >
                              <DeleteIcon />
                            </Touchable>
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
                              console.log("print ---- > ", isSelect);
                              if (isSelect) {
                                isSelect = false;
                                setToggleCheckBox(isSelect);
                              } else {
                                isSelect = true;
                                setToggleCheckBox(isSelect);
                              }
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
                              {isSelect && (
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
                              console.log("newValue------>", newValue);
                              // setShhowModal(false)
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
                      <Touchable
                        style={styles.addBtn}
                        onPress={() => _handleAdd(arrayHelpers)}
                      >
                        <AddIcon />
                      </Touchable>
                    ) : null}
                  </View>
                  <View center>
                    <Button
                      title="Upload"
                      loading={isLoading}
                      onPress={handleSubmit}
                    />
                  </View>
                </Content>
              );
            }}
          />
        )}
      </Formik>
      {alertModal?.value ? (
        <AlertModal
          visible={alertModal?.value}
          multipleBtn={true}
          atLeftBtn={() => {
            setAlertModal({ value: false, data: null, message: "" });
            dispatch(setPostRefresh(!selector.Home.isPostRefresh));
            formikRef.current?.resetForm();
            navigation.goBack();
          }}
          leftBtnLabel={"No"}
          rightBtnLabel={"Yes"}
          onPress={() => {
            updateDraftFun(alertModal?.data);
          }}
          message={alertModal?.message}
        />
      ) : null}
    </Container>
  );
};

const schema = yup.object().shape({
  // title: yup.string().required("!Empty Field"),
  // description: yup.string().required("!Empty Field"),
  items: yup.array().of(
    yup.object().shape({
      name: yup.string().required("!Empty Field"),
      // image: yup.object()
      //   .required('!Empty Field'),
      description: yup.string().required("!Empty Field"),
    })
  ),
});

const styles = StyleSheet.create({
  dynamicFieldContainer: {
    width: ScreenSize.width - normalized(Platform.OS == "ios" ? 30 : 40),
    borderRadius: normalized(10),
    alignItems: "center",
    height: normalized(120),
    marginTop: normalized(7),
    justifyContent: "space-between",
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
    width: normalized(150),
    height: 40,
  },
  addBtn: {
    padding: 20,
    marginTop: 20,
  },
  img: {
    width: normalized(40),
    height: normalized(40),
    borderRadius: normalized(40 / 2),
    marginVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: normalized(5),
  },
  deleteBtn: {
    padding: normalized(5),
  },
});

const mapStateToProps = (state) => ({
  // loading: getLoading(state),
});

const mapDispatchToProps = {
  createPost: createPostAction,
  createAnnouncementPost: createAnnouncementPostAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostCreateScreen);
